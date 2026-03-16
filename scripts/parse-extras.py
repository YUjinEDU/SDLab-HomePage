"""
parse-extras.py
- SW 소프트웨어 등록.md  → publications INSERT (type='software')
- 실적.md (VIII 수상)    → members career UPDATE (category='award')
"""

import uuid, re, json
from pathlib import Path

ROOT = Path(__file__).parent.parent


# ── 슬러그 생성 ──────────────────────────────────────────
def to_slug(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text.strip())
    return text[:80]


# ══════════════════════════════════════════════════════════
# Part 1: SW 프로그램 등록
# ══════════════════════════════════════════════════════════

SW_ENTRIES = [
    {
        "authors": ["최훈", "김영국"],
        "title": "로열티 시스템의 시스템 제공자",
        "reg_no": "2000-01-24-573",
        "year": 2000, "month": 2,
        "venue_type": "프로그램등록",
    },
    {
        "authors": ["김영국", "심우제"],
        "title": "모바일 환경에서의 멀티미디어 컨텐츠 자동관리 시스템",
        "reg_no": "2008-01-199-006430",
        "year": 2008, "month": 11,
        "venue_type": "프로그램등록",
    },
    {
        "authors": ["김영국", "한상혁", "윤명훈"],
        "title": "디스크 및 메모리기반 데이터베이스 동시성 제어 시뮬레이터",
        "reg_no": "2009-01-199-006836",
        "year": 2009, "month": 11,
        "venue_type": "프로그램등록",
    },
    {
        "authors": ["김영국", "윤서현"],
        "title": "상황인지 기반 모바일 환경에서 슬라이딩 윈도우 모델을 적용한 개인화된 동적 인터페이스 제공 시스템",
        "reg_no": "C-2016-004564",
        "year": 2016, "month": 2,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "강승완", "박제우"],
        "title": "상황인지 맞춤형 버스 정보 제공 앱",
        "reg_no": "C-2016-004565",
        "year": 2016, "month": 2,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "김태호"],
        "title": "원격으로 콘텐츠 제어가 가능한 디지털 액자 시스템",
        "reg_no": "C-2016-004566",
        "year": 2016, "month": 2,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "강승완", "이예찬", "이슬기", "윤연주"],
        "title": "스마트자판기 시뮬레이터와 이를 위한 어플리케이션",
        "reg_no": "C-2016-033359",
        "year": 2016, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "김태호"],
        "title": "융합형 센서기술을 적용한 난간추락 위험 감지 및 알림 프로그램",
        "reg_no": "C-2016-033468",
        "year": 2016, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "김태호"],
        "title": "융합형 센서 기술을 적용한 독거노인 모니터링 프로그램",
        "reg_no": "C-2016-033469",
        "year": 2016, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["최승환", "최미선", "김병수", "황석규"],
        "title": "HLA/RTI(에이치엘에이/알티아이)을 이용한 분산 시뮬레이션 연동 환경을 위한 데이터 관리 도구",
        "reg_no": "C-2017-000435",
        "year": 2017, "month": 1,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "정수연", "장진규", "김진학", "박지혜"],
        "title": "확장 가능한 안드로이드 라이브러리(Expandable Library)",
        "reg_no": "C-2017-000715",
        "year": 2017, "month": 1,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "서정현", "심예인", "박성호"],
        "title": "일라이트 기능성 침대와 연동하는 IoT(사물인터넷) 기반의 헬스케어 시스템",
        "reg_no": "C-2017-028882",
        "year": 2017, "month": 11,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "김진식", "이지혜", "황예은"],
        "title": "Drone Sim Fighter(드론 심 파이터)",
        "reg_no": "C-2017-033301",
        "year": 2017, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "김지현", "윤성준", "강은미"],
        "title": "팩트 지식베이스에 기반한 가짜뉴스 판별 시스템",
        "reg_no": "C-2018-030548",
        "year": 2018, "month": 11,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "심지수", "안정은", "김현석"],
        "title": "자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 출력 도구",
        "reg_no": "C-2018-038087",
        "year": 2018, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "심지수", "안정은", "김현석"],
        "title": "자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 입력 도구",
        "reg_no": "C-2018-038013",
        "year": 2018, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "양희준", "유민지", "박정현"],
        "title": "이미지 인식기술을 이용한 혈액 주입시 발생하는 기포감지 프로그램",
        "reg_no": "C-2018-038553",
        "year": 2018, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "김영호", "김문현"],
        "title": "딥러닝 기반 어린이 학습지 손글씨 답안 자동 채점 프로그램",
        "reg_no": "C-2023-041940",
        "year": 2023, "month": 9,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "정연주", "문혜림", "문다연"],
        "title": "딥러닝 기반 식품 이미지 인식을 통한 당뇨병 환자 대상 식품 영양정보 제공 프로그램",
        "reg_no": "C-2023-045908",
        "year": 2023, "month": 10,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    {
        "authors": ["김영국", "최재문", "정연주"],
        "title": "단백질-워헤드 3차 구조 기반 프로탁 링커 연결 부위 자동 탐색 알고리즘",
        "reg_no": "C-2024-053604",
        "year": 2024, "month": 12,
        "venue_type": "저작권등록(컴퓨터프로그램)",
    },
    # C-2025 등록번호 미완성 항목은 제외
]


