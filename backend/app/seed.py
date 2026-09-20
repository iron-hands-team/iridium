from app.database import Base, engine, SessionLocal
from app.models import User, UserRole
from app.auth import hash_password

def init_db_and_seed_admin():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.username == "admin").first()
        existing_student = db.query(User).filter(User.username == "student1").first()

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

        if existing_student is None:
            student = User(
                username="student1",
                hashed_password=hash_password("student123"),
                first_name="student 1",
                last_name="student 1",
                role=UserRole.student,
            )
            db.add(student)
            db.commit()
    finally:
        db.close()
