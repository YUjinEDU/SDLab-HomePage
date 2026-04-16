# Synology NAS 배포 가이드 (DS918+)

SD Lab 홈페이지를 Synology NAS에 Docker로 배포하는 절차를 설명합니다.

---

## 1. 사전 요구사항

### 하드웨어
- Synology DS918+ (또는 동급 이상의 DSM 7.x 지원 모델)

### DSM 패키지 설치
- **Container Manager** (Docker) — DSM > 패키지 센터에서 설치
- **Git Server** 또는 SSH 접속 후 `git` 직접 사용

### SSH 활성화
1. DSM > 제어판 > 터미널 및 SNMP
2. "SSH 서비스 활성화" 체크
3. 포트: 22 (기본값 또는 변경 가능)

### 접속 확인
```bash
ssh admin@<NAS_IP>
```

---

## 2. 초기 배포

### 2-1. 저장소 클론
```bash
ssh admin@<NAS_IP>
mkdir -p /volume1/docker/sdlab-homepage
cd /volume1/docker/sdlab-homepage
git clone https://github.com/<your-org>/Homepage.git .
```

### 2-2. 환경 변수 파일 작성
```bash
cd /volume1/docker/sdlab-homepage
cp .env.production.example .env
vi .env
```

`.env` 파일을 다음과 같이 채웁니다:
```bash
DB_PASSWORD=강력한_비밀번호_여기에_입력
DATABASE_URL=postgresql://sdlab:강력한_비밀번호_여기에_입력@db:5432/sdlab_homepage
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=https://sdlab.example.ac.kr
```

> `AUTH_SECRET`은 반드시 `openssl rand -base64 32` 명령으로 생성한 값을 사용하세요.

### 2-3. Docker 컨테이너 빌드 및 실행
```bash
cd /volume1/docker/sdlab-homepage
docker compose up -d --build
```

빌드 완료 후 컨테이너 상태 확인:
```bash
docker compose ps
```

`sdlab_db`와 `sdlab_web` 모두 `running` 상태여야 합니다.

### 2-4. 데이터베이스 스키마 적용 (drizzle-kit push)
```bash
docker compose exec web sh -c "DATABASE_URL=$DATABASE_URL npx drizzle-kit push"
```

또는 로컬에서 NAS DB에 직접 접근하는 경우:
```bash
cd /volume1/docker/sdlab-homepage/frontend
DATABASE_URL=postgresql://sdlab:<DB_PASSWORD>@<NAS_IP>:5432/sdlab_homepage npx drizzle-kit push
```

### 2-5. 관리자 계정 생성
```bash
cd /volume1/docker/sdlab-homepage
DATABASE_URL=postgresql://sdlab:<DB_PASSWORD>@localhost:5432/sdlab_homepage \
  npx tsx scripts/create-admin.ts admin@sdlab.example.ac.kr 초기비밀번호
```

> 최초 로그인 후 즉시 비밀번호를 변경하세요.

---

## 3. 도메인 연결 (DSM 역방향 프록시)

학교 도메인(예: `sdlab.example.ac.kr`)을 NAS의 포트 3000으로 연결합니다.

### 3-1. DSM 역방향 프록시 설정
1. DSM > 제어판 > 로그인 포털 > 고급 > 역방향 프록시
2. **만들기** 클릭
3. 다음과 같이 설정:

| 항목 | 값 |
|------|-----|
| 역방향 프록시 이름 | sdlab-homepage |
| 프로토콜 (소스) | HTTPS |
| 호스트 이름 (소스) | sdlab.example.ac.kr |
| 포트 (소스) | 443 |
| 프로토콜 (대상) | HTTP |
| 호스트 이름 (대상) | localhost |
| 포트 (대상) | 3000 |

4. **사용자 지정 헤더** 탭에서 **만들기 > WebSocket** 추가 (Next.js HMR 등 지원)

### 3-2. Let's Encrypt SSL 인증서 (선택)
1. DSM > 제어판 > 보안 > 인증서
2. **추가 > 새 인증서 받기 > Let's Encrypt** 선택
3. 도메인명 입력 후 발급

