# Docker 배포 가이드

## 구조

```
docker compose up --build
  ├── db   — PostgreSQL 16 (초기화: docker/init.sql 자동 실행)
  └── web  — Next.js 16 standalone (포트 8888)
```

DB 스키마는 **컨테이너 최초 시작 시 `init.sql` 이 자동으로 생성**합니다.  
별도 마이그레이션 커맨드 불필요.

---

## 빠른 시작 (NAS / 서버)

### 1. 환경 변수 파일 생성

```bash
cp .env.production.example .env
```

`.env` 열고 아래 값 수정:

| 변수 | 설명 |
|------|------|
| `POSTGRES_PASSWORD` | DB 비밀번호 (강력하게) |
| `DATABASE_URL` | POSTGRES_PASSWORD 와 일치해야 함 |
| `AUTH_SECRET` | `openssl rand -base64 32` 로 생성 |
| `AUTH_URL` | 외부 접근 URL (예: `https://sdlab.example.ac.kr`) |

> `POSTGRES_USER`, `POSTGRES_DB` 는 기본값(`sdlab`, `sdlab_homepage`) 그대로 써도 됩니다.

### 2. NAS 폴더 확인

`docker-compose.yml` 의 볼륨 마운트 경로가 실제 NAS 경로와 일치하는지 확인:

```yaml
volumes:
  - /volume1/SDLab/공용:/nas/공용:rw
  - /volume1/SDLab/개인:/nas/개인:rw
```

경로가 다르면 `docker-compose.yml` 의 호스트 경로(왼쪽)를 수정하세요.

### 3. 빌드 & 시작

```bash
docker compose up --build -d
```

처음 빌드는 10–15분 소요됩니다 (LibreOffice 설치 포함).

### 4. 상태 확인

```bash
docker compose ps          # 컨테이너 상태
docker compose logs web    # 앱 로그
docker compose logs db     # DB 로그
```

`web` 서비스가 `healthy` 상태가 되면 `http://<서버IP>:8888` 접속.

### 5. 초기 관리자 계정

| 항목 | 값 |
|------|-----|
| 이메일 | `admin@sdlab.org` |
| 비밀번호 | `Admin@1234` |

**최초 로그인 후 반드시 비밀번호 변경하세요.**  
비밀번호 변경: `/professor/settings` 또는 DB에서 직접 업데이트.

---

## 로컬 테스트 (NAS 없이)

NAS 마운트 없이 앱만 확인하려면:

```yaml
# docker-compose.yml 의 volumes 섹션을 임시로 로컬 경로로 교체
volumes:
  - ./test-nas/공용:/nas/공용:rw
  - ./test-nas/개인:/nas/개인:rw
```

```bash
mkdir -p test-nas/공용 test-nas/개인
docker compose up --build
```

---

## 업데이트 배포

```bash
git pull
docker compose up --build -d
```

DB 볼륨(`postgres_data`)은 유지되므로 데이터 손실 없음.

---

## 초기화 (데이터 전체 삭제)

```bash
docker compose down -v     # 볼륨까지 삭제
docker compose up --build -d
```

---

## 트러블슈팅

### 앱이 DB에 연결 못 할 때

```bash
docker compose ps                        # db 가 healthy 인지 확인
docker compose logs db                   # DB 오류 확인
docker compose restart web               # DB 준비 후 web 재시작
```

### 테이블이 없다는 오류

```bash
# postgres_data 볼륨이 있으면 init.sql 이 재실행되지 않음
docker compose down -v && docker compose up --build -d
```

또는 직접 실행:

```bash
docker compose exec db psql -U sdlab -d sdlab_homepage -f /docker-entrypoint-initdb.d/init.sql
```

### DB 직접 접속

```bash
docker compose exec db psql -U sdlab -d sdlab_homepage
```

```sql
\dt          -- 테이블 목록
SELECT * FROM users;
\q
```

### 포트 충돌

`docker-compose.yml` 에서 `"8888:3000"` 의 `8888` 을 사용 가능한 포트로 변경.
