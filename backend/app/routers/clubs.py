from fastapi import APIRouter

router = APIRouter(prefix="/clubs", tags=["clubs"])

@router.get("")
def list_clubs():
    return ["club1"]