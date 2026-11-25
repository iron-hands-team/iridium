# Iridium API Routes

Base URL: `https://localhost/api` (internal URL: `http://fastapi-backend:8000`)

Auth: JWT via `LoginManager` (fastapi-login). `/login` sets it as an
`httponly` cookie (`access-token`, `samesite=lax`, `secure=true`) and
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

### `GET /users/{username}`

Auth required (any role).
Returns `UserResponse`. `404` if user not found.

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

### `DELETE /clubs/{club_id}`

Admin only. `204` on success, `404` if club not found.

### `GET /clubs/{club_id}/members`

Auth required (any role). List of `{ id, user: UserResponse }`.

<!-- TODO: add patch to update club data -->

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

## Chat

Prefix: `/chat`

### `GET /channels`

Auth required (any role). General public channels and the current user's club channels.

### `POST /channels`

Admin only. Creates a new chat channel and returns the new channel ID on success, `403` if channel name already exists.

### `GET /channel/{channel_id}`

Auth required (any role). All channel message data (returning only a limited number of messages should be implemented)

### `POST /send`

Auth required (any role). Sends a message to the current channel, `204` on success.
Body: `{ message, channel_id, replying? }`.

### `PATCH /message/{message_id}`

Auth required (any role). Edits a message, `404` if message doesn't exist.
Body (all optional): `{ message, channel_id, replying }`.

### `DELETE /message/{message_id}`

Auth required (any role). Deletes a message, `204` on success.

---

## School info

### `GET /map`

Auth required (any role). Returns school map images and labels.Post

### `POST /map/upload`

Admin only. Upload multiple map images to Garage storage and add image labels.
Body: `{ labels }`

### `DELETE /map/upload`

Admin only. Deletes map items, images, and labels.

### `GET /rules`

Auth required (any role). Returns a list of school rules.

### `POST /rules`

Admin only. Adds school rules and descriptions.
Body: `{ id, name, description? }[]`

### `GET /search`

Auth required (any role). Searches the database for users, announcements, events, and clubs matching the search query with limit (default `5`).

### `GET /reports`

Staff only. Fetches reports submitted by users, `403` if accessed by a student.

### `POST /reports`

Auth required (any role). Submits a report to teachers/admin, `204` on success.
Body: `{ type, title, description, anonymous, role?, user? }`

### `DELETE /reports/{report_id}`

Staff only. Deletes specified report, `204` on success, `403` if accessed by a student.

### `GET /links`

Auth required (any role). Fetches all uploaded links and their labels.

### `POST /links`

Admin only. Creates and replaces original links with set of new links and their data, `204` on success, `403` if not accessed by an admin.
Body: `{ label, href, blank? }`

### `GET /files`

Auth required (any role). Fetches all uploaded files and their information.

### `POST /files`

Admin only. Creates and replaces original files with set of new files and their data, `204` on success, `403` if not accessed by an admin.
Body: `{ title, description?, type }[]`

### `GET /school`

Auth required (any role). Fetches school information, branding assets, and contact methods.

### `POST /school`

Admin only. Saves and uploads school information, branding assets, and contact methods and returns Garage upload URLs for the logo and banner on success, `403` if not accessed by an admin.
Body: `{ title, description?, address?, email?, number?, socials }`

---

## Platform settings

### `GET /settings`

Admin only. Fetches platform settings for enabled features, automated tasks, and other options.

### `POST /settings`

Admin only. Saves all the platform settings for enabled features, automated tasks, and other options. `204` on success, `403` if not accessed by an admin.
Body: `{ features, archive, messages, slow, censored, paused }`

### `POST /pause`

Admin only (requires password reverification). Pauses all backend operations and user interactions, effectively freezing/pausing the platform for maintenance, emergency, or other purposes. `204` on success, `400` if password is incorrect, `403` if not accessed by an admin.
Body: `{ password }`

### `POST /clear`

Admin only (requires password reverification). Deletes all data except the admin user performing the operation, the migration history and the audit log. This is very dangerous. Logged as `data_clear`. `204` on success, `400` if password is incorrect, `403` if not accessed by an admin.
Body: `{ password }`

---

## Misc

| Route            | Auth   | Notes                                     |
| ---------------- | ------ | ----------------------------------------- |
| `GET /`          | Public | `{ "message": "Iridium API is running" }` |
| `GET /health`    | Public | `{ "status": "ok" }`                      |
| `GET /health/db` | Public | Runs `SELECT 1`; confirms DB connectivity |

---

## Audit log and data export

### `GET /audit-log?action=&limit=100&offset=0`

Admin only. Newest first. `limit` is at most 500. Each entry has `id`, `created_at`, `actor_id`, `actor_username`, `action`, `target`, `detail`, `ip`. Recorded actions: `login_success`, `login_failed`, `user_create`, `user_update`, `user_delete`, `users_bulk_delete`, `password_reset`, `password_reset_dismissed`, `settings_update`, `platform_pause`, `platform_resume`, `data_clear`, `data_export`.

### `GET /users/{username}/export`

The user themself or an admin; anyone else gets `404`. Returns everything stored about the user as JSON (profile, posts, messages, memberships, schedule). Never includes the password hash. Anonymous reports are excluded. Logged as `data_export`.

---

## Other routers

This file only documents the original routes. The backend also has routers
for classes and quizzes, grades and submissions, attendance, direct messages,
notifications, guides, buses, and platform settings. See `backend/app/routers/`
(or `/docs` in development) for the current list.

There is no self-service password reset. Users request one with
`POST /users/{username}/request` and an admin completes it with
`PATCH /users/{username}/reset`.

<!-- TODO: document the routers above -->
