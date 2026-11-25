from app.models import AuditLog, User


def _actions(db_session):
    db_session.expire_all()
    return [row.action for row in db_session.query(AuditLog).order_by(AuditLog.id)]


def test_failed_login_is_logged_without_the_password(client, db_session):
    client.post("/login", json={"username": "admin", "password": "super-secret-guess"})
    rows = db_session.query(AuditLog).filter(AuditLog.action == "login_failed").all()
    assert len(rows) == 1
    assert rows[0].actor_username == "admin"
    assert "super-secret-guess" not in " ".join(str(v) for v in (rows[0].detail, rows[0].target, rows[0].actor_username))


def test_successful_login_is_logged(client, db_session):
    client.post("/login", json={"username": "student", "password": "student123"})
    assert "login_success" in _actions(db_session)


def test_admin_actions_are_logged(client, admin, db_session):
    body = {"username": "audited", "password": "longenough1", "role": "student",
            "first_name": "A", "last_name": "U", "title": "T"}
    client.post("/users", json=body, headers=admin)
    client.patch("/users/audited", json={"first_name": "Changed"}, headers=admin)
    client.delete("/users/audited", headers=admin)
    assert {"user_create", "user_update", "user_delete"} <= set(_actions(db_session))


def test_audit_log_endpoint_is_admin_only_and_filterable(client, admin, student):
    client.post("/login", json={"username": "admin", "password": "wrong"})
    assert client.get("/audit-log", headers=student).status_code == 403
    all_rows = client.get("/audit-log", headers=admin).json()
    failed = client.get("/audit-log?action=login_failed", headers=admin).json()
    assert len(failed) >= 1
    assert all(r["action"] == "login_failed" for r in failed)
    assert len(all_rows) >= len(failed)
    assert "hashed_password" not in str(all_rows)


def test_audit_trail_survives_deleting_the_user_and_clearing_data(client, admin, db_session):
    body = {"username": "gone", "password": "longenough1", "role": "student",
            "first_name": "G", "last_name": "O", "title": "T"}
    client.post("/users", json=body, headers=admin)
    gone = client.post("/login", json={"username": "gone", "password": "longenough1"})
    assert gone.status_code == 200
    client.cookies.clear()
    assert client.delete("/users/gone", headers=admin).status_code == 204

    rows = db_session.query(AuditLog).filter(AuditLog.actor_username == "gone").all()
    db_session.expire_all()
    assert rows and all(r.actor_id is None for r in db_session.query(AuditLog).filter(AuditLog.actor_username == "gone"))

    assert client.post("/clear", json={"password": "admin123"}, headers=admin).status_code == 204
    db_session.expire_all()
    assert "data_clear" in _actions(db_session)
    assert "user_create" in _actions(db_session)  # earlier entries are kept
    assert db_session.query(User).count() == 1


def test_bulk_delete_removes_users_that_have_related_data(client, admin, db_session):
    # student2 is enrolled in classes and has grades in the demo seed.
    r = client.post("/users/bulk-delete", json={"usernames": ["student2", "student3"]}, headers=admin)
    assert r.status_code == 204
    db_session.expire_all()
    remaining = {u.username for u in db_session.query(User)}
    assert "student2" not in remaining and "student3" not in remaining
    assert "bulk" in " ".join(a for a in _actions(db_session) if "bulk" in a)


def test_user_can_export_their_own_data(client, student):
    r = client.get("/users/student/export", headers=student)
    assert r.status_code == 200
    data = r.json()
    assert data["profile"]["username"] == "student"
    assert "hashed_password" not in str(data)
    assert {"grades", "messages_sent", "attendance", "schedule"} <= set(data)


def test_export_is_limited_to_self_or_admin(client, student, student2, admin, teacher):
    assert client.get("/users/student/export", headers=student2).status_code == 404
    assert client.get("/users/student/export", headers=teacher).status_code == 404
    assert client.get("/users/student/export", headers=admin).status_code == 200
    assert client.get("/users/nobody/export", headers=admin).status_code == 404


def test_export_is_audited(client, student, db_session):
    client.get("/users/student/export", headers=student)
    assert "data_export" in _actions(db_session)
