# Security

## Reporting a vulnerability

Please do not open a public issue. Report it privately through GitHub's "Report a vulnerability" button on the Security tab of this repository (or email the maintainers listed there). Include steps to reproduce. We aim to acknowledge reports within 3 business days.

## What Iridium does today

- Passwords hashed with bcrypt; login rate limited (5 per minute).
- Sessions use signed JWTs in an `httponly`, `secure`, `samesite=lax` cookie, expire after 45 minutes, and are revoked when an admin resets a password.
- Role-based access (student, teacher, admin) enforced on the server.
- Audit log of logins (successful and failed), account changes, settings changes, data exports and destructive actions, viewable by admins.
- Per-user data export (self or admin).
- Production mode refuses to start with a placeholder JWT secret, never creates demo accounts, and generates a random admin password.
- HTTPS with automatic certificates, HSTS, `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` headers via Caddy.
- Database and internal services are not exposed publicly in production.

## What it does not do yet

- Two-factor authentication.
- Account lockout beyond the rate limit.
- Encryption of uploaded files and database contents at rest (use disk encryption on the server).
- Email notifications, or a parent/guardian role.
- A third-party security audit or penetration test. Do not assume this software has been independently assessed.

## For schools running Iridium

You control the server and the data. Keep the server updated, use a long unique admin password, restrict SSH access, enable disk encryption, take and test backups (see docs/DEPLOYMENT.md), and remove accounts for people who leave.
