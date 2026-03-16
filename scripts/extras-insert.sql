-- ============================================================
-- SW 프로그램 등록 + 수상 실적 Import
-- 생성: parse-extras.py
-- ============================================================

-- ① ENUM에 'software' 추가 (트랜잭션 밖에서 실행)
ALTER TYPE publication_type ADD VALUE IF NOT EXISTS 'software';

BEGIN;

-- ═══ SW 프로그램 등록 (20건) ═══

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '38b3054f-1615-43b4-bb80-53329ec0ba09',
  '로열티-시스템의-시스템-제공자',
  '로열티 시스템의 시스템 제공자',
  ARRAY['최훈','김영국'],
  'software', false,
  '프로그램등록 (등록번호: 2000-01-24-573)',
  2000, 2,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'b192e896-7dc6-40e7-9c2e-dbb5601de323',
  '모바일-환경에서의-멀티미디어-컨텐츠-자동관리-시스템',
  '모바일 환경에서의 멀티미디어 컨텐츠 자동관리 시스템',
  ARRAY['김영국','심우제'],
  'software', false,
  '프로그램등록 (등록번호: 2008-01-199-006430)',
  2008, 11,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'c13b3824-621c-41d7-9679-444ff4b0dd20',
  '디스크-및-메모리기반-데이터베이스-동시성-제어-시뮬레이터',
  '디스크 및 메모리기반 데이터베이스 동시성 제어 시뮬레이터',
  ARRAY['김영국','한상혁','윤명훈'],
  'software', false,
  '프로그램등록 (등록번호: 2009-01-199-006836)',
  2009, 11,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '47b61437-5fe4-4966-9e0d-dbbd5dc16b63',
  '상황인지-기반-모바일-환경에서-슬라이딩-윈도우-모델을-적용한-개인화된-동적-인터페이스-제공-시스템',
  '상황인지 기반 모바일 환경에서 슬라이딩 윈도우 모델을 적용한 개인화된 동적 인터페이스 제공 시스템',
  ARRAY['김영국','윤서현'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2016-004564)',
  2016, 2,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'facf65bb-924f-49fb-9688-c526536b7f75',
  '상황인지-맞춤형-버스-정보-제공-앱',
  '상황인지 맞춤형 버스 정보 제공 앱',
  ARRAY['김영국','강승완','박제우'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2016-004565)',
  2016, 2,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '802a9779-1486-41ad-9a51-bc675fa39bce',
  '원격으로-콘텐츠-제어가-가능한-디지털-액자-시스템',
  '원격으로 콘텐츠 제어가 가능한 디지털 액자 시스템',
  ARRAY['김영국','김태호'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2016-004566)',
  2016, 2,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'c1d6e413-5157-4080-a010-8ccf020f5b69',
  '스마트자판기-시뮬레이터와-이를-위한-어플리케이션',
  '스마트자판기 시뮬레이터와 이를 위한 어플리케이션',
  ARRAY['김영국','강승완','이예찬','이슬기','윤연주'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2016-033359)',
  2016, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '5e00fc2b-bfc0-4e0f-a510-fe066d97cbb6',
  '융합형-센서기술을-적용한-난간추락-위험-감지-및-알림-프로그램',
  '융합형 센서기술을 적용한 난간추락 위험 감지 및 알림 프로그램',
  ARRAY['김영국','김태호'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2016-033468)',
  2016, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '932f685b-157a-4d70-9266-2d51865719d9',
  '융합형-센서-기술을-적용한-독거노인-모니터링-프로그램',
  '융합형 센서 기술을 적용한 독거노인 모니터링 프로그램',
  ARRAY['김영국','김태호'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2016-033469)',
  2016, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '1793369d-4474-4922-b5d2-ca5f6ceb5c6a',
  'hlarti에이치엘에이알티아이을-이용한-분산-시뮬레이션-연동-환경을-위한-데이터-관리-도구',
  'HLA/RTI(에이치엘에이/알티아이)을 이용한 분산 시뮬레이션 연동 환경을 위한 데이터 관리 도구',
  ARRAY['최승환','최미선','김병수','황석규'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2017-000435)',
  2017, 1,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '6cfacd33-2e7f-438e-bf01-dd46f406c595',
  '확장-가능한-안드로이드-라이브러리expandable-library',
  '확장 가능한 안드로이드 라이브러리(Expandable Library)',
  ARRAY['김영국','정수연','장진규','김진학','박지혜'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2017-000715)',
  2017, 1,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'db5fa4e4-8e9c-48f3-a045-ecf47fb0b68f',
  '일라이트-기능성-침대와-연동하는-iot사물인터넷-기반의-헬스케어-시스템',
  '일라이트 기능성 침대와 연동하는 IoT(사물인터넷) 기반의 헬스케어 시스템',
  ARRAY['김영국','서정현','심예인','박성호'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2017-028882)',
  2017, 11,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '848f646d-0b05-408e-85a5-a9f91dfaeed5',
  'drone-sim-fighter드론-심-파이터',
  'Drone Sim Fighter(드론 심 파이터)',
  ARRAY['김영국','김진식','이지혜','황예은'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2017-033301)',
  2017, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'faad8e87-56ca-4674-a97e-b565fd16c8b7',
  '팩트-지식베이스에-기반한-가짜뉴스-판별-시스템',
  '팩트 지식베이스에 기반한 가짜뉴스 판별 시스템',
  ARRAY['김영국','김지현','윤성준','강은미'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2018-030548)',
  2018, 11,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '87796c08-e940-4f9f-a8b1-7f28749899ed',
  '자동차용-능동소음제어-시스템-튜닝을-위한-실시간-데이터-출력-도구',
  '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 출력 도구',
  ARRAY['김영국','심지수','안정은','김현석'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2018-038087)',
  2018, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '066bcd41-9fba-435f-9381-54e742e4d21f',
  '자동차용-능동소음제어-시스템-튜닝을-위한-실시간-데이터-입력-도구',
  '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 입력 도구',
  ARRAY['김영국','심지수','안정은','김현석'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2018-038013)',
  2018, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '0bb29113-7a49-4f6b-8ae7-fa535b4391dc',
  '이미지-인식기술을-이용한-혈액-주입시-발생하는-기포감지-프로그램',
  '이미지 인식기술을 이용한 혈액 주입시 발생하는 기포감지 프로그램',
  ARRAY['김영국','양희준','유민지','박정현'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2018-038553)',
  2018, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'cd222770-8cbb-4b41-ae17-b1b7ebd44d56',
  '딥러닝-기반-어린이-학습지-손글씨-답안-자동-채점-프로그램',
  '딥러닝 기반 어린이 학습지 손글씨 답안 자동 채점 프로그램',
  ARRAY['김영국','김영호','김문현'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2023-041940)',
  2023, 9,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  'e4bda85a-29ce-44e9-bd76-3a03a088b77f',
  '딥러닝-기반-식품-이미지-인식을-통한-당뇨병-환자-대상-식품-영양정보-제공-프로그램',
  '딥러닝 기반 식품 이미지 인식을 통한 당뇨병 환자 대상 식품 영양정보 제공 프로그램',
  ARRAY['김영국','정연주','문혜림','문다연'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2023-045908)',
  2023, 10,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO publications
  (id, slug, title, authors, type, is_international, venue, year, month,
   doi, pdf_url, abstract, keywords, bibtex, is_featured)
