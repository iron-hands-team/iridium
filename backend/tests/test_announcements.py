def _post(client, headers, title="Hello"):
    return client.post("/announcements", json={"title": title, "content": "Body text"}, headers=headers)


def test_anyone_logged_in_can_read_announcements(client, student):
    r = client.get("/announcements", headers=student)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_announcements_require_login(client):
    assert client.get("/announcements").status_code == 401


def test_students_cannot_post_announcements(client, student):
    assert _post(client, student).status_code == 403


def test_teachers_can_post_like_star_and_delete(client, teacher, student):
    created = _post(client, teacher, "Bake sale")
    assert created.status_code == 200, created.text
    aid = created.json()["id"]

    assert client.post(f"/announcements/{aid}/like", headers=student).status_code == 200
    assert client.post(f"/announcements/{aid}/star", headers=student).status_code == 200
    starred = client.get("/announcements/starred", headers=student).json()
    assert aid in [a["id"] for a in starred]

    assert client.delete(f"/announcements/{aid}", headers=student).status_code == 403
    assert client.delete(f"/announcements/{aid}", headers=teacher).status_code == 204
