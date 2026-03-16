"""
parse-projects.py
- SW 소프트웨어 등록.md  → projects (category='SW 등록')
- 실적.md IX             → projects (category='산업체 연구과제')
- 실적.md X              → projects (category='기술이전')
- 실적.md XI             → projects (category='기술지도·자문')

또한 publications 테이블에서 type='software' 항목 삭제 (projects로 이동)
"""

import uuid, re, json
from pathlib import Path

ROOT = Path(__file__).parent.parent


def to_slug(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text.strip())
    return text[:80]


def q(s: str) -> str:
    return s.replace("'", "''")


def arr(lst):
    if not lst:
        return "ARRAY[]::text[]"
    return "ARRAY[" + ",".join(f"'{q(x)}'" for x in lst) + "]"


# ══════════════════════════════════════════════════════════
# 데이터 정의
# ══════════════════════════════════════════════════════════

# ── SW 프로그램 등록 ──────────────────────────────────────
SW_ENTRIES = [
    {"title": "로열티 시스템의 시스템 제공자", "reg_no": "2000-01-24-573", "year": 2000, "month": 2, "venue": "프로그램등록"},
    {"title": "모바일 환경에서의 멀티미디어 컨텐츠 자동관리 시스템", "reg_no": "2008-01-199-006430", "year": 2008, "month": 11, "venue": "프로그램등록"},
    {"title": "디스크 및 메모리기반 데이터베이스 동시성 제어 시뮬레이터", "reg_no": "2009-01-199-006836", "year": 2009, "month": 11, "venue": "프로그램등록"},
    {"title": "상황인지 기반 모바일 환경에서 슬라이딩 윈도우 모델을 적용한 개인화된 동적 인터페이스 제공 시스템", "reg_no": "C-2016-004564", "year": 2016, "month": 2, "venue": "저작권등록"},
    {"title": "상황인지 맞춤형 버스 정보 제공 앱", "reg_no": "C-2016-004565", "year": 2016, "month": 2, "venue": "저작권등록"},
    {"title": "원격으로 콘텐츠 제어가 가능한 디지털 액자 시스템", "reg_no": "C-2016-004566", "year": 2016, "month": 2, "venue": "저작권등록"},
    {"title": "스마트자판기 시뮬레이터와 이를 위한 어플리케이션", "reg_no": "C-2016-033359", "year": 2016, "month": 12, "venue": "저작권등록"},
    {"title": "융합형 센서기술을 적용한 난간추락 위험 감지 및 알림 프로그램", "reg_no": "C-2016-033468", "year": 2016, "month": 12, "venue": "저작권등록"},
    {"title": "융합형 센서 기술을 적용한 독거노인 모니터링 프로그램", "reg_no": "C-2016-033469", "year": 2016, "month": 12, "venue": "저작권등록"},
    {"title": "HLA/RTI을 이용한 분산 시뮬레이션 연동 환경을 위한 데이터 관리 도구", "reg_no": "C-2017-000435", "year": 2017, "month": 1, "venue": "저작권등록"},
    {"title": "확장 가능한 안드로이드 라이브러리(Expandable Library)", "reg_no": "C-2017-000715", "year": 2017, "month": 1, "venue": "저작권등록"},
    {"title": "일라이트 기능성 침대와 연동하는 IoT 기반의 헬스케어 시스템", "reg_no": "C-2017-028882", "year": 2017, "month": 11, "venue": "저작권등록"},
    {"title": "Drone Sim Fighter(드론 심 파이터)", "reg_no": "C-2017-033301", "year": 2017, "month": 12, "venue": "저작권등록"},
    {"title": "팩트 지식베이스에 기반한 가짜뉴스 판별 시스템", "reg_no": "C-2018-030548", "year": 2018, "month": 11, "venue": "저작권등록"},
    {"title": "자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 출력 도구", "reg_no": "C-2018-038087", "year": 2018, "month": 12, "venue": "저작권등록"},
    {"title": "자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 입력 도구", "reg_no": "C-2018-038013", "year": 2018, "month": 12, "venue": "저작권등록"},
    {"title": "이미지 인식기술을 이용한 혈액 주입시 발생하는 기포감지 프로그램", "reg_no": "C-2018-038553", "year": 2018, "month": 12, "venue": "저작권등록"},
    {"title": "딥러닝 기반 어린이 학습지 손글씨 답안 자동 채점 프로그램", "reg_no": "C-2023-041940", "year": 2023, "month": 9, "venue": "저작권등록"},
    {"title": "딥러닝 기반 식품 이미지 인식을 통한 당뇨병 환자 대상 식품 영양정보 제공 프로그램", "reg_no": "C-2023-045908", "year": 2023, "month": 10, "venue": "저작권등록"},
    {"title": "단백질-워헤드 3차 구조 기반 프로탁 링커 연결 부위 자동 탐색 알고리즘", "reg_no": "C-2024-053604", "year": 2024, "month": 12, "venue": "저작권등록"},
]

