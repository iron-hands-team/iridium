from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Event, User
from app.schemas import EventCreateRequest, EventResponse
from app.dependencies import require_staff

router = APIRouter(prefix="/events", tags=["events"])

@router.get("", response_model=list[EventResponse])
def list_events(
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    return db.query(Event).order_by(Event.start_time).all()

@router.post("", response_model=EventResponse)
def create_event(
    new_event: EventCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    event = Event(
        title=new_event.title,
        description=new_event.description,
        location=new_event.location,
        start_time=new_event.start_time,
        end_time=new_event.end_time,
        created_by_id=current_user.id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found.")
    db.delete(event)
    db.commit()