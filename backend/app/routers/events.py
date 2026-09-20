from fastapi import APIRouter

router = APIRouter(prefix="/events", tags=["events"])

@router.get("")
def list_events():
    return ["event1"]

