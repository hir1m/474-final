# 474 Final Mock Canvas

## Auth Module (/auth)

**Tech Stack:**

- Node.js
- PostgreSQL

**ENV Variables:**

`POSTGRES_URL`: PG connection string

`DB_NAME`: Name of the PG DB, preferably `auth`

`JWT_SECRET`: A random string, must be kept consistent with `JWT_SECRET` at other services

`PORT`: Usually set by GCP

**Initial DB Setup:**

You will need to run `yarn install` and setup `mikro-orm.config.ts` with the correct db config. After that, run `yarn mikro-orm migration:up`

## Course / Enrollment Modules (/course & /enrollment)

**Tech Stack:**

- Node.js
- GCP Datastore

**ENV Variables:**

`DB_NAME`: Name of the PG DB, preferably `course` / `enrollment`

`NODE_ENV`: Set to `production` if prod

`JWT_SECRET`: A random string, must be kept consistent with `JWT_SECRET` at other services

`PORT`: Usually set by GCP

**Initial DB Setup:**

Not required, GCP will auto populate

## Web

**Tech Stack:**

- Node.js (Next.js)

**ENV Variables:**

`NEXT_PUBLIC_AUTH_URL` / `NEXT_PUBLIC_COURSE_URL` / `NEXT_PUBLIC_ENROLLMENT_URL`: API endpoints of the 3 microservices, these are required

`NODE_ENV`: Set to `production` if prod

`PORT`: Usually set by GCP