VALUES (
  '719a86a9-66a9-4906-9469-53f64feaba2f',
  '단백질-워헤드-3차-구조-기반-프로탁-링커-연결-부위-자동-탐색-알고리즘',
  '단백질-워헤드 3차 구조 기반 프로탁 링커 연결 부위 자동 탐색 알고리즘',
  ARRAY['김영국','최재문','정연주'],
  'software', false,
  '저작권등록(컴퓨터프로그램) (등록번호: C-2024-053604)',
  2024, 12,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
) ON CONFLICT (slug) DO NOTHING;


-- ═══ 교수님 수상 실적 (career에 추가) ═══
--  기존 career 배열에 award 항목들을 병합
UPDATE members
SET career = career || '[{"period": "2012.12", "role": "중소기업청장상 수상", "organization": "중소기업청", "category": "award"}, {"period": "2014.6", "role": "한국정보과학회 공로상", "organization": "한국정보과학회", "category": "award"}, {"period": "2014.12", "role": "대전광역시 제20회 경제과학대상 (산학협동부문)", "organization": "대전광역시", "category": "award"}, {"period": "2015.1", "role": "충남대학교 총장 표창장", "organization": "충남대학교", "category": "award"}, {"period": "2016.1", "role": "BigComp2016 Best Presentation Award", "organization": "BigComp 2016", "category": "award"}, {"period": "2017.6", "role": "한국정보과학회 데이터베이스 소사이어티 공로상", "organization": "한국정보과학회", "category": "award"}, {"period": "2019.5", "role": "IEEE ITEC2019 Best Presentation Award", "organization": "IEEE Transportation Electrification Conference", "category": "award"}, {"period": "2023.4", "role": "한국스마트미디어학회 종합학술대회 우수논문상", "organization": "한국스마트미디어학회", "category": "award"}, {"period": "2024.2", "role": "2023년도 CNU 우수연구자 선정", "organization": "충남대학교", "category": "award"}, {"period": "2024.6", "role": "KCC2024 우수논문상", "organization": "KCC 2024", "category": "award"}, {"period": "2024.12", "role": "과기정통부 장관 표창 (제24-04044호)", "organization": "과학기술정보통신부", "category": "award"}]'::jsonb
WHERE "group" = 'professor';

COMMIT;

-- ============================================================
-- 총 SW 등록 20건 INSERT  +  수상 11건 career 추가
-- ============================================================