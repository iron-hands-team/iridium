from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Bus, User, Destination
from app.schemas import BusResponse, BusRequest

from app.dependencies import require_staff, require_admin

router = APIRouter(prefix="/buses", tags=["buses"])


@router.get("", response_model=list[BusResponse])
def list_buses(
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    return db.query(Bus).all()


@router.post("", status_code=204)
def create_buses(
    buses: list[BusRequest],
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    db.query(Destination).delete(synchronize_session=False)
    db.query(Bus).delete(synchronize_session=False)
    for bus in buses:
        new_bus = Bus(name=bus.name, description=bus.desc, color=bus.color)
        db.add(new_bus)
        db.flush()
        new_destinations = []
        for destination in bus.destinations:
            new_destinations.append(
                Destination(
                    location=destination.location,
                    before_school_time=destination.beforeSchoolTime,
                    after_school_time=destination.afterSchoolTime,
                    color=destination.color,
                    bus_id=new_bus.id,
                )
            )
        db.add_all(new_destinations)
    db.commit()
