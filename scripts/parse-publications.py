"""
연구실적-김영국.json → Supabase publications 테이블 INSERT SQL 생성기

섹션 경계:
  II  (국제학술지):   발행일 헤더, table id=6~16    → type='journal',    international=True
  III (국제학술회의): caption id=18, table id=19~42 → type='conference', international=True
  IV  (국내학술지):   heading id=44, table id=45~53 → type='journal',    international=False
  V   (국내학술회의): heading id=55, table id=56~86 → type='conference', international=False
  VI  (특허):         heading id=88, list elements  → type='patent'
"""

import json
import re
import sys
import uuid
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding="utf-8")

# ── HTML 테이블 파서 ────────────────────────────────────────────────────────

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self._row = []
        self._cell = ""
        self._in_cell = False
        self._in_tbody = False

    def handle_starttag(self, tag, attrs):
        if tag == "tbody":
            self._in_tbody = True
        if tag == "tr" and self._in_tbody:
            self._row = []
        if tag in ("td", "th"):
            self._in_cell = True
            self._cell = ""

    def handle_endtag(self, tag):
        if tag == "tbody":
            self._in_tbody = False
        if tag in ("td", "th"):
            self._in_cell = False
            self._row.append(self._cell.strip())
        if tag == "tr" and self._in_tbody:
            if any(c.strip() for c in self._row):
                self.rows.append(list(self._row))

    def handle_data(self, data):
        if self._in_cell:
            self._cell += data


def parse_table_html(html: str) -> list[list[str]]:
    p = TableParser()
    p.feed(html)
    return p.rows


# ── 유틸 함수 ──────────────────────────────────────────────────────────────

def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def parse_year_month(date_str: str) -> tuple[int | None, int | None]:
    s = re.sub(r"\s+", "", date_str)
    ym = re.search(r"((?:19|20)\d{2})(?:\.(\d{1,2}))?", s)
    if not ym:
        return None, None
    year = int(ym.group(1))
    month = int(ym.group(2)) if ym.group(2) else None
    return year, month


_slug_seen: dict[str, int] = {}

def generate_slug(title: str, year: int | None) -> str:
    # 영문 제목이면 단어 기반 slug
    english_part = re.sub(r"[^a-zA-Z0-9\s-]", "", title).strip()
    if len(english_part) >= 10:
        base = english_part.lower()
        base = re.sub(r"\s+", "-", base).strip("-")[:55]
    else:
        # 한글 제목: UUID 앞 8자 + 연도 사용
        base = str(uuid.uuid4())[:8]
    suffix = f"-{year}" if year else ""
    slug = f"{base}{suffix}"
    # 중복 방지
    n = _slug_seen.get(slug, 0)
    _slug_seen[slug] = n + 1
    return f"{slug}-{n}" if n else slug


def sql_str(v: str | None) -> str:
    if v is None:
        return "NULL"
    escaped = v.replace("'", "''")
    return f"'{escaped}'"


def sql_array(items: list[str]) -> str:
    if not items:
        return "ARRAY[]::text[]"
    parts = ", ".join(f"'{i.replace(chr(39), chr(39)+chr(39))}'" for i in items)
    return f"ARRAY[{parts}]"


# ── 저자 파싱 ──────────────────────────────────────────────────────────────

