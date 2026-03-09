-- ============================================================
-- SD Lab Homepage - Seed Data (기존 정적 데이터 마이그레이션)
-- ============================================================

-- ============================================================
-- 1. MEMBERS
-- ============================================================

INSERT INTO members (id, slug, name_ko, name_en, "group", position, department, image, email, links, research_keywords, bio, education, career, display_order) VALUES
('m-1', 'young-kuk-kim', '김영국', 'Young-Kuk Kim', 'professor', '교수', '컴퓨터인공지능학부', NULL, 'ykim@cnu.ac.kr',
  '{"scholar": "https://scholar.google.co.kr/citations?user=PLACEHOLDER", "homepage": "https://sdlab.cnu.ac.kr"}',
  ARRAY['추천시스템', '실시간 스트림 데이터 처리', '상황인지 컴퓨팅', 'IoT', '바이오 빅데이터'],
  '충남대학교 컴퓨터인공지능학부 교수로서 스마트데이터연구실을 이끌고 있습니다. 실시간 스마트 컴퓨팅, 바이오AI융합, 환경IT융합 분야의 연구를 수행하고 있습니다.',
  '[{"degree":"학사","institution":"서울대학교","field":"계산통계학과","year":"1988"},{"degree":"석사","institution":"서울대학교","field":"계산통계학과","year":"1990"},{"degree":"박사","institution":"University of Virginia","field":"Computer Science","year":"2000"}]',
  '[{"period":"2002 - 현재","role":"교수","organization":"충남대학교 컴퓨터인공지능학부"},{"period":"2018 - 2024","role":"AI융합연구센터장","organization":"충남대학교"},{"period":"2015 - 2017","role":"컴퓨터공학과 학과장","organization":"충남대학교"},{"period":"2000 - 2002","role":"선임연구원","organization":"한국전자통신연구원(ETRI)"},{"period":"1990 - 1995","role":"연구원","organization":"LG전자 중앙연구소"}]',
  1),

('m-2', 'gildong-hong', '홍길동', 'Gildong Hong', 'phd', '박사과정', '컴퓨터인공지능학부', NULL, NULL,
  '{"github": "https://github.com/placeholder"}',
  ARRAY['추천시스템', '딥러닝', '실시간 데이터 처리'],
  NULL,
  '[{"degree":"학사","institution":"충남대학교","field":"컴퓨터공학","year":"2020"},{"degree":"석사","institution":"충남대학교","field":"컴퓨터공학","year":"2022"}]',
  '[]',
  2),

('m-3', 'sample-kim', '김샘플', 'Sample Kim', 'ms', '석사과정', '컴퓨터인공지능학부', NULL, NULL,
  '{}',
  ARRAY['바이오 빅데이터', '머신러닝'],
  NULL,
  '[{"degree":"학사","institution":"충남대학교","field":"컴퓨터공학","year":"2024"}]',
  '[]',
  3),

('m-4', 'test-lee', '이테스트', 'Test Lee', 'ms', '석사과정', '컴퓨터인공지능학부', NULL, NULL,
  '{}',
  ARRAY['IoT', '환경 모니터링', '데이터 분석'],
  NULL,
  '[{"degree":"학사","institution":"충남대학교","field":"컴퓨터공학","year":"2025"}]',
  '[]',
  4),

('m-5', 'alumni-park', '[샘플] 박졸업', 'Alumni Park', 'alumni', '석사 졸업', '컴퓨터인공지능학부', NULL, NULL,
  '{}',
  ARRAY['추천시스템', '데이터마이닝'],
  NULL,
  '[{"degree":"학사","institution":"충남대학교","field":"컴퓨터공학","year":"2018"},{"degree":"석사","institution":"충남대학교","field":"컴퓨터공학","year":"2020"}]',
  '[{"period":"2020 - 현재","role":"연구원","organization":"한국전자통신연구원(ETRI)"}]',
  5),

