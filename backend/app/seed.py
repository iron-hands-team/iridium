from app.database import Base, engine, SessionLocal
from app.models import User, UserRole
from app.auth import hash_password

def init_db_and_seed_admin():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.username == "admin").first()
        existing_teacher = db.query(User).filter(User.username == "teacher").first()
        existing_student = db.query(User).filter(User.username == "student").first()

        if existing_admin is None:
            admin = User(
                username="admin",
                hashed_password=hash_password("admin123"),
                first_name="admin",
                last_name="admin",
                role=UserRole.admin,
            )
            db.add(admin)
            db.commit()

        if existing_teacher is None:
            teacher = User(
                username="teacher",
                hashed_password=hash_password("teacher123"),
                first_name="teacher",
                last_name="teacher",
                role=UserRole.teacher,
            )
            db.add(teacher)
            db.commit()

        if existing_student is None:
            student = User(
                username="student",
                hashed_password=hash_password("student123"),
                first_name="student",
                last_name="student",
                role=UserRole.student,
            )
            db.add(student)
            db.commit()
        
        # TODO: also optionally seed announcements, events, classes, etc. to demo everything

    finally:
        db.close()
