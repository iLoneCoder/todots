# About app

This is a Kanban application with only the backend, where users can register, create boards, add buckets to boards, create cards in buckets, and add comments and attachments to cards. 

<a href="https://documenter.getpostman.com/view/29627772/2sAYBXBr2d" target="_blank">API documentation</a>

# Technology
This app is built in Node.js with TypeScript. PostgreSQL is used as the database with Sequelize (including migrations). Redis is used to limit the number of requests (the limit is ridiculously large :D). Both Redis and PostgreSQL are installed via Docker Compose, which creates volumes to preserve data when the containers are stopped.


# Usage
After pulling project run commands

Install packages
```bash
pnpm install
```
pull images and run containers 
```bash 
docker compose up
```
Create database, run the command once
```bash
pnpm run db_setup
```
Run migrations
```bash
pnpm run db:migrate
```
run dev environment
```bash
pnpm run dev
```

To run unit tests run
```bash
pnpm run test
```
To run unit e2e test run
```bash
pnpm run test:e2e
```