from datetime import date as date_type

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import AttendanceRecord, ClassEnrollment, User
from app.schemas import (
    AttendanceRecordResponse,
    AttendanceStatusUpdateRequest,
    StudentClassAttendance,
    StudentAttendanceDay,
)
from app.dependencies import require_staff
from app.routers.classes import get_owned_class

router = APIRouter(tags=["attendance"])

@router.get("/classes/{class_id}/attendance", response_model=list[AttendanceRecordResponse])
def get_attendance(
    class_id: int,
    for_date: date_type = Query(..., alias="date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)

    enrolled_student_ids = [
        row.student_id
        for row in db.query(ClassEnrollment)
        .filter(ClassEnrollment.class_id==class_id)
        .all()
    ]

    existing_student_ids = {
        r.student_id
        for r in db.query(AttendanceRecord)
        .filter(AttendanceRecord.class_id==class_id, AttendanceRecord.date == for_date)
        .all()  
    }

    for student_id in enrolled_student_ids:
        if student_id not in existing_student_ids:
            db.add(
                AttendanceRecord(
                    class_id=class_id,
                    student_id=student_id,
                    date=for_date,
                    status="present",
                )
            )
    db.commit()

    records = (
        db.query(AttendanceRecord)
        .filter(AttendanceRecord.class_id == class_id, AttendanceRecord.date ==for_date)
        .all()
    )
    records.sort(key=lambda r: (r.student.last_name, r.student.first_name))
    return records

@router.patch(
    "/classes/{class_id}/attendance/{student_id}",
    response_model=AttendanceRecordResponse,
)
def set_attendance(
    class_id: int,
    student_id: int,
    updates: AttendanceStatusUpdateRequest,
    for_date: date_type = Query(..., alias="date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    get_owned_class(class_id, db, current_user)

    record = (
        db.query(AttendanceRecord)
        .filter(
            AttendanceRecord.class_id == class_id,
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.date == for_date,
        )
        .first()
    )
    if record is None:
        record = AttendanceRecord(
            class_id=class_id,
            student_id=student_id,
            date=for_date,
            status=updates.status,
        )
        db.add(record)
    else:
        record.status = updates.status

    db.commit()
    db.refresh(record)
    return record

@router.get("/attendance/me", response_model=list[StudentClassAttendance])
def my_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    enrollments = (
        db.query(ClassEnrollment)
        .filter(ClassEnrollment.student_id == current_user.id)
        .all()
    )
    result: list[StudentClassAttendance] = []
    for enrollment in enrollments:
        class_section = enrollment.class_section
        records = (
            db.query(AttendanceRecord)
            .filter(
                AttendanceRecord.class_id == class_section.id,
                AttendanceRecord.student_id == current_user.id,
            )
            .order_by(AttendanceRecord.date)
            .all()
        )
        result.append(
            StudentClassAttendance(
                class_id=class_section.id,
                class_name=class_section.name,
                records=[
                    StudentAttendanceDay(date=r.date, status=r.status)
                    for r in records
                ],
            )
        )
    return result