# Iridium API Routes

Base URL: `NEXT_PUBLIC_API_URL` (dev: `http://localhost:8000`)

Auth: JWT via `LoginManager` (fastapi-login). `/login` sets it as an
`httponly` cookie (`access-token`, `samesite=none`, `secure=true`) and
also returns it in the response body. Authenticated routes accept
either the cookie or an `Authorization: Bearer <token>` header.

Roles: `student`, `teacher`, `admin`.
- **staff** = `teacher` or `admin`
- **admin** = `admin` only

---

## Auth

### `POST /login`
Public. Body: `{ username, password }`.
Sets the `access-token` cookie and returns:
```json
{ "access_token": "...", "token_type": "bearer", "user": { ...UserResponse } }
```
`401` if username/password is wrong.

### `GET /me`
Auth required (any role). Returns the current user (`UserResponse`).

---

## Users

### `POST /users`
Admin only. Creates a user.
Body: `{ username, password, role, first_name, last_name }`.
Returns `UserResponse`. `400` if username taken.

### `GET /users?role=student|staff`
Admin only. Lists users. `role=staff` returns `teacher` + `admin`; any
other value (or omitted) returns everyone matching `student` filtering
logic as written — pass `student` or `staff` explicitly.

### `PATCH /users/{username}`
Admin only. Partial update — only send the fields you're changing.
Body (all optional): `{ first_name, last_name, middle_name, role }`.
Returns updated `UserResponse`. `404` if user not found.

### `DELETE /users/{username}`
Admin only. `204` on success, `404` if user not found.

---

## Announcements
Prefix: `/announcements`

### `GET /announcements`
Auth required (any role). Newest first.

### `POST /announcements`
Staff only. Body: `{ title, content }`. Author is the current user.

### `DELETE /announcements/{announcement_id}`
Staff only. `204` on success, `404` if not found.

---

## Events
Prefix: `/events`

### `GET /events`
Auth required (any role). Ordered by `start_time`.

### `POST /events`
Staff only.
Body: `{ title, description?, location?, start_time, end_time? }`.
`created_by` is the current user.

### `DELETE /events/{event_id}`
Staff only. `204` on success, `404` if not found.

---

## Clubs
Prefix: `/clubs`

### `GET /clubs`
Auth required (any role). Alphabetical.

### `POST /clubs`
Staff only. Body: `{ name, description?, sponsor_id? }`.
`400` if a club with that name already exists.

### `GET /clubs/{club_id}/members`
Auth required (any role). List of `{ id, user: UserResponse }`.

### `POST /clubs/{club_id}/join`
Auth required (any role). Joins the current user to the club.
`404` if club doesn't exist, `400` if already a member.

### `DELETE /clubs/{club_id}/leave`
Auth required (any role). Removes current user from the club.
`404` if not currently a member.

---

## Schedule
Prefix: `/schedule`

### `GET /schedule/me`
Auth required (any role). Current user's schedule, ordered by `period`.

### `GET /schedule/{user_id}`
Staff only. Any user's schedule by numeric DB id.

### `POST /schedule`
Staff only.
Body: `{ user_id, period, course_name, room?, start_time?, end_time? }`.

### `DELETE /schedule/{item_id}`
Staff only. `204` on success, `404` if not found.

---

## Misc

| Route | Auth | Notes |
|---|---|---|
| `GET /` | Public | `{ "message": "Iridium API is running" }` |
| `GET /health` | Public | `{ "status": "ok" }` |
| `GET /health/db` | Public | Runs `SELECT 1`; confirms DB connectivity |

---

## Not yet built (frontend has no page for these)
The API side is complete for announcements, events, clubs, and
schedule — the frontend just doesn't call them yet (see `app/page.tsx`,
`app/admin/page.tsx`).

There's also no password-reset endpoint (`/reset` is a frontend-only
dead link right now) and no self-service "update your own profile"
route — `PATCH /users/{username}` is admin-only.