# ── IX. 산업체 연구과제 ───────────────────────────────────
INDUSTRY_PROJECTS = [
    {"title": "산학연 공동기술개발사업 (두레텍 2건, 모비다임, 엔에스티)", "org": "두레텍·모비다임·엔에스티", "start": "2013-01-01", "end": "2013-12-31", "desc": "2013년 산업체 연구과제 4건"},
    {"title": "산학연 공동기술개발사업 (이언텔, 엔에스티)", "org": "이언텔·엔에스티", "start": "2014-01-01", "end": "2014-12-31", "desc": "2014년 산업체 연구과제 2건"},
    {"title": "산학연 공동기술개발사업 (모비다임 3건, 네모블루)", "org": "모비다임·네모블루", "start": "2015-01-01", "end": "2015-12-31", "desc": "2015년 산업체 연구과제 4건"},
    {"title": "산학연 공동기술개발사업 (라이즈글로벌 2건)", "org": "라이즈글로벌", "start": "2016-01-01", "end": "2016-12-31", "desc": "2016년 산업체 연구과제 2건"},
    {"title": "산학연 공동기술개발사업 (모비다임)", "org": "모비다임", "start": "2017-01-01", "end": "2017-12-31", "desc": "2017년 산업체 연구과제 1건"},
    {"title": "산학연 공동기술개발사업 (모비다임, 무릉)", "org": "모비다임·무릉", "start": "2019-01-01", "end": "2019-12-31", "desc": "2019년 산업체 연구과제 2건"},
]

# ── X. 기술이전 ───────────────────────────────────────────
TECH_TRANSFERS = [
    {"title": "기술이전 — 모비다임", "org": "㈜모비다임", "date": "2014-02-01", "budget": "10,000,000원"},
    {"title": "기술이전 — 이언텔", "org": "㈜이언텔", "date": "2015-01-01", "budget": "5,000,000원"},
    {"title": "기술이전 — 모비다임", "org": "㈜모비다임", "date": "2016-01-01", "budget": "10,000,000원"},
    {"title": "기술이전 — 모비다임", "org": "㈜모비다임", "date": "2016-02-01", "budget": "2,000,000원"},
    {"title": "기술이전 — 이젠파워", "org": "㈜이젠파워", "date": "2016-02-01", "budget": "2,000,000원"},
    {"title": "기술이전 — 모비다임", "org": "㈜모비다임", "date": "2017-01-01", "budget": "2,000,000원"},
    {"title": "기술이전 — 무릉 (경상기술료)", "org": "㈜무릉", "date": "2018-03-28", "budget": "경상기술료"},
    {"title": "기술이전 — 인포카", "org": "㈜인포카", "date": "2020-01-30", "budget": "4,400,000원"},
    {"title": "기술이전 — 모비다임", "org": "㈜모비다임", "date": "2020-03-18", "budget": "2,200,000원"},
    {"title": "기술이전 — 위드피플", "org": "㈜위드피플", "date": "2020-04-02", "budget": "3,300,000원"},
    {"title": "기술이전 — 필리스", "org": "㈜필리스", "date": "2021-08-31", "budget": "11,000,000원"},
    {"title": "기술이전 — 하나에스엘", "org": "㈜하나에스엘", "date": "2021-12-17", "budget": "4,400,000원"},
    {"title": "기술이전 — 코고툴", "org": "㈜코고툴", "date": "2022-05-27", "budget": "3,300,000원"},
    {"title": "기술이전 — 인포카 (특허권 양도)", "org": "㈜인포카", "date": "2024-02-16", "budget": "5,000,000원"},
]

