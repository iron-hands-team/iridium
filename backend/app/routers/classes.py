from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ClassSection, ClassEnrollment, User, UserRole
from app.schemas import (
    ClassSectionCreateRequest,
    ClassSectionUpdateRequest,
    ClassSectionResponse,
    AddStudentToClassRequest,
    ClassEnrollmentResponse,
)
from app.dependencies import require_staff

router = APIRouter(prefix="/classes", tags=["classes"])

def get_owned_class(class_id: int, db: Session, current_user: User) -> ClassSection:
    section = db.query(ClassSection).filter(ClassSection.id == class_id).first()
    if section is None:
        raise HTTPException(status_code=404, detail="Class not found.")
    if current_user.role != UserRole.admin and section.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="That's not your class.")
    return section

@router.get("", response_model=list[ClassSectionResponse])
def list_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    query = db.query(ClassSection)
    if current_user.role != UserRole.admin:
        query = query.filter(ClassSection.teacher_id == current_user.id)
    return query.order_by(ClassSection.name).all()

@router.post("", response_model=ClassSectionResponse)
def create_class(
    new_class: ClassSectionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    teacher_id = current_user.id
    if new_class.teacher_id is not None:
        if current_user.role != UserRole.admin:
            raise HTTPException(status_code=403, detail="Only admins can assign a class to another teacher.")
        teacher = db.query(User).filter(User.id == new_class.teacher_id).first()
        if teacher is None:
            raise HTTPException(status_code=404, detail="Teacher not found.")
        teacher_id = teacher.id

    section = ClassSection(name=new_class.name, teacher_id=teacher_id)
    db.add(section)
    db.commit()
    db.refresh(section)
    return section

@router.patch("/{class_id}", response_model=ClassSectionResponse)
def update_class(
    class_id: int,
    updates: ClassSectionUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    section = get_owned_class(class_id, db, current_user)

    data = updates.model_dump(exclude_unset=True)
    if "teacher_id" in data and data["teacher_id"] is not None:
        if current_user.role != UserRole.admin:
            raise HTTPException(status_code=403, detail="Only admins can reassign a class.")
        teacher = db.query(User).filter(User.id == data["teacher_id"]).first()
        if teacher is None:
            raise HTTPException(status_code=404, detail="Teacher not found.")
    elif "teacher_id" in data:
        data.pop("teacher_id")

    for field, value in data.items():
        setattr(section, field, value)

    db.commit()
    db.refresh(section)
    return section

@router.delete("/{class_id}", status_code=204)
def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    section = get_owned_class(class_id, db, current_user)
    db.delete(section)
    db.commit()

@router.get("/{class_id}/students", response_model=list[ClassEnrollmentResponse])
def list_class_students(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)
    return (
        db.query(ClassEnrollment)
        .filter(ClassEnrollment.class_id == class_id)
        .all()
    )

@router.post("/{class_id}/students", response_model=ClassEnrollmentResponse)
def add_student_to_class(
    class_id: int,
    new_student: AddStudentToClassRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)

    student = db.query(User).filter(User.username == new_student.username).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found.")
    if student.role != UserRole.student:
        raise HTTPException(status_code=400, detail="That user isn't a student.")

    existing = (
        db.query(ClassEnrollment)
        .filter(ClassEnrollment.class_id == class_id, ClassEnrollment.student_id == student.id)
        .first()
    )
    if existing is not None:
        raise HTTPException(status_code=400, detail="Student is already in this class.")

    enrollment = ClassEnrollment(class_id=class_id, student_id=student.id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

@router.delete("/{class_id}/students/{student_id}", status_code=204)
def remove_student_from_class(
    class_id: int,
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)

    enrollment = (
        db.query(ClassEnrollment)
        .filter(ClassEnrollment.class_id == class_id, ClassEnrollment.student_id == student_id)
        .first()
    )
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Student not in this class.")
    db.delete(enrollment)
    db.commit()