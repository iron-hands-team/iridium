from fastapi import APIRouter

router = APIRouter(prefix="/announcements", tags=["announcements"])

@router.get("")
def list_announcements():
    return ["announcement1", "announcement2", "announcement3", "announcement4"]