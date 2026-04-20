-- ============================================================
-- SD Lab 초기 데이터 시드
-- init.sql 실행 후 자동으로 실행됩니다 (docker-entrypoint-initdb.d 알파벳 순서)
-- 수동 실행: docker compose exec db psql -U sdlab -d sdlab_homepage -f /docker-entrypoint-initdb.d/seed.sql
-- ============================================================

-- ─── 1. 연락처 정보 ────────────────────────────────────────
-- init.sql의 placeholder를 실제 데이터로 교체
DELETE FROM contact_info;
INSERT INTO contact_info (
  lab_name_ko, lab_name_en,
  professor_name, professor_title, professor_email, professor_phone, professor_office,
  lab_room, lab_phone,
  building, department, university, address, map_embed_url
) VALUES (
  '스마트데이터연구실', 'Smart Data Lab',
  '김영국', '교수', 'ykim@cnu.ac.kr', '042-821-5450', '516호',
  '532호', '042-821-7441',
  '공대 5호관', '공과대학 컴퓨터인공지능학부', '충남대학교',
  '대전광역시 유성구 대학로 99 충남대학교 공대 5호관', NULL
);

-- ─── 2. 연구 분야 ────────────────────────────────────────
INSERT INTO research_areas (slug, title, short_description, full_description, icon, keywords, applications, display_order) VALUES
  (
    'smart-computing', '실시간 스마트 컴퓨팅 응용',
    '실시간 스트림 데이터 처리 및 상황인지 기반의 지능형 서비스 연구',
    '실시간 스트림 데이터 처리, 추천시스템, 상황인지 컴퓨팅, IoT 기술을 활용하여 스마트팩토리, 스마트모빌리티, 스마트시티 등 다양한 분야에 적용 가능한 지능형 서비스를 연구합니다.',
    'cpu',
    ARRAY['추천시스템', '실시간 스트림 데이터 처리', '상황인지', 'IoT'],
    ARRAY['스마트팩토리', '스마트모빌리티', '스마트시티'],
    1
  ),
  (
    'bio-ai', '바이오AI융합 연구',
    '바이오 빅데이터와 AI 기술을 융합한 지능형 서비스 연구',
    '스마트팜, 바이오 빅데이터, 지능형 서비스 등의 키워드를 중심으로 바이오 분야와 AI 기술의 융합을 통해 신약개발, 스마트팜 등의 응용 분야에 기여하는 연구를 수행합니다.',
    'dna',
    ARRAY['스마트팜', '바이오 빅데이터', '지능형 서비스'],
    ARRAY['신약개발', '스마트팜'],
    2
  ),
  (
    'environmental-it', '환경IT융합 연구',
    'IoT 및 데이터 분석 기반의 환경 모니터링 및 관리 연구',
    '수질관리, 대기오염, 미세먼지 등 환경 문제 해결을 위해 IoT 센서 데이터 수집 및 분석 기술을 활용한 환경 모니터링 시스템을 연구합니다.',
    'leaf',
    ARRAY['수질관리', '대기오염', '미세먼지', 'IoT'],
    ARRAY['수질관리', '대기오염 모니터링'],
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  title            = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description  = EXCLUDED.full_description,
  keywords         = EXCLUDED.keywords,
  applications     = EXCLUDED.applications,
  display_order    = EXCLUDED.display_order;

-- ─── 3. 교수님 (경력 + 수상 통합) ────────────────────────
INSERT INTO members (
  slug, name_ko, name_en, "group", position, department,
  image, email, links, research_keywords, bio, education, career, display_order
) VALUES (
  'young-kuk-kim', '김영국', 'Young-Kuk Kim',
  'professor', '교수', '컴퓨터인공지능학부',
  NULL,
  'ykim@cnu.ac.kr',
  '{"scholar": "https://scholar.google.co.kr/citations?user=PLACEHOLDER", "homepage": "https://sdlab.cnu.ac.kr"}'::jsonb,
  ARRAY['추천시스템', '실시간 스트림 데이터 처리', '상황인지 컴퓨팅', 'IoT', '바이오 빅데이터'],
  '충남대학교 컴퓨터인공지능학부 교수로서 스마트데이터연구실을 이끌고 있습니다. 실시간 스마트 컴퓨팅, 바이오AI융합, 환경IT융합 분야의 연구를 수행하고 있습니다.',
  '[
    {"degree":"학사","institution":"서울대학교","field":"계산통계학과","year":"1988"},
    {"degree":"석사","institution":"서울대학교","field":"계산통계학과","year":"1990"},
    {"degree":"박사","institution":"University of Virginia","field":"Computer Science","year":"2000"}
  ]'::jsonb,
  '[
    {"period":"2002 - 현재",  "role":"교수",               "organization":"충남대학교 컴퓨터인공지능학부"},
    {"period":"2018 - 2024",  "role":"AI융합연구센터장",    "organization":"충남대학교"},
    {"period":"2015 - 2017",  "role":"컴퓨터공학과 학과장", "organization":"충남대학교"},
    {"period":"2000 - 2002",  "role":"선임연구원",          "organization":"한국전자통신연구원(ETRI)"},
    {"period":"1990 - 1995",  "role":"연구원",              "organization":"LG전자 중앙연구소"},
    {"period":"2012.12", "role":"중소기업청장상 수상",                              "organization":"중소기업청",                     "category":"award"},
    {"period":"2014.6",  "role":"한국정보과학회 공로상",                            "organization":"한국정보과학회",                  "category":"award"},
    {"period":"2014.12", "role":"대전광역시 제20회 경제과학대상 (산학협동부문)",    "organization":"대전광역시",                      "category":"award"},
    {"period":"2015.1",  "role":"충남대학교 총장 표창장",                           "organization":"충남대학교",                      "category":"award"},
    {"period":"2016.1",  "role":"BigComp2016 Best Presentation Award",              "organization":"BigComp 2016",                    "category":"award"},
    {"period":"2017.6",  "role":"한국정보과학회 데이터베이스 소사이어티 공로상",    "organization":"한국정보과학회",                  "category":"award"},
    {"period":"2019.5",  "role":"IEEE ITEC2019 Best Presentation Award",            "organization":"IEEE Transportation Electrification Conference", "category":"award"},
    {"period":"2023.4",  "role":"한국스마트미디어학회 종합학술대회 우수논문상",     "organization":"한국스마트미디어학회",            "category":"award"},
    {"period":"2024.2",  "role":"2023년도 CNU 우수연구자 선정",                     "organization":"충남대학교",                      "category":"award"},
    {"period":"2024.6",  "role":"KCC2024 우수논문상",                               "organization":"KCC 2024",                        "category":"award"},
    {"period":"2024.12", "role":"과기정통부 장관 표창 (제24-04044호)",              "organization":"과학기술정보통신부",              "category":"award"}
  ]'::jsonb,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  name_ko           = EXCLUDED.name_ko,
  name_en           = EXCLUDED.name_en,
  "group"           = EXCLUDED."group",
  position          = EXCLUDED.position,
  department        = EXCLUDED.department,
  email             = EXCLUDED.email,
  links             = EXCLUDED.links,
  research_keywords = EXCLUDED.research_keywords,
  bio               = EXCLUDED.bio,
  education         = EXCLUDED.education,
  career            = EXCLUDED.career,
  display_order     = EXCLUDED.display_order;

-- ─── 4. 학생 멤버 ────────────────────────────────────────
-- TODO: /professor/members 에서 실제 학생 정보를 추가하세요.
-- 아래는 예시입니다. 주석 해제 후 실제 정보로 교체하세요.
--
-- INSERT INTO members (slug, name_ko, name_en, "group", position, department, email, research_keywords, display_order)
-- VALUES
--   ('hong-gildong', '홍길동', 'Gildong Hong', 'phd', '박사과정', '컴퓨터인공지능학부', 'hong@cnu.ac.kr', ARRAY['추천시스템', '딥러닝'], 2),
--   ('kim-sample',   '김샘플', 'Sample Kim',   'ms',  '석사과정', '컴퓨터인공지능학부', NULL,            ARRAY['바이오 빅데이터'],     3)
-- ON CONFLICT (slug) DO NOTHING;
