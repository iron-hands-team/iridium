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
        row.student.id
        for row in db.query(ClassEnrollment)
        .filter(ClassEnrollment.class_id==class_id)
        .all()
    ]

    existing_student_ids = {
        r.student_id
        for r in db.query(AttendanceRecord)
    }