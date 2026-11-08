from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import manager
#from app.models import Club, ClubMembership, User, ClubFavorite, UserRole
#from app.schemas import ClubCreateRequest, ClubUpdateRequest, ClubResponse, ClubMemberResponse

from app.models import Bus, User
from app.schemas import BusResponse, BusCreateRequest, BusUpdateRequest

from app.models import Bus

from app.dependencies import require_staff, require_admin

router = APIRouter(prefix="/buses", tags=["buses"])


@router.get("", response_model=list[BusResponse])
def list_buses(
 db: Session = Depends(get_db),
 _current_user: User = Depends(manager),
):

 return  db.query(Bus).all()


@router.post("", status_code=204)
def create_buses(buses:list[BusCreateRequest], db:Session = Depends(get_db), _current_user :User = Depends(require_admin)):
 db.query(Bus).delete()
 new_buses = []
 for bus in buses:
  new_buses.append(Bus(
   name=bus.name,
   description=bus.description,
   destinations=bus.destinations
  ))
  db.add_all(new_buses)
  db.commit()

  