('m-6', 'alumni-choi', '[샘플] 최졸업', 'Alumni Choi', 'alumni', '박사 졸업', '컴퓨터인공지능학부', NULL, NULL,
  '{}',
  ARRAY['IoT', '스마트팩토리', '실시간 처리'],
  NULL,
  '[{"degree":"학사","institution":"충남대학교","field":"컴퓨터공학","year":"2015"},{"degree":"석사","institution":"충남대학교","field":"컴퓨터공학","year":"2017"},{"degree":"박사","institution":"충남대학교","field":"컴퓨터공학","year":"2022"}]',
  '[{"period":"2022 - 현재","role":"조교수","organization":"한밭대학교 컴퓨터공학과"}]',
  6);

-- ============================================================
-- 2. RESEARCH AREAS
-- ============================================================

INSERT INTO research_areas (id, slug, title, short_description, full_description, icon, image, keywords, applications, display_order) VALUES
('ra-1', 'smart-computing', '실시간 스마트 컴퓨팅 응용',
  '실시간 스트림 데이터 처리 및 상황인지 기반의 지능형 서비스 연구',
  '실시간 스트림 데이터 처리, 추천시스템, 상황인지 컴퓨팅, IoT 기술을 활용하여 스마트팩토리, 스마트모빌리티, 스마트시티 등 다양한 분야에 적용 가능한 지능형 서비스를 연구합니다.',
  'cpu', NULL,
  ARRAY['추천시스템', '실시간 스트림 데이터 처리', '상황인지', 'IoT'],
  ARRAY['스마트팩토리', '스마트모빌리티', '스마트시티'],
  1),

('ra-2', 'bio-ai', '바이오AI융합 연구',
  '바이오 빅데이터와 AI 기술을 융합한 지능형 서비스 연구',
  '스마트팜, 바이오 빅데이터, 지능형 서비스 등의 키워드를 중심으로 바이오 분야와 AI 기술의 융합을 통해 신약개발, 스마트팜 등의 응용 분야에 기여하는 연구를 수행합니다.',
  'dna', NULL,
  ARRAY['스마트팜', '바이오 빅데이터', '지능형 서비스'],
  ARRAY['신약개발', '스마트팜'],
  2),

('ra-3', 'environmental-it', '환경IT융합 연구',
  'IoT 및 데이터 분석 기반의 환경 모니터링 및 관리 연구',
  '수질관리, 대기오염, 미세먼지 등 환경 문제 해결을 위해 IoT 센서 데이터 수집 및 분석 기술을 활용한 환경 모니터링 시스템을 연구합니다.',
  'leaf', NULL,
  ARRAY['수질관리', '대기오염', '미세먼지', 'IoT'],
  ARRAY['수질관리', '대기오염 모니터링'],
  3);

-- ============================================================
-- 3. PUBLICATIONS (논문 + 특허)
-- ============================================================