def parse_authors(raw: str) -> list[str]:
    """저자 문자열을 개별 이름 리스트로 분리

    처리 케이스:
      '김영국 외 3인'          → ['김영국', '외 3인']
      '박성준, 강상길, 김영국'  → ['박성준', '강상길', '김영국']
      '강상길 박원익 김 영국'   → ['강상길', '박원익', '김영국']
      'Dada Huang, Young-Kuk Kim, ...' → comma split
      'Heenam Lee Hyungse Kim ...'     → 영문 이름 분리 어려우면 그대로
      '외 8명'                 → ['외 8명']
    """
    raw = clean(raw)
    if not raw:
        return []

    # "외 N인/명" 패턴 추출
    etc_match = re.search(r"(외\s*\d+\s*[인명])", raw)
    etc_note = etc_match.group(1) if etc_match else None
    if etc_note:
        raw = raw[:etc_match.start()].strip()

    # 쉼표 구분 (영문 or 한글 혼합)
    if "," in raw:
        parts = [p.strip() for p in raw.split(",") if p.strip()]
    # 한글 이름만 있는 경우: 공백으로 분리 후 1자 조각은 다음과 합치기
    elif re.match(r"^[가-힣\s]+$", raw):
        tokens = raw.split()
        parts = []
        i = 0
        while i < len(tokens):
            token = tokens[i]
            # 1자 토큰은 다음 토큰과 합치기 (예: '김' + '영국' → '김영국')
            if len(token) == 1 and i + 1 < len(tokens):
                parts.append(token + tokens[i + 1])
                i += 2
            else:
                parts.append(token)
                i += 1
    # 영문 이름: 쉼표 없어도 시도 (공백으로 분리 후 2단어씩 묶기)
    elif re.match(r"^[A-Za-z\s\-\.]+$", raw):
        words = raw.split()
        # 2단어씩 묶기 (First Last 패턴)
        parts = []
        i = 0
        while i < len(words):
            if i + 1 < len(words) and words[i+1][0].isupper():
                parts.append(f"{words[i]} {words[i+1]}")
                i += 2
            else:
                parts.append(words[i])
                i += 1
    else:
        # 혼합 (한글+영문): 그냥 공백 split
        parts = [p for p in re.split(r"\s{2,}", raw) if p.strip()]
        if len(parts) == 1:
            parts = raw.split()

    result = [p.strip() for p in parts if p.strip()]
    if etc_note:
        result.append(etc_note)
    return result


# ── INSERT SQL 생성 ────────────────────────────────────────────────────────

def is_high_impact(venue: str, publisher: str) -> bool:
    """국제학술지 중 주요 저널 여부 판단"""
    text = (venue + " " + publisher).upper()
    keywords = ["IEEE", "ELSEVIER", "SPRINGER", "MDPI", "SCI", "SCIE", "NATURE", "ACM"]
    return any(k in text for k in keywords)


def make_insert(
    title: str,
    authors_raw: str,
    venue: str,
    publisher: str,
    date_str: str,
    volume_info: str,
    pub_type: str,
    doi: str | None = None,
    section: str = "",
    is_international: bool = True,
) -> str | None:
    title = clean(title)
    if not title or len(title) < 4:
        return None

    year, month = parse_year_month(date_str)
    if not year:
        year, month = parse_year_month(volume_info)
    if not year:
        return None

    # 연도 범위 검증 (파싱 오류 방지)
    if year < 1990 or year > 2026:
        return None

    authors = parse_authors(clean(authors_raw))
    slug = generate_slug(title, year)
    uid = str(uuid.uuid4())

    venue_full = clean(venue)
    if publisher and clean(publisher) not in venue_full:
        venue_full = f"{venue_full} ({clean(publisher)})" if venue_full else clean(publisher)

    # 최근(2020+) 국제학술지 중 주요 저널 → featured
    featured = (
        section == "intl_journal"
        and year >= 2020
        and is_high_impact(venue, publisher)
    )

    intl_val = "true" if is_international else "false"
    return (
        f"INSERT INTO publications "
        f"(id, slug, title, authors, type, is_international, venue, year, month, doi, "
        f"pdf_url, abstract, keywords, bibtex, is_featured) VALUES (\n"
        f"  '{uid}',\n"
        f"  {sql_str(slug)},\n"
        f"  {sql_str(title)},\n"
        f"  {sql_array(authors)},\n"
        f"  '{pub_type}',\n"
        f"  {intl_val},\n"
        f"  {sql_str(venue_full)},\n"
        f"  {year},\n"
        f"  {month if month else 'NULL'},\n"
        f"  {sql_str(doi)},\n"
        f"  NULL, NULL, ARRAY[]::text[], NULL, {'true' if featured else 'false'}\n"
        f");"
    )


# ── 섹션별 파싱 ────────────────────────────────────────────────────────────

