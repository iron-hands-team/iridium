# [Iridium](https://iridium.tonymac.net)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![Website homepage screenshot](/banner.png)

**Access the deployed demo version [here](https://iridium.tonymac.net) with username `admin` and password `admin123`.**

Iridium is an easy to use online platform for schools to post announcements, view schedules, and manage students and staff, inspired by [TJHSST](https://tjhsst.fcps.edu)'s intranet [Ion](https://github.com/tjcsl/ion).

## Pages

- Homepage: shows announcements, customizable widgets, and other important information
- _more coming soon_

## Architecture

- Frontend: [Next.js](https://nextjs.org) as the frontend framework with the technologies [React](https://react.dev), [TypeScript](https://typescriptlang.org), and [Tailwind](https://tailwindcss.com).
- Backend: [FastAPI](https://fastapi.tiangolo.com) as the backend [Python](https://python.org) framework for the API and server operations, which connects to the [PostgreSQL](https://postgresql.org) database and the [Garage](https://garagehq.deuxfleurs.fr/) object storage.
- Reverse proxy: Iridium uses [Caddy](https://caddyserver.com/) as both a reverse proxy and a TLS certificate manager to resolve server and frontend requests.
- Environment: the entire app is [dockerized](https://docker.com) into 5 containers: caddy, garage, db, backend, and frontend, with all the dependencies set up.

## Quick start

To host Iridium for your school or for other purposes, simply follow these steps below:

1. Clone the GitHub [repository](https://github.com/iron-hands-team/iridium) using the command
   ```bash
   git clone https://github.com/iron-hands-team/iridium.git
   ```
2. Open it with your favorite code editor or through the terminal
3. Create the `.env` file using the `.env.example` template and replace the variables with your secrets:

   ```bash
   cp .env.example .env
   ```

4. Start the Garage container to configure it:

   ```bash
   docker compose up -d garage
   ```

5. Run the following commands to set a new Garage layout and set up the keys:

   ```bash
   docker exec -it garage /garage status
   docker exec -it garage /garage layout assign <ID_FROM_PREV_COMMAND> -c 5G -z garage
   docker exec -it garage /garage layout apply --version 1
   docker exec -it garage /garage key create iridium-key
   docker exec -it garage /garage bucket create iridium-uploads
   docker exec -it garage /garage bucket allow --read --write iridium-uploads --key iridium-key
   ```

6. Copy the Garage access and secret keys to `.env` (`GARAGE_ACCESS_KEY` and `GARAGE_SECRET_KEY`) and start Docker compose:

   ```bash
   docker compose up -d
   ```

7. Alternatively, if you want to run the production build of the app, uncomment the frontend production service then comment out the original frontend development service in `compose.yaml` and run:

   ```bash
   docker compose up -d
   ```

8. Navigate to https://localhost (port 80) to use the fully functional web interface and access the API at https://localhost/api

## Contribution

Any kind of contribution is welcome, but please follow the guideline below!

- Submit an issue if there's a bug/issue or if you want to suggest new features/subscriptions to be added.
- Submit a pull request if you want to add or improve the code base!
- Commit messages should be specific and address the issue
- Please don't submit random issues that aren't specific
- Please don't submit pull requests that "fix typo" or "improve formatting"
