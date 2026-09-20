from fastapi import APIRouter

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.get("")
def schedule():
    return ["schedule"]