def parse_publication_table(rows: list[list[str]], pub_type: str, section: str = "", is_international: bool = True) -> list[str]:
    """논문 테이블 행들을 INSERT SQL 목록으로 변환"""
    sqls = []
    for row in rows:
        if len(row) < 4:
            continue
        authors_raw = row[0] if len(row) > 0 else ""
        title      = row[1] if len(row) > 1 else ""
        venue      = row[2] if len(row) > 2 else ""
        publisher  = row[3] if len(row) > 3 else ""
        date_str   = row[4] if len(row) > 4 else ""
        volume_info = row[5] if len(row) > 5 else ""

        doi_match = re.search(r"10\.\d{4,}/\S+", volume_info)
        doi = doi_match.group(0).rstrip(".,)") if doi_match else None

        sql = make_insert(title, authors_raw, venue, publisher, date_str, volume_info, pub_type, doi, section=section, is_international=is_international)
        if sql:
            sqls.append(sql)
    return sqls


def parse_patent_lists(elements: list[dict]) -> list[str]:
    """VI. 특허 섹션의 list 요소들을 INSERT SQL로 변환"""
    sqls = []
    for e in elements:
        if e.get("category") != "list":
            continue
        text = e.get("content", {}).get("text", "")
        # 각 항목 분리 (- 로 시작하는 줄)
        items = re.split(r"\n-\s*", text)
        for item in items:
            item = clean(item.lstrip("- "))
            if not item:
                continue
            # 취소선(삭제된 항목) 포함 여부 확인 - HTML에서 <s> 태그 확인
            html = e.get("html", "")
            # 연도 추출 - 출원일자/등록일자 우선, 없으면 첫 번째 연도
            date_m = re.search(r"(?:출원일자|등록일자)[:\s]*((?:19|20)\d{2})", item)
            year_m = date_m or re.search(r"((?:19|20)\d{2})", item)
            if not year_m:
                continue
            year = int(year_m.group(1))
            if year < 1990 or year > 2026:
                continue
            # 등록번호 추출
            reg_match = re.search(r"등록번호[:\s]*(?:제\s*)?([\d\-]+)", item)
            reg_no = reg_match.group(1) if reg_match else None
            # 출원번호 추출
            app_match = re.search(r"출원번호[:\s]*(?:제?\s*)?([\d\-]+)", item)
            # 제목: 첫 번째 쉼표 이전 부분 (저자 이후)
            # 형식: "김영국, 저자2, ..., 제목, 출원기관..."
            # 사실 특허는 형식이 복잡하므로 간단하게 처리
            # "제목(Title in parentheses)" 형식이 있으면 추출
            title_en = re.search(r"\(([A-Z][^)]{10,})\)", item)
            if title_en:
                title = title_en.group(1)
            else:
                # 쉼표로 분리해서 두 번째 이후 요소에서 한글 제목 추출
                parts = item.split(",")
                # 저자 부분 건너뛰기 (한국어 이름들)
                title_candidates = [p.strip() for p in parts if len(p.strip()) > 10]
                if not title_candidates:
                    continue
                title = title_candidates[0]

            if len(title) < 5:
                continue

            # 등록된 것과 출원 중인 것 구분 (venue에 표시)
            if "국내특허등록" in item or "국내등록" in item:
                venue = f"특허등록 ({reg_no})" if reg_no else "특허등록"
            else:
                venue = "특허출원"

            slug = generate_slug(title[:50], year)
            uid = str(uuid.uuid4())
            sqls.append(
                f"INSERT INTO publications "
                f"(id, slug, title, authors, type, is_international, venue, year, month, doi, "
                f"pdf_url, abstract, keywords, bibtex, is_featured) VALUES (\n"
                f"  '{uid}',\n"
                f"  {sql_str(slug)},\n"
                f"  {sql_str(clean(title))},\n"
                f"  ARRAY['김영국'],\n"
                f"  'patent',\n"
                f"  false,\n"
                f"  {sql_str(venue)},\n"
                f"  {year},\n"
                f"  NULL,\n"
                f"  NULL, NULL, NULL, ARRAY[]::text[], NULL, false\n"
                f");"
            )
    return sqls


