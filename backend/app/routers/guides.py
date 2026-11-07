from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Guide
from app.schemas import GuideRequest, GuideEditRequest
from app.dependencies import require_admin, manager

router = APIRouter(prefix="/guides", tags=["guides"])


@router.get("", response_model=list[GuideRequest])
def get_guides(db: Session = Depends(get_db), _current_user=Depends(manager)):
    return db.query(Guide).order_by(Guide.created_at, Guide.id).all()


@router.post("", status_code=204)
def add_guide(
    guide: GuideRequest,
    db: Session = Depends(get_db),
    _current_user=Depends(require_admin),
):
    sections = [s.model_dump(mode="json") for s in guide.sections]
    db.add(
        Guide(
            title=guide.title,
            description=guide.description,
            label=guide.label,
            sections=sections,
        )
    )
    db.commit()


@router.patch("/{guide_id}", status_code=204)
def edit_guide(
    guide_id: int,
    updates: GuideEditRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    existing = db.query(Guide).filter(Guide.id == guide_id).first()
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Guide with ID {guide_id} not found."
        )
    data = updates.model_dump(mode="json", exclude_unset=True)
    for required in ("title", "sections"):
        if required in data and data[required] is None:
            raise HTTPException(status_code=422, detail=f"{required} can't be empty.")
    for field, value in data.items():
        setattr(existing, field, value)
    db.commit()


@router.delete("/{guide_id}", status_code=204)
def delete_guide(
    guide_id: int,
    db: Session = Depends(get_db),
    _current_user=Depends(require_admin),
):
    existing = db.query(Guide).filter(Guide.id == guide_id).first()
    if existing is None:
        raise HTTPException(
            status_code=404, detail=f"Guide with ID {guide_id} not found."
        )
    db.delete(existing)
    db.commit()