# Privacy and data handling

Iridium is self-hosted. The school (or whoever runs the server) controls all data; the developers do not receive it. This document describes what the software stores. It is not legal advice, and it is not a statement that your school is compliant with any law.

## What is stored

- Accounts: username, first/middle/last name, title, role, bcrypt password hash.
- School content: announcements, events, clubs and memberships, schedules, chat messages, reports (including anonymous ones), links, files, school info.
- Audit log: who did what and when, with IP address, for security review.
- Uploaded files live in the school's own storage service on the same server.

## What is not stored or sent

No analytics, advertising or tracking services, and no data is sent to third parties by the application itself.

## Access

Students see their own data and shared content. Teachers and admins have broader access according to their role. Admins can read the audit log. Anonymous reports are not linked to the reporter in exports.

## Data rights

- Export: `GET /users/{username}/export` returns everything stored about a user (the user or an admin can request it).
- Deletion: admins can delete users; their content is removed with them.
- Retention: posts and messages can be archived and deleted automatically on a schedule set in platform settings. The audit log is kept until the school clears it.
- Backups contain a copy of everything until they are rotated out (14 by default).

## Schools in the US

If your school is subject to FERPA or COPPA (students under 13), your school is responsible for the legal basis and parental consent for using any online service. Use docs/DPA-TEMPLATE.md as a starting point for the agreement between the school and whoever provides setup and support, and have it reviewed by a lawyer or your district.