# ══════════════════════════════════════════════════════════
# Part 2: 수상 실적
# ══════════════════════════════════════════════════════════

AWARDS = [
    {"period": "2012.12", "role": "중소기업청장상 수상", "organization": "중소기업청"},
    {"period": "2014.6", "role": "한국정보과학회 공로상", "organization": "한국정보과학회"},
    {"period": "2014.12", "role": "대전광역시 제20회 경제과학대상 (산학협동부문)", "organization": "대전광역시"},
    {"period": "2015.1", "role": "충남대학교 총장 표창장", "organization": "충남대학교"},
    {"period": "2016.1", "role": "BigComp2016 Best Presentation Award", "organization": "BigComp 2016"},
    {"period": "2017.6", "role": "한국정보과학회 데이터베이스 소사이어티 공로상", "organization": "한국정보과학회"},
    {"period": "2019.5", "role": "IEEE ITEC2019 Best Presentation Award", "organization": "IEEE Transportation Electrification Conference"},
    {"period": "2023.4", "role": "한국스마트미디어학회 종합학술대회 우수논문상", "organization": "한국스마트미디어학회"},
    {"period": "2024.2", "role": "2023년도 CNU 우수연구자 선정", "organization": "충남대학교"},
    {"period": "2024.6", "role": "KCC2024 우수논문상", "organization": "KCC 2024"},
    {"period": "2024.12", "role": "과기정통부 장관 표창 (제24-04044호)", "organization": "과학기술정보통신부"},
]


# ══════════════════════════════════════════════════════════
# SQL 생성
# ══════════════════════════════════════════════════════════

def q(s):
    """SQL 문자열 이스케이프"""
    return s.replace("'", "''")

def arr(lst):
    return "ARRAY[" + ",".join(f"'{q(x)}'" for x in lst) + "]"


lines = [
    "-- ============================================================",
    "-- SW 프로그램 등록 + 수상 실적 Import",
    "-- 생성: parse-extras.py",
    "-- ============================================================",
    "",
    "-- ① ENUM에 'software' 추가 (트랜잭션 밖에서 실행)",
    "ALTER TYPE publication_type ADD VALUE IF NOT EXISTS 'software';",
    "",
    "BEGIN;",
    "",
    f"-- ═══ SW 프로그램 등록 ({len(SW_ENTRIES)}건) ═══",
    "",
]

for e in SW_ENTRIES:
    uid = str(uuid.uuid4())
    slug = to_slug(e["title"])
    authors_arr = arr(e["authors"])
    venue = f"{e['venue_type']} (등록번호: {e['reg_no']})"

    lines.append("INSERT INTO publications")
    lines.append("  (id, slug, title, authors, type, is_international, venue, year, month,")
    lines.append("   doi, pdf_url, abstract, keywords, bibtex, is_featured)")
    lines.append("VALUES (")
    lines.append(f"  '{uid}',")
    lines.append(f"  '{slug}',")
    lines.append(f"  '{q(e['title'])}',")
    lines.append(f"  {authors_arr},")
    lines.append(f"  'software', false,")
    lines.append(f"  '{q(venue)}',")
    lines.append(f"  {e['year']}, {e['month']},")
    lines.append(f"  NULL, NULL, NULL, ARRAY[]::text[], NULL, false")
    lines.append(") ON CONFLICT (slug) DO NOTHING;")
    lines.append("")

# ── 수상 실적 UPDATE ──────────────────────────────────────
awards_json = json.dumps(
    [{"period": a["period"], "role": a["role"], "organization": a["organization"], "category": "award"}
     for a in AWARDS],
    ensure_ascii=False
)

lines += [
    "",
    "-- ═══ 교수님 수상 실적 (career에 추가) ═══",
    "--  기존 career 배열에 award 항목들을 병합",
    "UPDATE members",
    f"SET career = career || '{q(awards_json)}'::jsonb",
    "WHERE \"group\" = 'professor';",
    "",
    "COMMIT;",
    "",
    "-- ============================================================",
    f"-- 총 SW 등록 {len(SW_ENTRIES)}건 INSERT  +  수상 {len(AWARDS)}건 career 추가",
    "-- ============================================================",
]

out_path = ROOT / "scripts" / "extras-insert.sql"
out_path.write_text("\n".join(lines), encoding="utf-8")
print(f"OK: {out_path}  ({len(SW_ENTRIES)} SW entries, {len(AWARDS)} awards)")
