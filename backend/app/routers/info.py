from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.database import get_db
from app.models import MapItem, User, Rule, Announcement, Event, Club
from app.schemas import (
    MapUploadResponse,
    AddMapItemsRequest,
    MapResponse,
    RuleResponse,
    SearchResponse,
)
from app.dependencies import require_admin, manager
from app.s3 import s3_client, s3_internal, BUCKET_NAME, ENDPOINT

router = APIRouter()


@router.get("/map", response_model=list[MapResponse])
def get_map_items(
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    map_items = db.query(MapItem)
    return map_items.all()


@router.post("/map/upload", response_model=MapUploadResponse)
def post_map_items(
    map_items: AddMapItemsRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    items: list[str] = []
    for index, label in enumerate(map_items.labels):
        map_item = db.get(MapItem, index + 1)
        if map_item is None:
            map_item = MapItem(label=label)
            db.add(map_item)
        else:
            map_item.label = label
        object_key = f"map/{index}"
        url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={"Bucket": BUCKET_NAME, "Key": object_key},
            ExpiresIn=120,
        ).replace(ENDPOINT, "")
        items.append(url)
    db.commit()

    return {"uploads": items}


@router.delete("/map/upload", status_code=204)
def delete_upload_url(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    map_items = db.query(MapItem)
    for index, map_item in enumerate(map_items):
        s3_internal.delete_object(
            Bucket=BUCKET_NAME,
            Key=f"map/{index}",
        )
    map_items.delete()
    db.commit()


@router.get("/rules", response_model=list[RuleResponse])
def get_rules(db: Session = Depends(get_db), _current_user: User = Depends(manager)):
    rules = db.query(Rule)
    return rules.all()


@router.post("/rules", status_code=201)
def create_rules(
    rules: list[RuleResponse],
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    db.query(Rule).delete()

    new_items = []
    for rule in rules:
        new_items.append(Rule(name=rule.name, description=rule.description))

    db.add_all(new_items)
    db.commit()


@router.get("/search", response_model=SearchResponse)
def get_search(
    q: str = "",
    l: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    if l == 0 or q == "":
        raise HTTPException(
            status_code=501, detail="Please provide a valid seaarch query and limit"
        )
    limit = 20 if l > 20 else l
    query = f"%{q}%"
    users = (
        db.query(User)
        .filter(
            or_(
                User.username.ilike(query),
                User.first_name.ilike(query),
                User.last_name.ilike(query),
                User.title.ilike(query),
            )
        )
        .limit(l)
        .all()
    )
    announcements = (
        db.query(Announcement)
        .filter(
            Announcement.archived == False,
            or_(
                current_user.role == "admin",
                Announcement.role == current_user.role,
                Announcement.role == "all",
            ),
            or_(
                Announcement.title.ilike(query),
                Announcement.content.ilike(query),
            ),
        )
        .limit(l)
        .all()
    )
    events = (
        db.query(Event)
        .filter(or_(Event.title.ilike(query), Event.description.ilike(query)))
        .limit(l)
        .all()
    )
    clubs = (
        db.query(Club)
        .filter(
            or_(
                Club.name.ilike(query),
                Club.description.ilike(query),
                func.array_to_string(Club.categories, " ").ilike(query),
            )
        )
        .limit(l)
        .all()
    )

    # TODO: add more search types

    return {
        "users": users,
        "announcements": announcements,
        "events": events,
        "clubs": clubs,
    }
