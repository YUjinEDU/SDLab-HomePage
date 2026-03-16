-- ============================================================
-- 프로젝트 (SW 등록 / 산업체 연구과제 / 기술이전 / 기술지도·자문)
-- 생성: parse-projects.py
-- ============================================================

BEGIN;

-- publications 테이블에서 SW 등록 항목 제거 (projects로 이동)
DELETE FROM publications WHERE type = 'software';

-- ═══ SW 프로그램 등록 (20건) ═══

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '5849d343-68da-49c4-9584-bd8a94636091', '로열티-시스템의-시스템-제공자', '로열티 시스템의 시스템 제공자', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: 2000-01-24-573',
  '한국저작권위원회', NULL, NULL,
  '2000-02-01', '2000-02-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '1c5b9d2a-143d-4154-9930-8265fd7fbac9', '모바일-환경에서의-멀티미디어-컨텐츠-자동관리-시스템', '모바일 환경에서의 멀티미디어 컨텐츠 자동관리 시스템', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: 2008-01-199-006430',
  '한국저작권위원회', NULL, NULL,
  '2008-11-01', '2008-11-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '15cb9e43-852a-4189-aea5-c2269e8a638c', '디스크-및-메모리기반-데이터베이스-동시성-제어-시뮬레이터', '디스크 및 메모리기반 데이터베이스 동시성 제어 시뮬레이터', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: 2009-01-199-006836',
  '한국저작권위원회', NULL, NULL,
  '2009-11-01', '2009-11-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'a4fb05bf-7824-4127-8e21-635443c697fc', '상황인지-기반-모바일-환경에서-슬라이딩-윈도우-모델을-적용한-개인화된-동적-인터페이스-제공-시스템', '상황인지 기반 모바일 환경에서 슬라이딩 윈도우 모델을 적용한 개인화된 동적 인터페이스 제공 시스템', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2016-004564',
  '한국저작권위원회', NULL, NULL,
  '2016-02-01', '2016-02-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '0fa355e6-c524-4490-812e-8ad0bacf53d7', '상황인지-맞춤형-버스-정보-제공-앱', '상황인지 맞춤형 버스 정보 제공 앱', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2016-004565',
  '한국저작권위원회', NULL, NULL,
  '2016-02-01', '2016-02-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '69ad468c-9bf0-4486-ab0f-e8ececc776ef', '원격으로-콘텐츠-제어가-가능한-디지털-액자-시스템', '원격으로 콘텐츠 제어가 가능한 디지털 액자 시스템', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2016-004566',
  '한국저작권위원회', NULL, NULL,
  '2016-02-01', '2016-02-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'd5dfa067-ef61-41bf-a562-208f71a76639', '스마트자판기-시뮬레이터와-이를-위한-어플리케이션', '스마트자판기 시뮬레이터와 이를 위한 어플리케이션', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2016-033359',
  '한국저작권위원회', NULL, NULL,
  '2016-12-01', '2016-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '47f5d56c-96d8-4ff1-91a7-062d49c1e2a3', '융합형-센서기술을-적용한-난간추락-위험-감지-및-알림-프로그램', '융합형 센서기술을 적용한 난간추락 위험 감지 및 알림 프로그램', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2016-033468',
  '한국저작권위원회', NULL, NULL,
  '2016-12-01', '2016-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '3db083cd-b602-422f-a2b1-06f519fef3b5', '융합형-센서-기술을-적용한-독거노인-모니터링-프로그램', '융합형 센서 기술을 적용한 독거노인 모니터링 프로그램', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2016-033469',
  '한국저작권위원회', NULL, NULL,
  '2016-12-01', '2016-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'd9ab61d4-5e3d-4526-a39f-6bb43c7d74fb', 'hlarti을-이용한-분산-시뮬레이션-연동-환경을-위한-데이터-관리-도구', 'HLA/RTI을 이용한 분산 시뮬레이션 연동 환경을 위한 데이터 관리 도구', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2017-000435',
  '한국저작권위원회', NULL, NULL,
  '2017-01-01', '2017-01-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'cf567fd3-23ad-4b61-aa58-8e79079f7cd4', '확장-가능한-안드로이드-라이브러리expandable-library', '확장 가능한 안드로이드 라이브러리(Expandable Library)', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2017-000715',
  '한국저작권위원회', NULL, NULL,
  '2017-01-01', '2017-01-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '38c86674-0cb7-4ad1-b9e3-ddaf5f7ef381', '일라이트-기능성-침대와-연동하는-iot-기반의-헬스케어-시스템', '일라이트 기능성 침대와 연동하는 IoT 기반의 헬스케어 시스템', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2017-028882',
  '한국저작권위원회', NULL, NULL,
  '2017-11-01', '2017-11-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '39a08edf-e67c-46fb-9735-783c6e0d61bf', 'drone-sim-fighter드론-심-파이터', 'Drone Sim Fighter(드론 심 파이터)', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2017-033301',
  '한국저작권위원회', NULL, NULL,
  '2017-12-01', '2017-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '359e0901-d193-47d8-81d9-de53ccb9a72e', '팩트-지식베이스에-기반한-가짜뉴스-판별-시스템', '팩트 지식베이스에 기반한 가짜뉴스 판별 시스템', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2018-030548',
  '한국저작권위원회', NULL, NULL,
  '2018-11-01', '2018-11-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '26a33e78-862c-424d-99af-6abc100a908e', '자동차용-능동소음제어-시스템-튜닝을-위한-실시간-데이터-출력-도구', '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 출력 도구', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2018-038087',
  '한국저작권위원회', NULL, NULL,
  '2018-12-01', '2018-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '3245478a-ee53-4e3b-b415-b92a252e1036', '자동차용-능동소음제어-시스템-튜닝을-위한-실시간-데이터-입력-도구', '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 입력 도구', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2018-038013',
  '한국저작권위원회', NULL, NULL,
  '2018-12-01', '2018-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '147d76b9-22fd-4e25-b6dd-e9795a78b873', '이미지-인식기술을-이용한-혈액-주입시-발생하는-기포감지-프로그램', '이미지 인식기술을 이용한 혈액 주입시 발생하는 기포감지 프로그램', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2018-038553',
  '한국저작권위원회', NULL, NULL,
  '2018-12-01', '2018-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'ade6711f-8205-44f3-9dd9-6effb2ab05af', '딥러닝-기반-어린이-학습지-손글씨-답안-자동-채점-프로그램', '딥러닝 기반 어린이 학습지 손글씨 답안 자동 채점 프로그램', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2023-041940',
  '한국저작권위원회', NULL, NULL,
  '2023-09-01', '2023-09-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'f79f9303-4627-46a0-968d-c8a89eb96616', '딥러닝-기반-식품-이미지-인식을-통한-당뇨병-환자-대상-식품-영양정보-제공-프로그램', '딥러닝 기반 식품 이미지 인식을 통한 당뇨병 환자 대상 식품 영양정보 제공 프로그램', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2023-045908',
  '한국저작권위원회', NULL, NULL,
  '2023-10-01', '2023-10-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '0d7dafec-0013-49bc-9a1f-4c6faccda70f', '단백질-워헤드-3차-구조-기반-프로탁-링커-연결-부위-자동-탐색-알고리즘', '단백질-워헤드 3차 구조 기반 프로탁 링커 연결 부위 자동 탐색 알고리즘', 'completed', 'SW 등록',
  'SW 저작권등록 — 등록번호: C-2024-053604',
  '한국저작권위원회', NULL, NULL,
  '2024-12-01', '2024-12-01',
  NULL, ARRAY['SW등록','저작권'], false
) ON CONFLICT (slug) DO NOTHING;


