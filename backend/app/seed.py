from sqlalchemy import text
from datetime import date, datetime, time, timedelta, timezone

from app.database import Base, engine, SessionLocal
from app.models import (
    User,
    UserRole,
    Announcement,
    AnnouncementLike,
    Club,
    ClubMembership,
    ClubFavorite,
    Event,
    EventRSVP,
    ScheduleItem,
    ClassSection,
    Assignment,
    Grade,
    ClassEnrollment,
    AttendanceRecord,
    Message,
    Rule,
    Report,
    Channel,
    ChatMessage,
    ChatReaction,
    Link,
    File,
    FileType,
    InfoSocial,
    Info,
    Settings,
    Guide,
)
from app.auth import hash_password


def init_db_and_seed_admin():
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE announcement ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE"))

    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == "admin").first() is not None:
            return

        now = datetime.now(timezone.utc)
        today = date.today()

        # users below
        admin = User(
            username="admin",
            hashed_password=hash_password("admin123"),
            first_name="admin",
            last_name="admin",
            role=UserRole.admin,
            title="Head Administrator",
        )
        teacher = User(
            username="teacher",
            hashed_password=hash_password("teacher123"),
            first_name="teacher",
            last_name="teacher",
            role=UserRole.teacher,
            title="AP Calculus BC Teacher",
        )
        teacher2 = User(
            username="teacher2",
            hashed_password=hash_password("teacher123"),
            first_name="Maria",
            last_name="Chen",
            role=UserRole.teacher,
            title="Chemistry Teacher",
        )
        teacher3 = User(
            username="teacher3",
            hashed_password=hash_password("teacher123"),
            first_name="David",
            last_name="Okafor",
            role=UserRole.teacher,
            title="US History Teacher",
        )
        student = User(
            username="student",
            hashed_password=hash_password("student123"),
            first_name="student",
            last_name="student",
            role=UserRole.student,
            title="Sophomore",
        )
        student2 = User(
            username="student2",
            hashed_password=hash_password("student123"),
            first_name="Ava",
            last_name="Martinez",
            role=UserRole.student,
            title="Freshman",
        )
        student3 = User(
            username="student3",
            hashed_password=hash_password("student123"),
            first_name="Liam",
            last_name="Patel",
            role=UserRole.student,
            title="Junior",
        )
        student4 = User(
            username="student4",
            hashed_password=hash_password("student123"),
            first_name="Noah",
            last_name="Kim",
            role=UserRole.student,
            title="Senior",
        )
        students = [student, student2, student3, student4]
        teachers = [teacher, teacher2, teacher3]
        db.add_all([admin, teacher, teacher2, teacher3, *students])
        db.commit()

        # below is classes, enrollments, assignments, grades, attendance
        calc = ClassSection(name="AP Calculus BC", teacher_id=teacher.id)
        chem = ClassSection(name="Chemistry", teacher_id=teacher2.id)
        history = ClassSection(name="US History", teacher_id=teacher3.id)
        db.add_all([calc, chem, history])
        db.commit()

        classes = [calc, chem, history]
        for class_section in classes:
            for s in students:
                db.add(ClassEnrollment(class_id=class_section.id, student_id=s.id))
        db.commit()

        for class_section in classes:
            a1 = Assignment(
                class_id=class_section.id,
                name="Homework 1",
                max_score=100,
                due_at=now - timedelta(days=3),
            )
            a2 = Assignment(
                class_id=class_section.id,
                name="Unit Test",
                max_score=100,
                due_at=now + timedelta(days=7),
            )
            db.add_all([a1, a2])
            db.commit()

            for i, s in enumerate(students):
                # Homework 1: everyone graded
                db.add(Grade(assignment_id=a1.id, student_id=s.id, score=100 - i * 7))
            db.commit()

            # one AttendanceRecord per student for the last 3 school days
            for day_offset, status in [(1, "present"), (2, "present"), (3, "tardy")]:
                for i, s in enumerate(students):
                    record_status = "absent" if (day_offset == 1 and i == 3) else status
                    db.add(
                        AttendanceRecord(
                            class_id=class_section.id,
                            student_id=s.id,
                            date=today - timedelta(days=day_offset),
                            status=record_status,
                        )
                    )
        db.commit()

        #schedules 
        periods = [
            (1, "AP Calculus BC", "204", time(8, 0), time(8, 50)),
            (2, "Chemistry", "118", time(9, 0), time(9, 50)),
            (3, "US History", "310", time(10, 0), time(10, 50)),
            (4, "Lunch", "Cafeteria", time(11, 0), time(11, 30)),
            (5, "Study Hall", "Library", time(11, 40), time(12, 30)),
        ]
        for s in students:
            for period, course_name, room, start_time, end_time in periods:
                db.add(
                    ScheduleItem(
                        user_id=s.id,
                        period=period,
                        course_name=course_name,
                        room=room,
                        start_time=start_time,
                        end_time=end_time,
                    )
                )
        teacher_periods = {
            teacher.id: (1, "AP Calculus BC", "204"),
            teacher2.id: (2, "Chemistry", "118"),
            teacher3.id: (3, "US History", "310"),
        }
        for t in teachers:
            period, course_name, room = teacher_periods[t.id]
            db.add(
                ScheduleItem(
                    user_id=t.id,
                    period=period,
                    course_name=course_name,
                    room=room,
                    start_time=time(8 + period - 1, 0),
                    end_time=time(8 + period - 1, 50),
                )
            )
            db.add(
                ScheduleItem(
                    user_id=t.id,
                    period=6,
                    course_name="Prep Period",
                    room=room,
                    start_time=time(13, 0),
                    end_time=time(13, 50),
                )
            )
        db.commit()

        # clubs, memberships, favorites, channels
        robotics = Club(
            name="Robotics Club",
            description="Design, build, and program competition robots.",
            sponsor_id=teacher2.id,
            categories=["STEM"],
        )
        debate = Club(
            name="Debate Team",
            description="Weekly practice debates and tournament prep.",
            sponsor_id=teacher3.id,
            categories=["Humanities"],
        )
        art = Club(
            name="Art Club",
            description="Open studio time and a yearly student art show.",
            categories=["Arts"],
        )
        db.add_all([robotics, debate, art])
        db.commit()

        db.add_all(
            [
                ClubMembership(club_id=robotics.id, user_id=student.id),
                ClubMembership(club_id=robotics.id, user_id=student3.id),
                ClubMembership(club_id=debate.id, user_id=student2.id),
                ClubMembership(club_id=debate.id, user_id=student4.id),
                ClubMembership(club_id=art.id, user_id=student.id),
                ClubMembership(club_id=art.id, user_id=student2.id),
                ClubFavorite(club_id=robotics.id, user_id=student.id),
                ClubFavorite(club_id=art.id, user_id=student2.id),
            ]
        )

        robotics_channel = Channel(name="Robotics Club", role="all", club_id=robotics.id)
        debate_channel = Channel(name="Debate Team", role="all", club_id=debate.id)
        general_channel = Channel(name="general", role="all")
        teachers_lounge = Channel(name="teachers-lounge", role="teacher")
        db.add_all([robotics_channel, debate_channel, general_channel, teachers_lounge])
        db.commit()

        msg1 = ChatMessage(
            text="Welcome to the school chat! Be kind and stay on topic.",
            user_id=admin.id,
            channel_id=general_channel.id,
        )
        msg2 = ChatMessage(
            text="Does anyone want to carpool to the regional meet?",
            user_id=student.id,
            channel_id=robotics_channel.id,
        )
        db.add_all([msg1, msg2])
        db.commit()
        db.add(ChatReaction(emoji="👍", user_id=student3.id, message_id=msg2.id))
        db.add(
            ChatMessage(
                text="Reminder: grades are due by Friday.",
                user_id=admin.id,
                channel_id=teachers_lounge.id,
            )
        )
        db.commit()

        #announcements, like
        a1 = Announcement(
            title="Welcome back!",
            content="We're excited to kick off the new semester. Check your schedule and class list below.",
            author_id=admin.id,
            pinned=True,
            role="all",
        )
        a2 = Announcement(
            title="Grades due Friday",
            content="All teachers: first-quarter grades must be finalized by end of day Friday.",
            author_id=admin.id,
            role="teacher",
        )
        a3 = Announcement(
            title="Robotics Club meeting moved",
            content="This week's Robotics Club meeting is moved to Thursday in room 118.",
            author_id=teacher2.id,
            role="student",
        )
        db.add_all([a1, a2, a3])
        db.commit()
        db.add_all(
            [
                AnnouncementLike(announcement_id=a1.id, user_id=student.id),
                AnnouncementLike(announcement_id=a1.id, user_id=student2.id),
                AnnouncementLike(announcement_id=a3.id, user_id=student3.id),
            ]
        )

        # ---- events, rsvps ------------------------------------------------
        e1 = Event(
            title="Fall Pep Rally",
            description="All-school assembly in the gym.",
            location="Main Gym",
            start_time=now + timedelta(days=5, hours=2),
            end_time=now + timedelta(days=5, hours=3),
            created_by_id=admin.id,
        )
        e2 = Event(
            title="Science Fair",
            description="Judged project presentations, open to families.",
            location="Cafeteria",
            start_time=now + timedelta(days=14, hours=3),
            end_time=now + timedelta(days=14, hours=6),
            created_by_id=teacher2.id,
        )
        e3 = Event(
            title="Parent-Teacher Conferences",
            description="Sign up for a 15-minute slot with your student's teachers.",
            location="Main Building",
            start_time=now + timedelta(days=21),
            end_time=now + timedelta(days=21, hours=5),
            created_by_id=admin.id,
        )
        db.add_all([e1, e2, e3])
        db.commit()
        db.add_all(
            [
                EventRSVP(event_id=e1.id, user_id=student.id),
                EventRSVP(event_id=e1.id, user_id=student2.id),
                EventRSVP(event_id=e2.id, user_id=student3.id),
            ]
        )

        #  messages
        db.add_all(
            [
                Message(
                    sender_id=student.id,
                    recipient_id=teacher.id,
                    subject="Question about Homework 1",
                    body="Hi, could you clarify problem 4 on last night's homework?",
                    read=True,
                ),
                Message(
                    sender_id=teacher.id,
                    recipient_id=student.id,
                    subject="Re: Question about Homework 1",
                    body="Sure — stop by during office hours tomorrow and we'll go over it.",
                ),
                Message(
                    sender_id=admin.id,
                    recipient_id=teacher2.id,
                    subject="Chemistry lab supplies",
                    body="The new lab supply order should arrive by Monday.",
                ),
            ]
        )

        # rules, reports, links, files
        db.add_all(
            [
                Rule(name="Dress Code", description="Follow the student handbook's dress code during school hours."),
                Rule(name="Attendance Policy", description="Notify the front office before 9am for any absence."),
                Rule(name="Academic Integrity", description="Cheating or plagiarism results in disciplinary action."),
            ]
        )
        db.add_all(
            [
                Report(
                    title="Broken locker",
                    description="Locker #214 won't latch shut.",
                    anonymous=False,
                    type="facilities",
                    role=None,
                    user_id=student.id,
                    resolved=False,
                ),
                Report(
                    title="Suggestion: later lunch",
                    description="Could lunch be moved 30 minutes later?",
                    anonymous=True,
                    type="suggestion",
                    role=None,
                    resolved=True,
                ),
            ]
        )
        db.add_all(
            [
                Link(label="School Calendar", href="https://example.edu/calendar", blank=True),
                Link(label="Student Handbook", href="https://example.edu/handbook", blank=True),
            ]
        )
        db.add_all(
            [
                File(title="Student Handbook", description="2026-27 student handbook (PDF)", type=FileType.pdf),
                File(title="Cafeteria Menu", description="This month's lunch menu", type=FileType.document),
            ]
        )

        # school info 
        info = Info(
            title="Hogwarts School of Witchcraft and Wizardry",
            description="A demo school record for Iridium.",
            address="Scottish Highlands, Great Britain",
            email="office@hogwarts.edu",
            number="1234567890",
        )
        db.add(info)
        db.commit()
        db.add_all(
            [
                InfoSocial(name="Instagram", link="https://instagram.com/hogwarts", info_id=info.id),
                InfoSocial(name="Twitter", link="https://twitter.com/hogwarts", info_id=info.id),
            ]
        )

        # finally settings, guides 
        db.add(
            Settings(
                data={
                    "features": [],
                    "archive": {"number": 30, "duration": "Days", "never": False},
                    "messages": {"number": 90, "duration": "Days", "never": False},
                    "slow": {"number": 5, "duration": "Seconds", "enabled": False},
                    "censored": {"words": [], "sensitive": False},
                    "paused": False,
                }
            )
        )
        db.add(
            Guide(
                title="Getting started with Iridium",
                description="A quick tour of the platform for new students and teachers.",
                label="Basics",
                sections=[
                    {"subheading": "Your dashboard", "text": "Check announcements and your schedule from the home page."},
                    {"subheading": "Clubs and chat", "text": "Join a club to unlock its chat channel and get updates."},
                ],
            )
        )

        db.commit()
    finally:
        db.close()