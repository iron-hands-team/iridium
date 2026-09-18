from fastapi import Depends, HTTPException, status
from app.auth import manager
from app.models import User,UserRole

def require_admin(current_user = Depends(manager)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Ya need to be an admin for that.")
    else:
        return current_user
    