-- ═══ 산업체 연구과제 (6건) ═══

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '16e0dc85-e116-4720-9d57-34c18d711650', '산학연-공동기술개발사업-두레텍-2건-모비다임-엔에스티', '산학연 공동기술개발사업 (두레텍 2건, 모비다임, 엔에스티)', 'completed', '산업체 연구과제',
  '2013년 산업체 연구과제 4건',
  '두레텍·모비다임·엔에스티', NULL, NULL,
  '2013-01-01', '2013-12-31',
  NULL, ARRAY['산학협력','산업체연구'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '6358e2e9-d334-4846-8a5c-fd120cc6da09', '산학연-공동기술개발사업-이언텔-엔에스티', '산학연 공동기술개발사업 (이언텔, 엔에스티)', 'completed', '산업체 연구과제',
  '2014년 산업체 연구과제 2건',
  '이언텔·엔에스티', NULL, NULL,
  '2014-01-01', '2014-12-31',
  NULL, ARRAY['산학협력','산업체연구'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'ed24767a-169b-4d82-8261-8276ef446708', '산학연-공동기술개발사업-모비다임-3건-네모블루', '산학연 공동기술개발사업 (모비다임 3건, 네모블루)', 'completed', '산업체 연구과제',
  '2015년 산업체 연구과제 4건',
  '모비다임·네모블루', NULL, NULL,
  '2015-01-01', '2015-12-31',
  NULL, ARRAY['산학협력','산업체연구'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '847861c1-6215-4ce9-98d6-a94e9517299e', '산학연-공동기술개발사업-라이즈글로벌-2건', '산학연 공동기술개발사업 (라이즈글로벌 2건)', 'completed', '산업체 연구과제',
  '2016년 산업체 연구과제 2건',
  '라이즈글로벌', NULL, NULL,
  '2016-01-01', '2016-12-31',
  NULL, ARRAY['산학협력','산업체연구'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '726e745f-fa49-4173-84ae-8c6b3ca29096', '산학연-공동기술개발사업-모비다임', '산학연 공동기술개발사업 (모비다임)', 'completed', '산업체 연구과제',
  '2017년 산업체 연구과제 1건',
  '모비다임', NULL, NULL,
  '2017-01-01', '2017-12-31',
  NULL, ARRAY['산학협력','산업체연구'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '620f7576-077b-4b9b-8f10-b19c2d888a98', '산학연-공동기술개발사업-모비다임-무릉', '산학연 공동기술개발사업 (모비다임, 무릉)', 'completed', '산업체 연구과제',
  '2019년 산업체 연구과제 2건',
  '모비다임·무릉', NULL, NULL,
  '2019-01-01', '2019-12-31',
  NULL, ARRAY['산학협력','산업체연구'], false
) ON CONFLICT (slug) DO NOTHING;


-- ═══ 기술이전 (14건) ═══

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'c6d1e870-588d-42ff-a9ef-8ccd22fd280e', '기술이전-모비다임', '기술이전 — 모비다임', 'completed', '기술이전',
  '기술이전 — ㈜모비다임 (2014)',
  '㈜모비다임', NULL, '10,000,000원',
  '2014-02-01', '2014-02-01',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '608c0749-ee6c-454a-9392-a2cb55a8f3ba', '기술이전-이언텔', '기술이전 — 이언텔', 'completed', '기술이전',
  '기술이전 — ㈜이언텔 (2015)',
  '㈜이언텔', NULL, '5,000,000원',
  '2015-01-01', '2015-01-01',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '24e0b290-2b3a-41e1-bb7f-3a27902aa66d', '기술이전-모비다임-2', '기술이전 — 모비다임', 'completed', '기술이전',
  '기술이전 — ㈜모비다임 (2016)',
  '㈜모비다임', NULL, '10,000,000원',
  '2016-01-01', '2016-01-01',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'b35c075f-8aba-4ad9-92ee-8d7801a02c77', '기술이전-모비다임-3', '기술이전 — 모비다임', 'completed', '기술이전',
  '기술이전 — ㈜모비다임 (2016)',
  '㈜모비다임', NULL, '2,000,000원',
  '2016-02-01', '2016-02-01',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '9d682555-30f2-452a-8445-2d48d39c98c0', '기술이전-이젠파워', '기술이전 — 이젠파워', 'completed', '기술이전',
  '기술이전 — ㈜이젠파워 (2016)',
  '㈜이젠파워', NULL, '2,000,000원',
  '2016-02-01', '2016-02-01',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'c8d7f8d0-1081-453b-81a8-f81730060c78', '기술이전-모비다임-4', '기술이전 — 모비다임', 'completed', '기술이전',
  '기술이전 — ㈜모비다임 (2017)',
  '㈜모비다임', NULL, '2,000,000원',
  '2017-01-01', '2017-01-01',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '40503110-659e-460f-84d8-d1819995ff9a', '기술이전-무릉-경상기술료', '기술이전 — 무릉 (경상기술료)', 'completed', '기술이전',
  '기술이전 — ㈜무릉 (2018)',
  '㈜무릉', NULL, '경상기술료',
  '2018-03-28', '2018-03-28',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'aa9288a5-7e2c-4562-b6b8-db586ad8cee3', '기술이전-인포카', '기술이전 — 인포카', 'completed', '기술이전',
  '기술이전 — ㈜인포카 (2020)',
  '㈜인포카', NULL, '4,400,000원',
  '2020-01-30', '2020-01-30',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'bd925951-fffd-4d33-b2fd-3c7327d91c56', '기술이전-모비다임-5', '기술이전 — 모비다임', 'completed', '기술이전',
  '기술이전 — ㈜모비다임 (2020)',
  '㈜모비다임', NULL, '2,200,000원',
  '2020-03-18', '2020-03-18',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'ade50aad-e0ad-403b-9f6d-751f4c76adf9', '기술이전-위드피플', '기술이전 — 위드피플', 'completed', '기술이전',
  '기술이전 — ㈜위드피플 (2020)',
  '㈜위드피플', NULL, '3,300,000원',
  '2020-04-02', '2020-04-02',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '48ffad0c-cab1-4f0d-8dd0-11bb35a7b7bf', '기술이전-필리스', '기술이전 — 필리스', 'completed', '기술이전',
  '기술이전 — ㈜필리스 (2021)',
  '㈜필리스', NULL, '11,000,000원',
  '2021-08-31', '2021-08-31',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '11ba7d7a-c86b-401d-bcfc-fbc0b82fdacf', '기술이전-하나에스엘', '기술이전 — 하나에스엘', 'completed', '기술이전',
  '기술이전 — ㈜하나에스엘 (2021)',
  '㈜하나에스엘', NULL, '4,400,000원',
  '2021-12-17', '2021-12-17',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'e253b4c5-301d-462b-8602-62381eb9f11a', '기술이전-코고툴', '기술이전 — 코고툴', 'completed', '기술이전',
  '기술이전 — ㈜코고툴 (2022)',
  '㈜코고툴', NULL, '3,300,000원',
  '2022-05-27', '2022-05-27',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '27ba735d-0f60-46c5-a439-30156ad3e07f', '기술이전-인포카-특허권-양도', '기술이전 — 인포카 (특허권 양도)', 'completed', '기술이전',
  '기술이전 — ㈜인포카 (2024)',
  '㈜인포카', NULL, '5,000,000원',
  '2024-02-16', '2024-02-16',
  NULL, ARRAY['기술이전','산학협력'], false
) ON CONFLICT (slug) DO NOTHING;


-- ═══ 기술지도·자문 (15건) ═══

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '626b1474-f084-4cb4-ab60-22b71498797e', '군-워게임-훈련모델의-실시간-효율성-향상-방안', '군 워게임 훈련모델의 실시간 효율성 향상 방안', 'completed', '기술지도·자문',
  '㈜두레텍 기술지도 및 자문',
  '㈜두레텍', 'LINC', NULL,
  '2013-11-01', '2014-02-28',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '3410159b-7a3f-4a17-ae02-a0b7b4b2469e', '조립식-회전익비행체의-장치개발-및-자동통제-시스템-설계', '조립식 회전익비행체의 장치개발 및 자동통제 시스템 설계', 'completed', '기술지도·자문',
  '㈜두레텍 기술지도 및 자문',
  '㈜두레텍', 'LINC', '5,000,000원',
  '2013-11-01', '2013-12-31',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'c4e4f2e3-39bb-4faa-826a-151f0d28ace5', '스마트폰에서-모니터링이-가능한-현관-및-방문-부착형-침입-탐지-동글-개발', '스마트폰에서 모니터링이 가능한 현관 및 방문 부착형 침입 탐지 동글 개발', 'completed', '기술지도·자문',
  '㈜모비다임 기술지도 및 자문',
  '㈜모비다임', 'LINC', '5,000,000원',
  '2013-11-01', '2013-12-31',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '601ceffe-f671-44f7-b5a0-78edcc17e177', 'ble40을-이용한-스마트폰-알리미-개발-및-상용화-기술', 'BLE4.0을 이용한 스마트폰 알리미 개발 및 상용화 기술', 'completed', '기술지도·자문',
  '㈜네모블루 기술지도 및 자문',
  '㈜네모블루', 'LINC', NULL,
  '2014-10-01', '2014-11-28',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '486a24b3-5e18-4b75-a26d-47349d6814f1', 'ble40-기반-스마트폰-알리미-상용화를-위한-시제품-제작', 'BLE4.0 기반 스마트폰 알리미 상용화를 위한 시제품 제작', 'completed', '기술지도·자문',
  '㈜네모블루 기술지도 및 자문',
  '㈜네모블루', 'LINC', '5,000,000원',
  '2014-10-20', '2014-12-20',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '82f8eeab-d0ef-4eba-bd7c-1e15eab2a04b', '안전한-수액혈액-주입을-위한-it의료-융합-기포-감지-알람-시스템-개발', '안전한 수액·혈액 주입을 위한 IT·의료 융합 기포 감지 알람 시스템 개발', 'completed', '기술지도·자문',
  '㈜모비다임 기술지도 및 자문',
  '㈜모비다임', 'LINC', '5,000,000원',
  '2015-07-20', '2015-09-18',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  'd2ab2e4d-21f8-47cb-9202-075ce240d840', 'pcb-hot-press에-높이-조절이-가능한-스프링식-guide-block-설계', 'PCB Hot Press에 높이 조절이 가능한 스프링식 Guide block 설계', 'completed', '기술지도·자문',
  '라이즈글로벌㈜ 기술지도 및 자문',
  '라이즈글로벌㈜', 'LINC', '5,000,000원',
  '2015-12-21', '2016-02-10',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '9b754e2f-7a89-4754-9d4b-fcc5a11b8088', 'pcb-hot-press에-높이-조절이-가능한-슬라이딩식-guide-block-설계', 'PCB Hot Press에 높이 조절이 가능한 슬라이딩식 Guide block 설계', 'completed', '기술지도·자문',
  '라이즈글로벌㈜ 기술지도 및 자문',
  '라이즈글로벌㈜', 'LINC', '5,000,000원',
  '2015-12-21', '2016-02-10',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '577945ae-7f25-47fd-a7ae-7ee3b1ee7f22', '골프스윙-연습장치-및-앱-개발', '골프스윙 연습장치 및 앱 개발', 'completed', '기술지도·자문',
  '㈜모비다임 기술지도 및 자문',
  '㈜모비다임', 'LINC', '5,000,000원',
  '2016-10-10', '2016-11-30',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '6133f203-b32c-4e04-a2f7-892d0e38b2f4', '외적벡터를-적용한-3축-엑츄에이터-구동-방안', '외적벡터를 적용한 3축 엑츄에이터 구동 방안', 'completed', '기술지도·자문',
  '㈜두레텍 기술지도 및 자문',
  '㈜두레텍', 'LINC', NULL,
  '2016-10-01', '2016-11-30',
  NULL, ARRAY['기술지도','산학협력','LINC'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '98f1f5d6-96bc-427d-8c60-1537b9339e27', '자동차용-능동소음제어-시스템을-위한-실시간-튜닝툴-개발', '자동차용 능동소음제어 시스템을 위한 실시간 튜닝툴 개발', 'completed', '기술지도·자문',
  '㈜에이알이 기술지도 및 자문',
  '㈜에이알이', 'LINC+', NULL,
  '2018-01-04', '2018-02-05',
  NULL, ARRAY['기술지도','산학협력','LINC+'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '4bafc998-8d57-478f-b061-d3b7325cf2b2', '딥러닝-기반-정답-예측-알고리즘-지도-및-챗봇-서비스-구성', '딥러닝 기반 정답 예측 알고리즘 지도 및 챗봇 서비스 구성', 'completed', '기술지도·자문',
  '㈜지의소프트 기술지도 및 자문',
  '㈜지의소프트', 'LINC+', NULL,
  '2018-12-17', '2018-12-30',
  NULL, ARRAY['기술지도','산학협력','LINC+'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '191c2659-0818-4cbd-8925-eb3d8d37230d', '운전데이터-활용-운전안내-서비스-및-상황인지-추천-기법', '운전데이터 활용 운전안내 서비스 및 상황인지 추천 기법', 'completed', '기술지도·자문',
  '㈜무릉 기술지도 및 자문',
  '㈜무릉', 'LINC+', NULL,
  '2019-01-02', '2019-01-18',
  NULL, ARRAY['기술지도','산학협력','LINC+'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '257ab3b3-ed33-44fc-a3b2-e809e9398f9e', 'aivory-인공지능-추천서비스-신뢰도-향상-방안', 'AIVORY 인공지능 추천서비스 신뢰도 향상 방안', 'completed', '기술지도·자문',
  '㈜플랜아이 기술지도 및 자문',
  '㈜플랜아이', 'LINC+', NULL,
  '2020-06-23', '2020-07-23',
  NULL, ARRAY['기술지도','산학협력','LINC+'], false
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (id, slug, title, status, category, short_description,
   organization, program_type, budget, start_date, end_date,
   thumbnail, tags, is_featured)
VALUES (
  '2969fea4-2648-4219-bf21-64bd514ce30e', '시선-추적-기술-활용-앱-개발-및-성능평가-방안', '시선 추적 기술 활용 앱 개발 및 성능평가 방안', 'completed', '기술지도·자문',
  '㈜메이팜소프트 기술지도 및 자문',
  '㈜메이팜소프트', 'LINC+', NULL,
  '2021-10-05', '2021-11-04',
  NULL, ARRAY['기술지도','산학협력','LINC+'], false
) ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- ============================================================
-- SW 등록 20건 / 산업체 연구과제 6건
-- 기술이전 14건 / 기술지도·자문 15건
-- ============================================================