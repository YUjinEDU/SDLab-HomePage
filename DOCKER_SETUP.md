# Docker Local Testing Setup

## Quick Start (Local Development on port 8888)

### 1. Create .env file

Copy `.env.production.example` to `.env` and fill in the values:

```bash
cp .env.production.example .env
```

Edit `.env` with:
```
DB_PASSWORD=your_strong_password_here
DATABASE_URL=postgresql://sdlab:your_strong_password_here@db:5432/sdlab_homepage
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=http://localhost:8888
ADMIN_EMAIL=admin@sdlab.org
ADMIN_PASSWORD=Admin@1234
```

### 2. Start Docker services

```bash
docker-compose up -d
```

This starts PostgreSQL and the Next.js app. PostgreSQL needs a moment to be healthy before the app connects.

### 3. Initialize the database

Wait 5-10 seconds for PostgreSQL to be ready, then initialize the database schema:

```bash
docker-compose exec web pnpm tsx ./init-db.ts
```

This will:
- Create all database tables
- Create the admin user (admin@sdlab.org / Admin@1234)
- Insert default contact info

### 4. Access the app

Open `http://localhost:8888/ko` in your browser.

## Troubleshooting

### App crashes with "Cannot connect to database"

```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View PostgreSQL logs
docker-compose logs db

# Check app logs
docker-compose logs web
```

### Tables don't exist

Run the initialization script again:

```bash
docker-compose exec web pnpm tsx ./init-db.ts
```

### Reset everything

```bash
# Stop and remove containers
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Manual Database Check

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U sdlab -d sdlab_homepage

# List tables
\\dt

# Check users table
SELECT * FROM users;

# Exit
\\q
```

## Production Deployment to NAS

For NAS deployment, use:

```bash
# Build the image
docker build -t sdlab-homepage:latest .

# On NAS, run with:
docker run -d \\
  --name sdlab-homepage \\
  -p 8888:3000 \\
  -e DATABASE_URL=\"postgresql://sdlab:password@nas-ip:5432/sdlab_homepage\" \\
  -e AUTH_SECRET=\"your_secret\" \\
  -e AUTH_URL=\"https://your-domain.ac.kr\" \\
  sdlab-homepage:latest
```