# ── XI. 기술지도 및 자문 ──────────────────────────────────
TECH_CONSULTING = [
    {"title": "군 워게임 훈련모델의 실시간 효율성 향상 방안", "org": "㈜두레텍", "start": "2013-11-01", "end": "2014-02-28", "program": "LINC"},
    {"title": "조립식 회전익비행체의 장치개발 및 자동통제 시스템 설계", "org": "㈜두레텍", "start": "2013-11-01", "end": "2013-12-31", "program": "LINC", "budget": "5,000,000원"},
    {"title": "스마트폰에서 모니터링이 가능한 현관 및 방문 부착형 침입 탐지 동글 개발", "org": "㈜모비다임", "start": "2013-11-01", "end": "2013-12-31", "program": "LINC", "budget": "5,000,000원"},
    {"title": "BLE4.0을 이용한 스마트폰 알리미 개발 및 상용화 기술", "org": "㈜네모블루", "start": "2014-10-01", "end": "2014-11-28", "program": "LINC"},
    {"title": "BLE4.0 기반 스마트폰 알리미 상용화를 위한 시제품 제작", "org": "㈜네모블루", "start": "2014-10-20", "end": "2014-12-20", "program": "LINC", "budget": "5,000,000원"},
    {"title": "안전한 수액·혈액 주입을 위한 IT·의료 융합 기포 감지 알람 시스템 개발", "org": "㈜모비다임", "start": "2015-07-20", "end": "2015-09-18", "program": "LINC", "budget": "5,000,000원"},
    {"title": "PCB Hot Press에 높이 조절이 가능한 스프링식 Guide block 설계", "org": "라이즈글로벌㈜", "start": "2015-12-21", "end": "2016-02-10", "program": "LINC", "budget": "5,000,000원"},
    {"title": "PCB Hot Press에 높이 조절이 가능한 슬라이딩식 Guide block 설계", "org": "라이즈글로벌㈜", "start": "2015-12-21", "end": "2016-02-10", "program": "LINC", "budget": "5,000,000원"},
    {"title": "골프스윙 연습장치 및 앱 개발", "org": "㈜모비다임", "start": "2016-10-10", "end": "2016-11-30", "program": "LINC", "budget": "5,000,000원"},
    {"title": "외적벡터를 적용한 3축 엑츄에이터 구동 방안", "org": "㈜두레텍", "start": "2016-10-01", "end": "2016-11-30", "program": "LINC"},
    {"title": "자동차용 능동소음제어 시스템을 위한 실시간 튜닝툴 개발", "org": "㈜에이알이", "start": "2018-01-04", "end": "2018-02-05", "program": "LINC+"},
    {"title": "딥러닝 기반 정답 예측 알고리즘 지도 및 챗봇 서비스 구성", "org": "㈜지의소프트", "start": "2018-12-17", "end": "2018-12-30", "program": "LINC+"},
    {"title": "운전데이터 활용 운전안내 서비스 및 상황인지 추천 기법", "org": "㈜무릉", "start": "2019-01-02", "end": "2019-01-18", "program": "LINC+"},
    {"title": "AIVORY 인공지능 추천서비스 신뢰도 향상 방안", "org": "㈜플랜아이", "start": "2020-06-23", "end": "2020-07-23", "program": "LINC+"},
    {"title": "시선 추적 기술 활용 앱 개발 및 성능평가 방안", "org": "㈜메이팜소프트", "start": "2021-10-05", "end": "2021-11-04", "program": "LINC+"},
]


# ══════════════════════════════════════════════════════════
# SQL 생성
# ══════════════════════════════════════════════════════════

def project_insert(title, category, status, org, short_desc, start_date,
                   end_date=None, budget=None, program_type=None, tags=None):
    uid = str(uuid.uuid4())
    slug = to_slug(title)
    ed = f"'{end_date}'" if end_date else "NULL"
    bud = f"'{q(budget)}'" if budget else "NULL"
    pt = f"'{q(program_type)}'" if program_type else "NULL"
    tg = arr(tags or [])
    return (
        f"INSERT INTO projects\n"
        f"  (id, slug, title, status, category, short_description,\n"
        f"   organization, program_type, budget, start_date, end_date,\n"
        f"   thumbnail, tags, is_featured)\n"
        f"VALUES (\n"
        f"  '{uid}', '{slug}', '{q(title)}', '{status}', '{q(category)}',\n"
        f"  '{q(short_desc)}',\n"
        f"  '{q(org)}', {pt}, {bud},\n"
        f"  '{start_date}', {ed},\n"
        f"  NULL, {tg}, false\n"
        f") ON CONFLICT (slug) DO NOTHING;"
    )


