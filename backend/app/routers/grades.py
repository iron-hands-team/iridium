from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Assignment, Grade, Submission, ClassEnrollment, User, NotificationType, utcnow
from app.schemas import (
    AssignmentCreateRequest,
    AssignmentResponse,
    GradeUpdateRequest,
    GradeResponse,
    SubmissionResponse,
    SubmissionCreateRequest,
    UploadResponse,
    StudentClassGrades,
    StudentAssignmentGrade,
)
from app.dependencies import require_staff
from app.routers.classes import get_owned_class
from app.notify import create_notification
from app.s3 import s3_client, BUCKET_NAME, ENDPOINT

router = APIRouter(tags=["grades"])

def get_owned_assignment(assignment_id: int, db: Session, current_user: User) -> Assignment:
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found.")
    get_owned_class(assignment.class_id, db, current_user)
    return assignment

@router.get("/classes/{class_id}/assignments", response_model=list[AssignmentResponse])
def list_assignments(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)
    return (
        db.query(Assignment)
        .filter(Assignment.class_id == class_id)
        .order_by(Assignment.created_at)
        .all()
    )

@router.post("/classes/{class_id}/assignments", response_model=AssignmentResponse)
def create_assignment(
    class_id: int,
    new_assignment: AssignmentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)

    assignment = Assignment(
        class_id=class_id,
        name=new_assignment.name,
        max_score=new_assignment.max_score,
        due_at=new_assignment.due_at,
    )
    db.add(assignment)
    db.flush()  # need assignment.id before creating blank grade rows

    enrolled_student_ids = [
        row.student_id
        for row in db.query(ClassEnrollment)
        .filter(ClassEnrollment.class_id == class_id)
        .all()
    ]

    for student_id in enrolled_student_ids:
        db.add(Grade(assignment_id=assignment.id, student_id=student_id, score=None))

    db.commit()
    db.refresh(assignment)
    return assignment

@router.delete("/assignments/{assignment_id}", status_code=204)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    assignment = get_owned_assignment(assignment_id, db, current_user)
    db.delete(assignment)
    db.commit()

@router.patch("/assignments/{assignment_id}/grades/{student_id}", response_model=GradeResponse)
def set_grade(
    assignment_id: int,
    student_id: int,
    updates: GradeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    assignment = get_owned_assignment(assignment_id, db, current_user)

    grade = (
        db.query(Grade)
        .filter(Grade.assignment_id == assignment.id, Grade.student_id == student_id)
        .first()
    )
    if grade is None:
        grade = Grade(assignment_id=assignment.id, student_id=student_id, score=updates.score)
        db.add(grade)
    else:
        grade.score = updates.score

    if updates.score is not None:
        create_notification(
            db,
            user_id=student_id,
            type=NotificationType.grade,
            title=f"New grade posted for {assignment.name}",
            body=f"Score: {updates.score}/{assignment.max_score}",
            link="/grades",
        )

    db.commit()
    db.refresh(grade)
    return grade

@router.get("/grades/me", response_model=list[StudentClassGrades])
def my_grades(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    enrollments = (
        db.query(ClassEnrollment)
        .filter(ClassEnrollment.student_id == current_user.id)
        .all()
    )

    result: list[StudentClassGrades] = []
    for enrollment in enrollments:
        class_section = enrollment.class_section
        assignments = (
            db.query(Assignment)
            .filter(Assignment.class_id == class_section.id)
            .order_by(Assignment.created_at)
            .all()
        )
        rows = []
        for assignment in assignments:
            grade = (
                db.query(Grade)
                .filter(
                    Grade.assignment_id == assignment.id,
                    Grade.student_id == current_user.id,
                )
                .first()
            )
            submission = (
                db.query(Submission)
                .filter(
                    Submission.assignment_id == assignment.id,
                    Submission.student_id == current_user.id,
                )
                .first()
            )
            rows.append(
                StudentAssignmentGrade(
                    id=assignment.id,
                    name=assignment.name,
                    max_score=assignment.max_score,
                    score=grade.score if grade else None,
                    due_at=assignment.due_at,
                    submitted_at=submission.submitted_at if submission else None,
                )
            )
        result.append(
            StudentClassGrades(
                class_id=class_section.id,
                class_name=class_section.name,
                assignments=rows,
            )
        )
    return result

def get_enrolled_assignment(assignment_id: int, db: Session, current_user: User) -> Assignment:
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found.")
    enrolled = (
        db.query(ClassEnrollment)
        .filter(
            ClassEnrollment.class_id == assignment.class_id,
            ClassEnrollment.student_id == current_user.id,
        )
        .first()
    )
    if enrolled is None:
        raise HTTPException(status_code=403, detail="You're not enrolled in this class.")
    return assignment

@router.post("/assignments/{assignment_id}/submit", response_model=UploadResponse)
def submit_assignment(
    assignment_id: int,
    submission: SubmissionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    assignment = get_enrolled_assignment(assignment_id, db, current_user)

    object_key = f"submissions/{assignment.id}/{current_user.id}"
    url = s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": BUCKET_NAME, "Key": object_key},
        ExpiresIn=120,
    ).replace(ENDPOINT, "")

    existing = (
        db.query(Submission)
        .filter(Submission.assignment_id == assignment.id, Submission.student_id == current_user.id)
        .first()
    )
    if existing is None:
        db.add(
            Submission(
                assignment_id=assignment.id,
                student_id=current_user.id,
                filename=submission.filename,
            )
        )
    else:
        existing.filename = submission.filename
        existing.submitted_at = utcnow()
    db.commit()

    return {"presigned_url": url}

@router.get("/assignments/{assignment_id}/submissions", response_model=list[SubmissionResponse])
def list_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_assignment(assignment_id, db, current_user)
    return (
        db.query(Submission)
        .filter(Submission.assignment_id == assignment_id)
        .order_by(Submission.submitted_at)
        .all()
    )

@router.get("/assignments/{assignment_id}/submission/me", response_model=SubmissionResponse | None)
def my_submission(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    get_enrolled_assignment(assignment_id, db, current_user)
    return (
        db.query(Submission)
        .filter(Submission.assignment_id == assignment_id, Submission.student_id == current_user.id)
        .first()
    )