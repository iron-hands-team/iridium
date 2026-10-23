from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.database import get_db
from app.models import (
    MapItem,
    User,
    Rule,
    Announcement,
    Event,
    Club,
    ClassSection,
    Report,
    Link,
    File,
)
from app.schemas import (
    MapUploadResponse,
    AddMapItemsRequest,
    MapResponse,
    RuleResponse,
    SearchResponse,
    ClassSectionResponse,
    ReportResponse,
    LinkResponse,
    FileResponse,
    FileUploadResponse,
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

    classes = (
        db.query(ClassSection).filter(ClassSection.name.ilike(query)).limit(l).all()
    )

    return {
        "users": users,
        "announcements": announcements,
        "events": events,
        "clubs": clubs,
        "classes": classes,
    }


@router.get("/reports", response_model=list[ReportResponse])
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    if current_user.role == "student":
        raise HTTPException(status_code=403, detail="Insufficient permission")

    query = db.query(Report)
    if current_user.role == "teacher":
        query = query.filter(or_(Report.role == None, Report.role == "Teacher"))

    reports = query.order_by(Report.id.desc()).all()
    return [
        ReportResponse(
            id=r.id,
            title=r.title,
            description=r.description,
            anonymous=r.anonymous,
            type=r.type,
            role=r.role,
            reporter=r.user if (not r.anonymous and r.user is not None) else None,
        )
        for r in reports
    ]


@router.delete("/reports/{report_id}", status_code=204)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    if current_user.role == "student":
        raise HTTPException(status_code=403, detail="Insufficient permission")

    report = db.query(Report).filter(Report.id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not foind.")
    db.delete(report)
    db.commit()


@router.post("/reports", status_code=204)
def submit_report(
    report: ReportResponse,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager),
):
    new_report = Report(
        title=report.title,
        description=report.description,
        anonymous=report.anonymous,
        type=report.type,
        role=report.role,
        user_id=None if report.anonymous else current_user.id,
    )
    db.add(new_report)
    db.commit()


@router.get("/links", response_model=list[LinkResponse])
def get_links(db: Session = Depends(get_db), _current_user: User = Depends(manager)):
    return db.query(Link).all()


@router.post("/links", status_code=204)
def add_links(
    links: list[LinkResponse],
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    db.query(Link).delete()

    new_links = []
    for link in links:
        new_links.append(Link(label=link.label, href=link.href, blank=link.blank))

    db.add_all(new_links)
    db.commit()


@router.get("/files", response_model=list[FileResponse])
def get_files(db: Session = Depends(get_db), _current_user: User = Depends(manager)):
    return db.query(File).all()


@router.post("/files", response_model=FileUploadResponse)
def upload_files(
    files: list[FileResponse],
    db: Session = Depends(get_db),
    _current_user: User = Depends(manager),
):
    db.query(File).delete()

    new_files = []
    uploads = []
    for index, file in enumerate(files):
        new_files.append(
            File(title=file.title, description=file.description, type=file.type)
        )
        object_key = f"files/{index}"
        url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={"Bucket": BUCKET_NAME, "Key": object_key},
            ExpiresIn=120,
        ).replace(ENDPOINT, "")
        uploads.append(url)

    db.add_all(new_files)
    db.commit()

    return {"uploads": uploads}