### 3-3. 방화벽/포트포워딩
- 공유기 또는 학교 네트워크 장비에서 443 포트를 NAS IP로 포워딩
- DSM 방화벽에서 443 포트 허용 확인

---

## 4. 업데이트 배포

새 코드를 반영하려면 다음 절차를 따릅니다:

```bash
ssh admin@<NAS_IP>
cd /volume1/docker/sdlab-homepage

# 최신 코드 받기
git pull origin main

# 이미지 재빌드 및 재시작 (다운타임 최소화)
docker compose build --no-cache web
docker compose up -d web
```

빌드 로그 확인:
```bash
docker compose logs -f web
```

> `--no-cache` 옵션은 빌드 캐시를 무시하고 완전히 새로 빌드합니다.  
> 의존성 변경이 없다면 `--no-cache` 없이 실행해도 됩니다.

---

## 5. 데이터 백업

### 5-1. postgres_data 볼륨 백업
Docker 볼륨을 직접 덤프하는 방법:

```bash
# 백업 디렉토리 생성
mkdir -p /volume1/backup/sdlab-db

# pg_dump로 SQL 백업
docker compose exec db pg_dump -U sdlab sdlab_homepage \
  > /volume1/backup/sdlab-db/backup_$(date +%Y%m%d_%H%M%S).sql
```

### 5-2. 자동 백업 스크립트 (크론 등록)
```bash
# /volume1/docker/sdlab-homepage/scripts/backup-db.sh
#!/bin/bash
BACKUP_DIR=/volume1/backup/sdlab-db
mkdir -p "$BACKUP_DIR"
cd /volume1/docker/sdlab-homepage
docker compose exec -T db pg_dump -U sdlab sdlab_homepage \
  > "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# 30일 이상 된 백업 삭제
find "$BACKUP_DIR" -name "*.sql" -mtime +30 -delete
```

DSM > 제어판 > 작업 스케줄러에서 매일 새벽 3시에 실행하도록 등록합니다.

### 5-3. 백업 복원
```bash
cat /volume1/backup/sdlab-db/backup_20260101_030000.sql \
  | docker compose exec -T db psql -U sdlab sdlab_homepage
```

---

## 6. 기존 Supabase 데이터 마이그레이션

### 방법 A: pg_dump 사용 (권장)

Supabase 프로젝트에서 직접 덤프:

```bash
# Supabase 대시보드 > Settings > Database > Connection string 확인
SUPABASE_DB_URL=postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres

# 데이터만 덤프 (스키마 제외, 이미 drizzle-kit push로 생성됨)
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --no-owner \
  --no-acl \
  -t public.users \
  -t public.posts \
  -t public.members \
  > supabase_data_export.sql

# NAS DB에 임포트
cat supabase_data_export.sql \
  | docker compose exec -T db psql -U sdlab sdlab_homepage
```

### 방법 B: CSV Export/Import

테이블별로 CSV 파일로 내보낸 후 임포트합니다.

**Supabase에서 내보내기:**
1. Supabase 대시보드 > Table Editor > 테이블 선택
2. 우측 상단 메뉴 > Export as CSV

또는 SQL로 내보내기:
```sql
-- Supabase SQL Editor에서 실행
COPY public.members TO STDOUT WITH CSV HEADER;
```

**NAS DB에 임포트:**
```bash
# CSV 파일을 NAS로 복사
scp members.csv admin@<NAS_IP>:/volume1/docker/sdlab-homepage/

# Docker 컨테이너로 복사 후 임포트
docker cp /volume1/docker/sdlab-homepage/members.csv sdlab_db:/tmp/members.csv
docker compose exec db psql -U sdlab sdlab_homepage \
  -c "\COPY public.members FROM '/tmp/members.csv' WITH CSV HEADER"
```

### 주의사항
- Supabase Auth 사용자(`auth.users`)는 별도 처리 필요 — Auth.js 기반으로 전환 시 비밀번호 재설정 필요
- 마이그레이션 전 반드시 NAS DB에 스키마가 먼저 적용되어 있어야 합니다 (`drizzle-kit push` 완료)
- 스토리지(이미지 등)는 Supabase Storage에서 다운로드 후 NAS 볼륨 또는 별도 스토리지로 이전