INSERT INTO publications (id, slug, title, authors, type, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES
('pub-1', 'context-aware-recommendation-iot',
  '[샘플] A Context-Aware Recommendation Framework for Real-Time IoT Stream Data',
  ARRAY['Young-Kuk Kim', 'Gildong Hong', 'Sample Kim'],
  'journal', 'Journal of Intelligent Information Systems', 2025, 3, NULL, NULL,
  'This paper proposes a context-aware recommendation framework that processes real-time IoT stream data to provide personalized recommendations in smart factory environments.',
  ARRAY['추천시스템', '상황인지', 'IoT', '실시간 스트림 처리'],
  NULL, TRUE),

('pub-2', 'deep-learning-water-quality',
  '[샘플] Deep Learning-Based Water Quality Prediction Using Multi-Sensor IoT Data',
  ARRAY['Test Lee', 'Young-Kuk Kim'],
  'conference', 'International Conference on Data Engineering (ICDE)', 2025, 5, NULL, NULL,
  'We present a deep learning model for predicting water quality parameters using multi-sensor IoT data streams, achieving improved accuracy over traditional methods.',
  ARRAY['수질관리', '딥러닝', 'IoT', '환경 모니터링'],
  NULL, TRUE),

('pub-3', 'smart-farm-bio-data-analysis',
  '[샘플] Intelligent Service Platform for Smart Farm Based on Bio Big Data Analysis',
  ARRAY['Sample Kim', 'Young-Kuk Kim'],
  'journal', 'Computers and Electronics in Agriculture', 2024, 11, NULL, NULL,
  'This study develops an intelligent service platform for smart farms by integrating bio big data analysis techniques with real-time environmental monitoring.',
  ARRAY['스마트팜', '바이오 빅데이터', '지능형 서비스'],
  NULL, FALSE),

('pub-4', 'real-time-stream-processing-smart-city',
  '[샘플] Scalable Real-Time Stream Processing Architecture for Smart City Applications',
  ARRAY['Gildong Hong', 'Young-Kuk Kim'],
  'conference', 'IEEE International Conference on Big Data', 2024, 12, NULL, NULL,
  'We propose a scalable architecture for real-time stream processing designed for smart city applications, handling high-velocity data from diverse urban IoT sensors.',
  ARRAY['실시간 스트림 처리', '스마트시티', '빅데이터'],
  NULL, FALSE),

('pub-5', 'air-pollution-prediction-fine-dust',
  '[샘플] Fine Dust Concentration Prediction Model Using Environmental IoT Sensor Networks',
  ARRAY['Test Lee', 'Gildong Hong', 'Young-Kuk Kim'],
  'journal', 'Environmental Modelling & Software', 2024, 8, NULL, NULL,
  'A prediction model for fine dust (PM2.5/PM10) concentration leveraging environmental IoT sensor networks and ensemble learning techniques.',
  ARRAY['미세먼지', '대기오염', 'IoT', '예측 모델'],
  NULL, TRUE),

-- 특허 (type = 'patent')
('pat-1', 'iot-stream-context-recommendation',
  '[샘플] IoT 스트림 데이터 기반 상황인지 추천 시스템 및 그 방법',
  ARRAY['김영국', '홍길동'],
  'patent', '대한민국 특허청', 2025, 1, NULL, NULL,
  '본 발명은 IoT 센서에서 수집되는 실시간 스트림 데이터를 분석하여 사용자 상황에 맞는 추천을 제공하는 시스템 및 방법에 관한 것이다.',
  ARRAY['IoT', '추천시스템', '상황인지', '실시간 처리'],
  NULL, FALSE),

('pat-2', 'bio-data-smart-farm-platform',
  '[샘플] 바이오 빅데이터 분석 기반 스마트팜 지능형 서비스 플랫폼',
  ARRAY['김영국', '김샘플'],
  'patent', '대한민국 특허청', 2024, 6, NULL, NULL,
  '본 발명은 바이오 빅데이터 분석 기술을 활용하여 스마트팜 환경에서 작물 생육 상태를 모니터링하고 최적의 재배 조건을 추천하는 지능형 서비스 플랫폼에 관한 것이다.',
  ARRAY['스마트팜', '바이오 빅데이터', '지능형 플랫폼'],
  NULL, FALSE),

('pat-3', 'water-quality-prediction-deep-learning',
  '[샘플] 딥러닝 기반 수질 예측 장치 및 방법',
  ARRAY['김영국', '이테스트'],
  'patent', '대한민국 특허청', 2024, 9, NULL, NULL,
  '본 발명은 환경 IoT 센서 네트워크에서 수집된 다중 센서 데이터를 딥러닝 모델로 분석하여 수질 오염을 사전 예측하는 장치 및 방법에 관한 것이다.',
  ARRAY['수질 예측', '딥러닝', 'IoT 센서', '환경 모니터링'],
  NULL, FALSE);

-- ============================================================
-- 4. PROJECTS
-- ============================================================

INSERT INTO projects (id, slug, title, status, category, short_description, full_description, organization, program_type, budget, start_date, end_date, thumbnail, tags, demo_url, is_featured) VALUES
('proj-1', 'ai-convergence-research-center',
  '[샘플] AI융합연구센터지원사업',
  'active', '국가연구개발',
  'AI 기술과 다양한 산업 분야의 융합을 통한 지능형 서비스 연구개발',
  '실시간 스마트 컴퓨팅 기술을 기반으로 스마트팩토리, 스마트모빌리티, 스마트시티 등 다양한 분야에서 AI 융합 연구를 수행하는 센터 지원 사업입니다.',
  '과학기술정보통신부', 'AI융합연구센터지원사업', NULL, '2021-03', '2026-02', NULL,
  ARRAY['AI', '스마트컴퓨팅', '융합연구'], NULL, TRUE),

('proj-2', 'ai-convergence-talent-development',
  '[샘플] AI융합혁신인재양성사업',
  'active', '교육부사업',
  'AI 융합 분야의 혁신 인재를 양성하기 위한 교육 및 연구 프로그램',
  '바이오AI융합 분야를 중심으로 차세대 AI 융합 인재를 양성하기 위한 교육과정 개발 및 연구 지원 사업입니다.',
  '교육부', 'AI융합혁신인재양성사업', NULL, '2022-09', '2027-08', NULL,
  ARRAY['AI', '인재양성', '바이오융합'], NULL, TRUE),

('proj-3', 'environmental-iot-monitoring',
  '[샘플] 환경 IoT 기반 수질 및 대기 모니터링 시스템',
  'active', '국가연구개발',
  'IoT 센서 네트워크를 활용한 실시간 환경 모니터링 및 예측 시스템 개발',
  '수질관리 및 대기오염(미세먼지) 모니터링을 위한 IoT 센서 네트워크 기반의 실시간 데이터 수집, 분석, 예측 시스템을 개발하는 연구 프로젝트입니다.',
  '환경부', NULL, NULL, '2023-04', '2025-12', NULL,
  ARRAY['환경', 'IoT', '수질관리', '미세먼지'], NULL, FALSE),

('proj-4', 'smart-factory-recommendation',
  '[샘플] 스마트팩토리 상황인지 추천시스템',
  'completed', '산학협력',
  '스마트팩토리 환경에서의 실시간 상황인지 기반 추천시스템 개발',
  '스마트팩토리 환경에서 IoT 센서 데이터를 기반으로 실시간 상황을 인지하고 최적의 공정 파라미터를 추천하는 시스템을 개발하는 산학협력 프로젝트입니다.',
  '중소벤처기업부', NULL, NULL, '2021-06', '2023-05', NULL,
  ARRAY['스마트팩토리', '추천시스템', '상황인지'], NULL, FALSE);

-- ============================================================
-- 5. NEWS
-- ============================================================

INSERT INTO news (id, slug, title, summary, category, date, is_pinned) VALUES
('news-1', 'icde-2025-paper-accepted',
  '[샘플] ICDE 2025 논문 게재 승인',
  '이테스트 학생의 ''Deep Learning-Based Water Quality Prediction Using Multi-Sensor IoT Data'' 논문이 ICDE 2025에 게재 승인되었습니다.',
  'acceptance', '2025-01-15', FALSE),

('news-2', 'best-paper-award-2024',
  '[샘플] 한국정보과학회 우수논문상 수상',
  '홍길동 학생이 한국정보과학회 2024 추계학술발표대회에서 실시간 스트림 처리 관련 연구로 우수논문상을 수상하였습니다.',
  'award', '2024-12-05', FALSE),

('news-3', '2025-graduate-recruitment',
  '[샘플] 2025년도 대학원생 모집 안내',
  '스마트데이터연구실에서 2025년도 석사/박사과정 대학원생을 모집합니다. 관심 있는 분은 김영국 교수님께 연락 바랍니다.',
  'recruitment', '2025-02-01', TRUE),

('news-4', 'ai-convergence-seminar-2025',
  '[샘플] AI융합 세미나 개최 안내',
  '2025년 3월 AI융합연구센터 주관 춘계 세미나가 충남대학교 공대 5호관에서 개최됩니다.',
  'event', '2025-03-01', FALSE);

-- ============================================================
-- 6. CONTACT INFO
-- ============================================================

INSERT INTO contact_info (id, lab_name_ko, lab_name_en, professor_name, professor_title, professor_email, building, professor_office, lab_room, professor_phone, lab_phone, department, university, address, map_embed_url) VALUES
('main', '스마트데이터연구실', 'Smart Data Lab', '김영국', '교수', 'ykim@cnu.ac.kr',
  '공대 5호관', '516호', '532호', '821-5450', '821-7441',
  '공과대학 컴퓨터인공지능학부', '충남대학교',
  '대전광역시 유성구 대학로 99 충남대학교 공대 5호관', NULL);

-- ============================================================
-- 7. JOIN TABLE DATA (관계 연결)
-- ============================================================

-- 논문 ↔ 멤버 (저자 관계)
INSERT INTO publication_authors (publication_id, member_id, author_order) VALUES
('pub-1', 'm-1', 1), ('pub-1', 'm-2', 2), ('pub-1', 'm-3', 3),
('pub-2', 'm-4', 1), ('pub-2', 'm-1', 2),
('pub-3', 'm-3', 1), ('pub-3', 'm-1', 2),
('pub-4', 'm-2', 1), ('pub-4', 'm-1', 2),
('pub-5', 'm-4', 1), ('pub-5', 'm-2', 2), ('pub-5', 'm-1', 3),
('pat-1', 'm-1', 1), ('pat-1', 'm-2', 2),
('pat-2', 'm-1', 1), ('pat-2', 'm-3', 2),
('pat-3', 'm-1', 1), ('pat-3', 'm-4', 2);

-- 논문 ↔ 연구분야
INSERT INTO publication_research_areas (publication_id, research_area_id) VALUES
('pub-1', 'ra-1'), ('pub-2', 'ra-3'), ('pub-3', 'ra-2'),
('pub-4', 'ra-1'), ('pub-5', 'ra-3'),
('pat-1', 'ra-1'), ('pat-2', 'ra-2'), ('pat-3', 'ra-3');

-- 논문 ↔ 프로젝트
INSERT INTO publication_projects (publication_id, project_id) VALUES
('pub-1', 'proj-1'), ('pub-2', 'proj-3'), ('pub-3', 'proj-2'),
('pub-4', 'proj-1'), ('pub-5', 'proj-3'),
('pat-1', 'proj-1'), ('pat-2', 'proj-2'), ('pat-3', 'proj-3');

-- 프로젝트 ↔ 멤버
INSERT INTO project_members (project_id, member_id) VALUES
('proj-1', 'm-1'), ('proj-1', 'm-2'),
('proj-2', 'm-1'), ('proj-2', 'm-3'),
('proj-3', 'm-1'), ('proj-3', 'm-4'),
('proj-4', 'm-1'), ('proj-4', 'm-2');

-- 프로젝트 ↔ 연구분야
INSERT INTO project_research_areas (project_id, research_area_id) VALUES
('proj-1', 'ra-1'), ('proj-2', 'ra-2'),
('proj-3', 'ra-3'), ('proj-4', 'ra-1');

-- 소식 ↔ 프로젝트
INSERT INTO news_projects (news_id, project_id) VALUES
('news-1', 'proj-3'), ('news-2', 'proj-1'), ('news-4', 'proj-1');

-- 소식 ↔ 논문
INSERT INTO news_publications (news_id, publication_id) VALUES
('news-1', 'pub-2');
