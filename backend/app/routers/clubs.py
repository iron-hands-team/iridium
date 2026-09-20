from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
from app.models import Club, ClubMembership, User
from app.schemas import ClubCreateRequest, ClubResponse, ClubMemberResponse
from app.dependencies import require_staff

router = APIRouter(prefix="/clubs", tags=["clubs"])

@router.get("", response_model=list[ClubResponse])
def list_clubs(
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    return db.query(Club).order_by(Club.name).all()

@router.post("", response_model=ClubResponse)
def create_club(
    new_club: ClubCreateRequest,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    existing = db.query(Club).filter(Club.name == new_club.name).first()
    if existing is not None:
        raise HTTPException(status_code=400, detail="Club already exists.")
    club = Club(**new_club.model_dump())
    db.add(club)
    db.commit()
    db.refresh(club)
    return club

@router.get("/{club_id}/members", response_model=list[ClubMemberResponse])
def list_club_members(
    club_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    return db.query(ClubMembership).filter(ClubMembership.club_id == club_id).all()

@router.post("/{club_id}/join", response_model=ClubMemberResponse)
def join_club(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    club = db.query(Club).filter(Club.id == club_id).first()
    if club is None:
        raise HTTPException(status_code=404, detail="Club not found.")

    existing = (
        db.query(ClubMembership)
        .filter(ClubMembership.club_id == club_id, ClubMembership.user_id == current_user.id)
        .first()
    )
    if existing is not None:
        raise HTTPException(status_code=400, detail="Already a member.")

    membership = ClubMembership(club_id=club_id, user_id=current_user.id)
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership

@router.delete("/{club_id}/leave", status_code=204)
def leave_club(
    club_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    membership = (
        db.query(ClubMembership)
        .filter(ClubMembership.club_id == club_id, ClubMembership.user_id == current_user.id)
        .first()
    )
    if membership is None:
        raise HTTPException(status_code=404, detail="Not a member.")
    db.delete(membership)
    db.commit()