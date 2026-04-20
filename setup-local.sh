#!/bin/bash
set -e

echo "🚀 SD Lab 로컬 테스트 설정 시작..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다"
    exit 1
fi

echo "✅ Docker 확인 완료"
echo ""

# Start containers
echo "📦 컨테이너 시작 중... (잠깐 기다려주세요)"
docker-compose down -v 2>/dev/null || true
docker-compose up -d

echo ""
echo "⏳ PostgreSQL이 준비될 때까지 기다리는 중..."
sleep 8

# Initialize database
echo ""
echo "🔄 데이터베이스 초기화 중..."
docker-compose exec -T web node --loader=tsx/cjs ./init-db.ts

echo ""
echo "✅ 완료!"
echo ""
echo "🌐 앱 접속: http://localhost:8888/ko"
echo "📧 관리자: admin@sdlab.org"
echo "🔑 암호: Admin@1234"
echo ""
echo "💡 도움말: docker-compose ps (상태 확인)"
echo "💡 도움말: docker-compose logs web (로그 보기)"
