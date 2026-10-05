from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Assignment, Grade, ClassEnrollment, User
from app.schemas import (
    AssignmentCreateRequest,
    AssignmentResponse,
    GradeUpdateRequest,
    GradeResponse,
    StudentClassGrades,
    StudentAssignmentGrade,
)
from app.dependencies import require_staff
from app.routers.classes import get_owned_class

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
            rows.append(
                StudentAssignmentGrade(
                    id=assignment.id,
                    name=assignment.name,
                    max_score=assignment.max_score,
                    score=grade.score if grade else None,
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