# ── 메인 ──────────────────────────────────────────────────────────────────

def main():
    input_file = "연구실적-김영국.json"
    output_file = "scripts/publications-insert.sql"

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    elements = data.get("elements", [])

    # 섹션 경계 (element id 기준)
    # II  국제학술지:   id=6~16  (발행일 컬럼)
    # III 국제학술회의: id=19~42 (caption id=18 이후)
    # IV  국내학술지:   id=45~53 (heading id=44 이후)
    # V   국내학술회의: id=56~86 (heading id=55 이후)
    # VI  특허:         id=88+   (heading id=88 이후)

    # (id_start, id_end, pub_type, is_international)
    SECTIONS = {
        "intl_journal":    (6,  17,  "journal",    True),
        "intl_conference": (19, 43,  "conference", True),
        "dom_journal":     (45, 55,  "journal",    False),
        "dom_conference":  (56, 88,  "conference", False),
    }

    all_sqls: list[str] = []
    counts: dict[str, int] = {}

    for section_name, (id_start, id_end, pub_type, is_intl) in SECTIONS.items():
        section_sqls = []
        for e in elements:
            if e.get("category") == "table" and id_start <= e["id"] < id_end:
                rows = parse_table_html(e.get("html", ""))
                sqls = parse_publication_table(rows, pub_type, section=section_name, is_international=is_intl)
                section_sqls.extend(sqls)
        all_sqls.append(f"\n-- ═══ {section_name.upper()} ({len(section_sqls)}건) ═══\n")
        all_sqls.extend(section_sqls)
        counts[section_name] = len(section_sqls)

    # 특허 파싱
    patent_elements = [e for e in elements if e.get("id", 0) >= 88]
    patent_sqls = parse_patent_lists(patent_elements)
    all_sqls.append(f"\n-- ═══ PATENTS ({len(patent_sqls)}건) ═══\n")
    all_sqls.extend(patent_sqls)
    counts["patents"] = len(patent_sqls)

    # SQL 파일 출력
    header = """\
-- ============================================================
-- 스마트데이터연구실 연구실적 Import
-- 생성: parse-publications.py
-- ============================================================
-- ⚠️  기존 데이터 전체 삭제 후 새로 INSERT
-- ============================================================

BEGIN;

-- 기존 데이터 삭제 (연결 테이블 먼저)
DELETE FROM publication_authors;
DELETE FROM publication_research_areas;
DELETE FROM publication_projects;
DELETE FROM publications;

"""
    footer = """
-- ============================================================
-- 저자 → 멤버 자동 연결 (members.name_ko ↔ publications.authors[])
-- ============================================================
-- 현재 DB에 등록된 멤버 이름과 논문 저자명이 일치하면 자동 링크
-- 일치 기준: members.name_ko가 authors 배열에 포함되어 있을 때

INSERT INTO publication_authors (publication_id, member_id, author_order)
SELECT DISTINCT
  p.id AS publication_id,
  m.id AS member_id,
  COALESCE(array_position(p.authors, m.name_ko), 99) AS author_order
FROM publications p
JOIN members m ON p.authors @> ARRAY[m.name_ko]
ON CONFLICT DO NOTHING;

-- 연결 결과 확인 (실행 후 체크용)
-- SELECT m.name_ko, COUNT(*) as linked_pubs
-- FROM publication_authors pa
-- JOIN members m ON pa.member_id = m.id
-- GROUP BY m.name_ko ORDER BY linked_pubs DESC;

COMMIT;
"""

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(all_sqls))
        f.write(footer)

    total = sum(counts.values())
    print("✅ 파싱 완료!")
    print(f"   국제 학술지:   {counts['intl_journal']}건")
    print(f"   국제 학술회의: {counts['intl_conference']}건")
    print(f"   국내 학술지:   {counts['dom_journal']}건")
    print(f"   국내 학술회의: {counts['dom_conference']}건")
    print(f"   특허:          {counts['patents']}건")
    print(f"   ─────────────────────")
    print(f"   합계:          {total}건")
    print(f"\n📄 출력 파일: {output_file}")


if __name__ == "__main__":
    main()