lines = [
    "-- ============================================================",
    "-- 프로젝트 (SW 등록 / 산업체 연구과제 / 기술이전 / 기술지도·자문)",
    "-- 생성: parse-projects.py",
    "-- ============================================================",
    "",
    "BEGIN;",
    "",
    "-- publications 테이블에서 SW 등록 항목 제거 (projects로 이동)",
    "DELETE FROM publications WHERE type = 'software';",
    "",
]

# ── SW 등록 ──
lines.append(f"-- ═══ SW 프로그램 등록 ({len(SW_ENTRIES)}건) ═══\n")
for e in SW_ENTRIES:
    start = f"{e['year']}-{e['month']:02d}-01"
    desc = f"SW 저작권등록 — 등록번호: {e['reg_no']}"
    lines.append(project_insert(
        title=e["title"],
        category="SW 등록",
        status="completed",
        org="한국저작권위원회",
        short_desc=desc,
        start_date=start,
        end_date=start,
        tags=["SW등록", "저작권"],
    ))
    lines.append("")

# ── 산업체 연구과제 ──
lines.append(f"\n-- ═══ 산업체 연구과제 ({len(INDUSTRY_PROJECTS)}건) ═══\n")
for e in INDUSTRY_PROJECTS:
    lines.append(project_insert(
        title=e["title"],
        category="산업체 연구과제",
        status="completed",
        org=e["org"],
        short_desc=e["desc"],
        start_date=e["start"],
        end_date=e["end"],
        tags=["산학협력", "산업체연구"],
    ))
    lines.append("")

# ── 기술이전 ──
lines.append(f"\n-- ═══ 기술이전 ({len(TECH_TRANSFERS)}건) ═══\n")

# 동일 slug 중복 방지용 카운터
slug_count: dict[str, int] = {}
for e in TECH_TRANSFERS:
    base_slug = to_slug(e["title"])
    slug_count[base_slug] = slug_count.get(base_slug, 0) + 1
    suffix = f"-{slug_count[base_slug]}" if slug_count[base_slug] > 1 else ""

    uid = str(uuid.uuid4())
    slug = base_slug + suffix
    date = e["date"]
    year = date[:4]
    budget = e.get("budget")
    bud_sql = f"'{q(budget)}'" if budget else "NULL"
    desc = f"기술이전 — {e['org']} ({year})"

    lines.append(
        f"INSERT INTO projects\n"
        f"  (id, slug, title, status, category, short_description,\n"
        f"   organization, program_type, budget, start_date, end_date,\n"
        f"   thumbnail, tags, is_featured)\n"
        f"VALUES (\n"
        f"  '{uid}', '{slug}', '{q(e['title'])}', 'completed', '기술이전',\n"
        f"  '{q(desc)}',\n"
        f"  '{q(e['org'])}', NULL, {bud_sql},\n"
        f"  '{date}', '{date}',\n"
        f"  NULL, ARRAY['기술이전','산학협력'], false\n"
        f") ON CONFLICT (slug) DO NOTHING;"
    )
    lines.append("")

# ── 기술지도·자문 ──
lines.append(f"\n-- ═══ 기술지도·자문 ({len(TECH_CONSULTING)}건) ═══\n")
for e in TECH_CONSULTING:
    budget = e.get("budget")
    program = e.get("program")
    lines.append(project_insert(
        title=e["title"],
        category="기술지도·자문",
        status="completed",
        org=e["org"],
        short_desc=f"{e['org']} 기술지도 및 자문",
        start_date=e["start"],
        end_date=e["end"],
        budget=budget,
        program_type=program,
        tags=["기술지도", "산학협력", program] if program else ["기술지도", "산학협력"],
    ))
    lines.append("")

lines += [
    "COMMIT;",
    "",
    "-- ============================================================",
    f"-- SW 등록 {len(SW_ENTRIES)}건 / 산업체 연구과제 {len(INDUSTRY_PROJECTS)}건",
    f"-- 기술이전 {len(TECH_TRANSFERS)}건 / 기술지도·자문 {len(TECH_CONSULTING)}건",
    "-- ============================================================",
]

out_path = ROOT / "scripts" / "projects-insert.sql"
out_path.write_text("\n".join(lines), encoding="utf-8")
total = len(SW_ENTRIES) + len(INDUSTRY_PROJECTS) + len(TECH_TRANSFERS) + len(TECH_CONSULTING)
print(f"OK: {out_path}  ({total} projects total)")
