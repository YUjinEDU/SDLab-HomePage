#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
for i in $(seq 1 30); do
  if pg_isready -h db -U sdlab -d sdlab_homepage > /dev/null 2>&1; then
    echo "✅ Database is ready"
    break
  fi
  echo "⏳ Waiting... ($i/30)"
  sleep 1
done

echo "🔄 Initializing database schema..."
if [ -f "/app/init-db.ts" ]; then
  node --loader=tsx/cjs /app/init-db.ts 2>&1 || {
    echo "⚠️  Database initialization failed or already initialized"
  }
else
  echo "⚠️  init-db.ts not found"
fi

echo "✅ Ready! Starting Next.js server..."
exec node server.js
