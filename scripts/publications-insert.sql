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


-- ═══ INTL_JOURNAL (39건) ═══

INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd11408e6-36f9-41da-accf-eb290ccc767b',
  'supporting-real-time-transactions-in-distributed-time-c-1995',
  'Supporting Real-Time Transactions in Distributed Time-Critical Applications',
  ARRAY['김영국', '외 3인'],
  'journal',
  true,
  'Journal of Mini and Microcomputers (ISMM)',
  1995,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3bc05591-aac9-4e56-af0c-46cea3efee08',
  'software-architecture-for-a-firm-real-time-database-sys-1996',
  'Software Architecture for a Firm Real-Time Database System',
  ARRAY['김영국', '외 2인'],
  'journal',
  true,
  'Journal of Systems Architecture (Elsevier Science)',
  1996,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f80e5948-356f-4d43-861a-9c564b9e24ca',
  'a-channel-recommendation-system-in-mobile-environment-2006',
  'A Channel Recommendation System in Mobile Environment',
  ARRAY['박성준', '강상길', '김영국'],
  'journal',
  true,
  'Transactions on Consumer Electronics (IEEE)',
  2006,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '133c4a0b-ff77-4951-9c22-3a23f88ec755',
  'dynamically-personalized-web-service-system-to-mobile-d-2006',
  'Dynamically Personalized Web Service System to Mobile Devices',
  ARRAY['강상길', '박원익', '김영국'],
  'journal',
  true,
  'LNAI (FQAS 2006) (Springer)',
  2006,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5e587cb2-e41c-418b-9d27-bf47ad616b04',
  'dynamical-e-commerce-system-for-shopping-mall-site-thro-2006',
  'Dynamical E-commerce System for Shopping Mall Site through Mobile Devices',
  ARRAY['강상길', '박원익', '김영국'],
  'journal',
  true,
  'LNCS (DEECS 2006) (Springer)',
  2006,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1ebbc372-335e-4595-a580-940ead614e10',
  'personalized-digital-e-library-service-using-users-prof-2006',
  'Personalized Digital E-library Service Using Users'' Profile Information',
  ARRAY['박원익', '김원일', '강상길', '이현진', '김영국'],
  'journal',
  true,
  'LNCS (ECDL 2006) (Springer)',
  2006,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f201358c-072d-4313-b3d4-041196a04bc9',
  'adaptive-hierarchical-surrogate-for-searching-web-with--2007',
  'Adaptive Hierarchical Surrogate for Searching Web with Mobile Devices',
  ARRAY['이우기', '강상길', '임승길', '신명근', '김영국'],
  'journal',
  true,
  'Transactions on Consumer Electronics (IEEE)',
  2007,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fda74df0-cfc9-49c5-8ed7-3f308d566302',
  'the-design-characteristics-of-an-advanced-alarm-system--2008',
  'The Design Characteristics of an Advanced Alarm System for SMART',
  ARRAY['장귀숙', '성덕현', '금종룡', '박희윤', '김영국'],
  'journal',
  true,
  'Annals of Nuclear Energy (Elsevier)',
  2008,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7ff7ca88-d683-47f3-af9a-29a38da6116f',
  'a-personalized-multimedia-contents-recommendation-using-2012',
  'A Personalized Multimedia Contents Recommendation Using a Psychological Model',
  ARRAY['박원익', '강상길', '김영국'],
  'journal',
  true,
  'Computer Science and Information Systems (ISSN: 1820-0214) (SCIE) (IF: 0.625/2011) (ComSIS Consortium)',
  2012,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7ecc2c2c-df26-4d6a-95f7-4f7d7d00e1de',
  'a-recommendation-scheme-considering-customers-psycholog-2012',
  'A Recommendation Scheme Considering Customer''s Psychological Patterns in M-Commerce Environment',
  ARRAY['박원익', '강상길', '김영국'],
  'journal',
  true,
  'Information Journal (ISSN 1343-4500) (SCIE) (IF: 0.250/2011) (International Information Institute)',
  2012,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b4e52132-c5f5-4043-aeea-4051318832e9',
  'providing-prioritized-search-result-with-tag-coupling-b-2012',
  'Providing Prioritized Search Result with Tag Coupling-based Boolean Query Matching',
  ARRAY['주원균', '박민우', '최기석', '김용', '김영국'],
  'journal',
  true,
  'International Journal of Smart Home (ISSN: 1975-4094) (SCOPUS) (Science & Engineering Research Support Society)',
  2012,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fbef7a73-609c-44c5-b3a3-2f0bc232aea8',
  'expert-recommendation-system-based-on-analyzing-experti-2013',
  'Expert Recommendation System based on Analyzing Expertise and Networks of Human Resources in National Science & Technology Information Service',
  ARRAY['양명석', '강남규', '김윤정', '김재수', '최광남', '김영국'],
  'journal',
  true,
  'Journal of Central South University of Technology ISSN: 2095-2899 (print), 2227-5223 (online) (SCIE) (Springer Berlin Heidelberg)',
  2013,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0e901ead-d579-48e6-bc79-2d57d6297234',
  'a-study-on-semantic-web-design-for-global-national-rd-s-2013',
  'A Study on Semantic Web Design for Global National R&D Status Analysis - Focusing on the Use of LOD Cloud -',
  ARRAY['권이남', '최기석', '김재수', '전성진', '김영국'],
  'journal',
  true,
  'Cluster Computing, The Journal of ISSN: 1386-7857 (print version) ISSN: 1573-7543 (electronic version) (SCIE) (2012 IF: 0.776) (SPRINGE R, 233 SPRING ST, NEW YORK)',
  2013,
  NULL,
  '10.1007/s1058',
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '61aa26be-e431-4ee0-93e3-0fe4c0e879f8',
  'temporal-workload-analysis-and-its-application-to-power-2013',
  'TEMPORAL WORKLOAD ANALYSIS AND ITS APPLICATION TO POWER-AW ARE SCHEDULING',
  ARRAY['설예인', '김정욱', '김영국'],
  'journal',
  true,
  'International Journal of Embedded Systems and Applications (IJESA) (ISSN: 1839-5171) 기타학술지 (AIRCC Publishing Corporation)',
  2013,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b7d2da5f-a755-4ad5-9e0a-795728175ee0',
  'evaluating-performance-of-marte-as-a-real-time-framewor-2013',
  'Evaluating performance of MARTe as a real-time framework for feed-back control system at tokamak device',
  ARRAY['윤상원 이웅렬 이 태구 박미경 이상일 Andre Neto', 'Anders Wallan der. 김영국'],
  'journal',
  true,
  'Fusion Engineering and Design (ISSN 0920-3796) (SCI) (IF: 1.490) (Elsevier)',
  2013,
  10,
  '10.1016/j.fuse',
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0c8be0ba-f2a3-4d51-8202-3b67f23b583a',
  'a-study-of-construction-of-agent-based-information-conn-2013',
  'A Study of Construction of Agent-based Information-connecting Framework for Efficient Collection of National R&D Reports',
  ARRAY['최기석', '김영국'],
  'journal',
  true,
  'Journal of Next Generation Information Technology(JNIT) (SCOPUS) (AICIT)',
  2013,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '07694542-1437-4dab-875b-03af8c56aba9',
  'applying-dynamic-priority-scheduling-scheme-to-static-s-2014',
  'Applying Dynamic Priority Scheduling Scheme to Static Systems of Pinwheel Task Model in Power-Aware Scheduling',
  ARRAY['설예인', '김영국'],
  'journal',
  true,
  'The Scientific World Journal (TSWJ) ISSN: 2356-6140 (Print), 1537-744X (Online) (기타학술지) (IF: 1.730) (Hindawi Publishing Corporation)',
  2014,
  NULL,
  '10.1155/8086',
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '894b0243-f052-491f-ad3b-88700a051b77',
  'an-intrusive-analyzer-for-hadoop-systems-based-on-wirel-2014',
  'An Intrusive Analyzer for Hadoop Systems based on Wireless Sensor Networks',
  ARRAY['배병진', '김영주', '김영국', '하옥균', '전용기'],
  'journal',
  true,
  'International Journal of Distributed Sensor Networks ISSN: 1550-1329 (Print), 1550-1477 (Online) (SCIE) (IF: 1.727) (Q3) (Hindawi Publishing Corporation)',
  2014,
  NULL,
  '10.1155/2648',
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8d8c796c-0a21-4ebc-b1ce-af7361def2e2',
  'construction-of-national-rd-data-retrieval-based-resear-2016',
  'Construction of National R&D Data Retrieval-based Researcher Map',
  ARRAY['양명석', '강남규', '김태현', '주원균', '임경태', '최광남', '김영국'],
  'journal',
  true,
  'Information (ISSN 1343-4500) (SCOPUS) (IF: 0.250/2011) (International Information Institute)',
  2016,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fe823e85-8324-4b07-8500-0ba6f3381a9f',
  'a-self-synchronization-mechanism-in-a-federated-cloud-2016',
  'A Self Synchronization Mechanism in a Federated Cloud',
  ARRAY['Dada Huang', 'Amol Jaikar. Geyong -Ryoon Kim', 'Young- Kuk Kim', 'Seo-Yo ung Noh'],
  'journal',
  true,
  'International Journal of Software Engineering and Its Applications (SCOPUS) (보안공학 연구지원 센터 (IJSEIA))',
  2016,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b039f963-0cb6-4e3d-b5b2-f53bcac34777',
  'development-of-platform-based-knowledge-map-service-to--2018',
  'Development of Platform-Based Knowledge Map Service to get Data Insights of R&D Institution on User-Interested Subjects',
  ARRAY['양명석', '주원균', '최기석', '김영국', '김윤정'],
  'journal',
  true,
  'Wireless Personal Communications: An International Journal (ISSN 0929-6212) (SCIE) IF: 0.951/2016(Q4) (Springer)',
  2018,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '82a156c7-970e-46c4-93c1-677ebe4feafd',
  'weak-signal-detecting-of-industry-convergence-using-inf-2018',
  'Weak signal detecting of industry convergence using information of products and services of global listed companies - focusing on growth engine industry in South Korea -',
  ARRAY['권이남', '박준환', '문영호', '이방래', '신영호', '김영국 Soo-Ye'],
  'journal',
  true,
  'Journal of Open Innovation: Technology, Market, and Complexity (ISSN 2199-8531) IF: 4.209 (2020) (Springer)',
  2018,
  3,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ee14a0ad-45be-4289-998a-de651f20ea48',
  'a-context-aware-personalized-recommender-system-in-smar-2018',
  'A Context-Aware Personalized Recommender System in Smart Vending Machine',
  ARRAY['on Jeong', 'Kim Ryong', 'Young- Kuk Kim'],
  'journal',
  true,
  'Information: an international Interdisciplinary journal (ISSN 1343-4500) IF: 0.250 (2011) (International Information Institute)',
  2018,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0f8bd362-597e-4aec-8075-647362a802c8',
  'deeplearning-model-for-unstructuredknowledge-classifica-2019',
  'DeepLearning Model for UnstructuredKnowledge Classification Using- Structural Features',
  ARRAY['Wonky unJoo', 'KiSeok Choi', 'Young- Kuk- Kim'],
  'journal',
  true,
  'Personal_and- Ubiquitous- Computing ISSN:1617-4909- (Print) 1617-4917- (Online)(SCI) IF:1.735(2019), IF:3.006(2020) (Springer- London)',
  2019,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9f4e5995-98dd-40bf-a178-1b157207ca18',
  'identification-of-target-chicken-populations-by-machine-2021',
  'Identification of Target Chicken Populations by Machine Learning Models Using the Minimum Number of SNPs',
  ARRAY['Dongw', 'on Seo', '외 8명'],
  'journal',
  true,
  'Animals (ISSN 2076-2615) (Online) (SCI) IF: 2.323 (2019) (MDPI)',
  2021,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'adfaf369-3252-4b05-8742-d5202563fa3b',
  'aorm-fast-incremental-arbitrary-order-reachability-matr-2021',
  'AORM: Fast Incremental Arbitrary-Order Reachability Matrix Computation for Massive Graphs',
  ARRAY['Sung-S 00 Kim', 'Young - Kuk Kim', 'Young- Min Kang'],
  'journal',
  true,
  'IEEE Access Print ISSN: 2169-3536 Online ISSN: 2169-3536 (SCI) IF: 3.745 (2019-2020)',
  2021,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b45e06a1-b48f-4afd-a878-73c1b9ae2abb',
  'gpnet-genomic-prediction-network-using-locallyconnectee-2021',
  'GpNet: Genomic prediction network using locallyconnecteed layers in Koreannative cattle',
  ARRAY['Hyo-Ju', 'nLee-', '외10명'],
  'journal',
  true,
  'BMC Bioinformatics',
  2021,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5cfa9ef3-7664-40e1-b140-482f35ef455d',
  'hsv-color-space-based-automated-object-localization-for-2021',
  'HSV Color Space-Based Automated Object Localization for Robot Grasping without Prior Knowledge',
  ARRAY['Hyun Chul', 'Kang', '외 5명'],
  'journal',
  true,
  'Applied Sciences (ISSN 2076-3417) IF: 2.679 (2020) IF: 2,838 (2022) (MDPI)',
  2021,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7a45fc31-6ecc-4cf1-837d-0f2fa4c12035',
  'automated-classification-of-normal-control-and-early-st-2021',
  'Automated Classification of Normal Control and Early-Stage Dementia Based on Activities of Daily Living (ADL) Data Acquired from Smart Home Environment',
  ARRAY['Lee-Na', 'm Kwon', '외 8명'],
  'journal',
  true,
  'International Journal of Environmental Research and Public Health (IJERPH) (ISSN: 1660-4601) IF: 3.390 (2020) (MDPI)',
  2021,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3a53f586-5515-4b83-ab89-cac050352f0b',
  'deep-learning-based-context-aware-recommender-system-co-2021',
  'Deep Learning-Based Context-Aware Recommender System Considering Contextual Features',
  ARRAY['Soo-Yeo', 'n Jeong', 'and Young-', 'Kuk Kim'],
  'journal',
  true,
  'Applied Sciences (ISSN 2076-3417) (SCIE) IF: 2.679 (2020) IF: 2,838 (2022) (MDPI)',
  2021,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a1384bc5-3509-485a-b573-3c614f769e1c',
  'use-of-a-graph-neural-network-to-the-weighted-gene-co-e-2022',
  'Use of a graph neural network to the weighted gene co-expression network analysis of Korean native cattle',
  ARRAY['Hyo-Ju', 'n Lee', '외 6명'],
  'journal',
  true,
  'Scientific Reports IF: 4.996 (2021) ISSN 2045-2322 (online) (Springer Nature)',
  2022,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1e02b5a5-8ba7-492d-9490-9253f57afd7b',
  'msenet-marbling-score-estimation-network-for-automated--2022',
  'MSENet: Marbling Score Estimation Network for Automated Assessment of Korean Beef',
  ARRAY['Yeong Jun', 'Koh', '외 5인'],
  'journal',
  true,
  'Meat Science IF: 7.077 ISSN 0309-1740 (Elsevier)',
  2022,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '18bc7d5e-91ef-426c-baa6-4eeb11f38847',
  'deep-learning-model-for-unstructured-knowledge-classifi-2019',
  'Deep Learning Model for Unstructured Knowledge Classification Using Structural Features',
  ARRAY['Wonky un Joo', 'KiSeok Choi', 'Young- Kuk Kim'],
  'journal',
  true,
  'Personal and Ubiquitous Computing ISSN: 1617-4909 (Print) 1617-4917 (Online) (SCI) IF: 1.735 (2019), IF: 3,006 (2020) (Springer London)',
  2019,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '18ac1ba6-3624-4ac9-b0d2-155a7b47e0fb',
  'single-nucleotide-polymorphism-marker-combinations-for--2022',
  'Single nucleotide polymorphism marker combinations for classifying Yeonsan Ogye chicken using a machine learning approach',
  ARRAY['Eunjin Cho', '외 9명'],
  'journal',
  true,
  'Journal of Animal Science and Technology (JAST) eISSN: 2055-0391 pISSN: 2672-0191 IF: 1.801 (2021) (Korean Society of Animal Science and Technology)',
  2022,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7c2f268f-307e-468e-89ac-9aba90be3d87',
  'a-genome-wide-association-study-for-eumelanin-pigmentat-2023',
  'A genome-wide association study for eumelanin pigmentation in chicken plumage using a computer vision approach',
  ARRAY['Seonye', 'ong Heo', '외 9명'],
  'journal',
  true,
  'of Animal Journal Genetics IF: 2,884 (2021) Online ISSN:1365-2052 (Wiley)',
  2023,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4846ddba-861a-486f-892a-79bed94d21e7',
  'deep-learning-based-context-aware-recommender-system-co-2023',
  'Deep Learning-based Context-Aware Recommender System Considering Change in Preference (2020년 연구년 연구결과물)',
  ARRAY['정수연', '김영국'],
  'journal',
  true,
  'Electronics (SCIE) IF: 2.690 (2021) ISSN 2079-9292 (MDPI)',
  2023,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5b8df2fe-7941-4f3c-a0a9-a1ef89728c26',
  'generating-psychological-analysis-tables-for-childrens--2023',
  'Generating psychological analysis tables for children''s drawings using deep learning (2021년 CNU자체연구과제-재직II-1 결과물)',
  ARRAY['이문영', '김영호', '김영국'],
  'journal',
  true,
  'DATA & KNOWLEDGE ENGINEERING (SCIE) IF: 2.5 Online ISSN: 1872-6933 Print ISSN: 0169-023X (Elsevier)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'eca99586-19a9-4dac-8dcc-f70127643b79',
  'absorption-distribution-metabolism-excretion-and-toxici-2024',
  'Absorption Distribution Metabolism Excretion and Toxicity Property Prediction Utilizing a Pre-Trained Natural Language Processing Model and Its Applications in Early-Stage Drug Development',
  ARRAY['정우진', '외 7명'],
  'journal',
  true,
  'Pharmaceuticals (SCI) IF: 4.6 (2022), Q2 ISSN: 1424-8247 (MDPI)',
  2024,
  3,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '387d0edb-0e58-4804-8aed-adb91097edc2',
  'closha-20-a-bio-workflow-design-system-for-massive-geno-2024',
  'Closha 2.0: a bio-workflow design system for massive genome data analysis on high performance cluster infrastructure',
  ARRAY['고건환', '외 8명'],
  'journal',
  true,
  'BMC Bioinformatics (SCI) IF: 2.9 (2024), Q1 ISSN: 1471-2105 (Springer Nature)',
  2024,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, true
);

-- ═══ INTL_CONFERENCE (91건) ═══

INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f0040be8-4724-4901-ac0f-8f4d2ded0b9b',
  'an-approach-towards-predictable-real-time-transaction-p-1993',
  'An Approach Towards Predictable Real-Time Transaction Processing',
  ARRAY['김영국', '외 1인'],
  'conference',
  true,
  '5th Euromicro Workshop on Real-Time Systems (IEEE CS)',
  1993,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '059d12e5-1943-403a-9466-e99d04347e46',
  'developing-a-database-system-for-time-critical-applicat-1993',
  'Developing a Database System for Time-Critical Applications',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  'DEXA ''93 (IEEE)',
  1993,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c61b620e-e266-4e75-9337-02dc9ac54e0d',
  'predictability-and-consistency-in-real-time-database-sy-1993',
  'Predictability and Consistency in Real-Time Database Systems',
  ARRAY['김영국', '외 1인'],
  'conference',
  true,
  'InfoScience ''93 (KISS)',
  1993,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ef437a9d-8313-4673-aa7b-5ca9fa7923a9',
  'mrdb-a-multi-user-real-time-database-testbed-1994',
  'MRDB: A Multi-User Real-Time Database Testbed',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  '27th Hawaii International Conference on Systems Sciences (IEEE CS)',
  1994,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fc550754-bc10-498c-90be-cb7bda6bc290',
  'a-database-server-for-distributed-real-time-systems-iss-1994',
  'A Database Server for Distributed Real-Time Systems: Issues and Experiences',
  ARRAY['김영국', '외 3인'],
  'conference',
  true,
  '2nd Workshop on Parallel and Distributed Real-Time Systems (IEEE CS)',
  1994,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '01705e1b-6631-40b0-9075-938df5f388b0',
  'starbase-a-firm-real-time-database-manager-for-time-cri-1995',
  'StarBase: A Firm Real-Time Database Manager for Time-Critical Applications',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  '7th Euromicro Workshop on Real-Time Systems (IEEE CS)',
  1995,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd2bb5025-514d-48f2-903d-831eaef59678',
  'performance-evaluation-of-a-firm-real-time-database-sys-1995',
  'Performance Evaluation of a Firm Real-Time DataBase System',
  ARRAY['김영국', '외 2명'],
  'conference',
  true,
  '2nd Workshop on Real-Time Computing Systems and Applications (IEEE CS)',
  1995,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd6ace4cc-5280-4162-aa33-c4f6ea6e93b9',
  'managing-contention-and-timing-constraints-in-a-real-ti-1995',
  'Managing Contention and Timing Constraints in a Real-Time Database System',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  '16th Real-Time Systems Symposium (IEEE CS)',
  1995,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0995ab0a-4bf7-4441-8104-714900de2a9a',
  'towards-real-time-performance-in-a-scalable-continuousl-1996',
  'Towards Real-Time Performance in a Scalable, Continuously Available Telecom DBMS',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  '1st Workshop on Real-Time Databases (IEEE TC-RTS)',
  1996,
  3,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bfd64f1b-1ea6-4765-8e4b-4ea3e9d5d8c8',
  'supporting-predictability-in-real-time-database-systems-1996',
  'Supporting Predictability in Real-Time Database Systems',
  ARRAY['김영국', '외 1인'],
  'conference',
  true,
  'Real-Time Technology and Applications Symposium (IEEE TC-RTS)',
  1996,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '351194e4-3309-4424-ba9d-d982a0555cf2',
  'efficiently-supporting-hardsoft-deadline-transactions-i-1996',
  'Efficiently Supporting Hard/Soft Deadline Transactions in Real-Time Database Systems',
  ARRAY['김영국', '외 4인'],
  'conference',
  true,
  '3rd Workshop on Real-Time Computing Systems and Applications (IEEE CS)',
  1996,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5d64dac8-5d9a-4d54-8f7b-f70720fdcc89',
  'hybrid-th-a-hybrid-access-mechanism-for-real-time-memor-1998',
  'Hybrid-TH : A Hybrid Access Mechanism for Real-Time Memory-Resident DBMS',
  ARRAY['김영국', '외 4인'],
  'conference',
  true,
  '54th Workshop on Real-Time Computing Systems and Applications (IEEE CS)',
  1998,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '403f1277-baa4-4977-8c5b-319a115537d1',
  'multiple-intelligent-agent-architecture-for-personalize-1998',
  'Multiple Intelligent Agent Architecture for Personalized Services on Internet Shopping Mall',
  ARRAY['김영국', '외 6명'],
  'conference',
  true,
  'International Conference of KMIS',
  1998,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '66beab17-12ec-4655-8ccd-b81b8f2f8cec',
  'no-log-recovery-mechanism-using-stable-memory-for-real--1999',
  'No-Log Recovery Mechanism Using Stable Memory For Real-Time Main Memory Database Systems',
  ARRAY['김영국', '외 6명'],
  'conference',
  true,
  '6th International Conference on Real-Time Computing Systems and Applications (IEEE CS)',
  1999,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '64912116-594d-413d-a2ec-92bda8ede91b',
  'a-tool-broker-in-remote-development-environments-for-em-2000',
  'A Tool Broker in Remote Development Environments for Embedded Applications',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  'International Conference on Applied Informatics (IASTED)',
  2000,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9c31fa99-5f5d-43c1-9bba-b7dd4690ad75',
  'kernel-structuring-using-time-triggered-message-trigger-2000',
  'Kernel Structuring using Time-Triggered Message-Triggered Objects for Real-Time Active DBMS in Layered Architecture',
  ARRAY['김영국', '외 4인'],
  'conference',
  true,
  '3rd International Symposium on Object-Oriented Real-Time Distributed Computing (ISORC 2000) (IEEE CS)',
  2000,
  3,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'dd72af5d-b823-40b9-92ff-39357ec00cd2',
  'two-step-backup-mechanism-for-real-time-main-memory-dat-2000',
  'Two-Step Backup Mechanism for Real-Time Main Memory Database Recovery',
  ARRAY['김영국', '외 7명'],
  'conference',
  true,
  '7th International Conference on Real-Time Computing Systems and Applications (IEEE CS)',
  2000,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4f4427bd-5dc2-4c72-b27b-a4ebd380eaf5',
  'reducing-communication-overhead-in-an-embedded-applicat-2001',
  'Reducing Communication Overhead in an Embedded Application Development Toolset',
  ARRAY['김영국', '외 2명'],
  'conference',
  true,
  'International Conference on Applied Informatics (IASTED Internatio nal)',
  2001,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a881c416-a6e0-4712-9cc9-f07e3c46c97f',
  'developing-a-triggering-system-for-real-time-databases--2001',
  'Developing a Triggering System for Real-Time Databases in Distributed Environment',
  ARRAY['김영국', '외 3명'],
  'conference',
  true,
  '4th International Symposium on Object-Oriented Real-Time Distributed Computing (ISORC 2001) (IEEE CS)',
  2001,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fb94718d-e61d-4870-8351-7dca2db637a0',
  'an-efficient-selection-and-provision-mechanism-for-pers-2001',
  'An Efficient Selection and Provision Mechanism for Personalized Services In Internet Virtual Shopping Mall Environment',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  'World Multiconference on Systemics, Cybernetics and Informatics 2001 (IIIS, IEEE CS)',
  2001,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e9114277-09bb-47bd-872c-96c70a1e2164',
  'development-of-a-personalized-virtual-shopping-mall-sys-2001',
  'Development of a Personalized Virtual Shopping Mall System in Distributed Heterogeneous Environment',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  '14th International Conference on Parallel and Distributed Computing Systems (ISCA)',
  2001,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '757432ff-daf1-45e0-adce-ac11c21f7a0c',
  'an-efficient-selection-method-for-personalized-advertis-2001',
  'An Efficient Selection Method for Personalized Advertisements Using Bitwise Operations',
  ARRAY['김영국', '외 4인'],
  'conference',
  true,
  '53th session Contributed Papers (ISI)',
  2001,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5250f22a-ae77-4f41-9921-41976a26933e',
  'a-security-system-for-preventing-an-intrusion-on-networ-2002',
  'A Security System for Preventing an Intrusion on Network',
  ARRAY['김영국', '외 2인'],
  'conference',
  true,
  '4th International Conference on Advanced Communication Technology (IEEE)',
  2002,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1bf01fd7-ccba-49f4-9058-7e3454b6aaea',
  'middleware-for-platform-independent-toolset-to-develop--2002',
  'Middleware for Platform Independent Toolset to Develop Real-Time Embedded Applications',
  ARRAY['김영국', '외 3명'],
  'conference',
  true,
  '8th International Conference on Real-Time Computing Systems and Applications (IEEE CS)',
  2002,
  3,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '55cbdbd6-8afd-4a5b-af5d-c304cefa5e6a',
  'performance-enhancement-of-java-virtual-machine-in-embe-2003',
  'Performance Enhancement of Java Virtual Machine in Embedded System Environment through the Extension of Java Byte Code',
  ARRAY['이지현', '김 영국', '외 1명'],
  'conference',
  true,
  'International Symposium on Information Science and Electrical Engineering (ISEE)',
  2003,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a947470b-68a7-4d52-8d3a-77e459102e8b',
  'consistent-real-time-data-dissemination-in-mobile-compu-2004',
  'Consistent Real-Time Data Dissemination in Mobile Computing Environment',
  ARRAY['윤혜숙', '김영국'],
  'conference',
  true,
  'Proceeding of the Symposium on Information and Communications Technology (ICT) (KSEA, KOFST)',
  2004,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '333f275c-a409-4be9-829b-9ff5474b03df',
  'broadcasting-real-time-data-with-maintaining-consistenc-2004',
  'Broadcasting Real-Time Data with Maintaining Consistency in Mobile Environments',
  ARRAY['윤혜숙', '김영국'],
  'conference',
  true,
  '10th International Conference on Real-Time Computing Systems and Applications (IEEE CS)',
  2004,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '782e7464-d372-429b-96f5-b265247e5591',
  'transaction-centric-split-synchronization-mechanism-for-2005',
  'Transaction-Centric Split Synchronization Mechanism for Mobile E-Business Applications',
  ARRAY['최미선', '김영국'],
  'conference',
  true,
  'DEEC 2005 (IEEE CS)',
  2005,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'eead9aab-4ea9-4bc1-971d-d483c8d467ee',
  'a-personalized-contents-recommendation-scheme-in-digita-2005',
  'A Personalized Contents Recommendation Scheme in Digital Multimedia Broadcasting Environment',
  ARRAY['박성준', '김영국'],
  'conference',
  true,
  'IJSCK 2005',
  2005,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e6b2cc5b-8b5e-4e04-9ad1-c71d54d07c72',
  'a-mobile-transaction-processing-model-supporting-split--2005',
  'A Mobile Transaction processing Model Supporting Split Synchronization Mechanism',
  ARRAY['최미선', '김영국'],
  'conference',
  true,
  'KJDB 2005',
  2005,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7d152ec4-8a8d-4f60-81df-282daec2b787',
  'a-channel-recommendation-system-in-mobile-environment-2006-1',
  'A Channel Recommendation System in Mobile Environment',
  ARRAY['박성준', '강상길', '김영국'],
  'conference',
  true,
  'ICCE 2006 (IEEE)',
  2006,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '92f4d03b-570d-4688-9ab3-74bf248bcf77',
  'dynamically-personalized-web-service-system-to-mobile-d-2006-1',
  'Dynamically Personalized Web Service System to Mobile Devices',
  ARRAY['강상길', '박원익', '김영국'],
  'conference',
  true,
  'FQAS 2006 (Springer)',
  2006,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fa640f7a-e014-4a41-8cb0-6225b746f803',
  'dynamical-e-commerce-system-for-shopping-mall-site-thro-2006-1',
  'Dynamical E-commerce System for Shopping Mall Site through Mobile Devices',
  ARRAY['강상길', '박원익', '김영국'],
  'conference',
  true,
  'DEECS 2006 (Springer)',
  2006,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '89d53696-39c0-4f34-87be-8071b0012123',
  'personalized-digital-e-library-service-using-users-prof-2006-1',
  'Personalized Digital E-library Service Using Users'' Profile Information',
  ARRAY['박원익', '김원일', '강상길', '이현진', '김영국'],
  'conference',
  true,
  'ECDL 2006 (Springer)',
  2006,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '536ee4d8-0599-4c2c-9255-6157d7f69e97',
  'using-active-database-techniques-for-an-advanced-alarm--2006',
  'Using Active Database Techniques for an Advanced Alarm Processing',
  ARRAY['장귀숙', '성덕현', '금종룡', '박희연', '김영국'],
  'conference',
  true,
  'NPIC&HMIT 2006 (ANS)',
  2006,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1637e3c9-7d75-4289-83e2-bde46d731f5e',
  'dynamically-personalized-music-recommendation-system-fo-2007',
  'Dynamically Personalized Music Recommendation System for PDA',
  ARRAY['박원익', '강상길', '최미선', '김영국'],
  'conference',
  true,
  'ICIC 2007 (Springer)',
  2007,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c213a764-5687-472b-a555-b0ae82d83864',
  'a-hybrid-cache-coherency-scheme-for-ubiquitous-mobile-c-2007',
  'A Hybrid Cache Coherency Scheme for Ubiquitous Mobile Clients',
  ARRAY['최미선', '박원익', '김영국'],
  'conference',
  true,
  'ICCIT 2007 (IEEE CS)',
  2007,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '48e4e25b-a306-4f4f-8ce2-55fa8c13c05b',
  'a-context-based-collaboration-system-in-ubiquitous-envi-2007',
  'A Context-Based Collaboration System in Ubiquitous Environments',
  ARRAY['박원익', '김영국', '외8인'],
  'conference',
  true,
  'ICCIT 2007 (IEEE CS)',
  2007,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '58e0a419-7e57-414a-bf70-5ec908f47b6f',
  'a-split-synchronizing-mobile-transaction-model-2008',
  'A Split Synchronizing Mobile Transaction Model',
  ARRAY['최미선', '박원익', '김영국'],
  'conference',
  true,
  'ICUIMC 2008',
  2008,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5a32fbf4-4de0-4997-825c-772c8ef03654',
  'selection-of-orthogonal-features-in-fisher-discriminant-2008',
  'Selection of Orthogonal Features in Fisher Discriminant Analysis',
  ARRAY['손조가', '최미선', '박정희', '김영국', '이우기'],
  'conference',
  true,
  'IADIS DATA MINING 2008',
  2008,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c9fb41df-d882-4581-b24e-f8cb89130895',
  'cohesive-arc-measure-for-web-navigation-2008',
  'Cohesive Arc Measure for Web Navigation',
  ARRAY['니디', '아로라', '김영국'],
  'conference',
  true,
  'IC3 2008 (IEEE)',
  2008,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5bbef5ff-8e0f-4aa2-b51b-1cf4265c8dc4',
  'personalized-recommender-system-for-resource-sharing-ba-2008',
  'Personalized Recommender System for Resource Sharing Based on Context-Aware in Ubiquitous Environments',
  ARRAY['박종현', '박원익', '김영국', '강지훈'],
  'conference',
  true,
  'ITSIM 2008 (IEEE CS)',
  2008,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'aa1a1b15-64f8-4231-bad4-efb84cb06091',
  'an-active-alarm-processing-in-a-nuclear-power-plant-2008',
  'An Active Alarm Processing in a Nuclear Power Plant',
  ARRAY['장귀숙', '금종룡', '박재연', '김영국'],
  'conference',
  true,
  'AMIGE 2008 (IEEE)',
  2008,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'de85c1d2-7af7-4759-ad5e-06984a9e1c85',
  'situation-based-resource-recommender-system-in-ubiquito-2008',
  'Situation-Based Resource Recommender System in Ubiquitous Environments',
  ARRAY['박종현', '박원익', '김영국', '강지훈', '이우기'],
  'conference',
  true,
  'ICPCA 2008 (IEEE CS)',
  2008,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c05257a8-b10d-44a5-9297-2a159268d0a2',
  'query-based-optimal-web-site-clustering-using-simulated-2008',
  'Query Based Optimal Web Site Clustering Using Simulated Annealing',
  ARRAY['김영국', '윤복식', 'Jiang', 'Jin', 'Xi'],
  'conference',
  true,
  'iiWAS 2008 (ACM)',
  2008,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '97dfb782-6825-4cc7-9315-73533c2ce104',
  'an-enhanced-recommendation-technique-for-personalized-e-2008',
  'An Enhanced Recommendation Technique for Personalized e-Commerce Portal',
  ARRAY['Shohel', 'Ahmed', '고평관', '김주완', '김영국', '강상길'],
  'conference',
  true,
  'IITA 2008 (IEEE CS)',
  2008,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd8aa1da0-9c7c-4d79-b58e-de1aaad4a9a8',
  'a-music-recommendation-system-in-mobile-environment-2009',
  'A Music Recommendation System in Mobile Environment',
  ARRAY['박원익', '강상길', '최미선', '김영국'],
  'conference',
  true,
  'ICCE 2009 (IEEE)',
  2009,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '16dfabf0-e2ab-4520-9fbf-4be01a873a0e',
  'two-phase-mobile-transaction-validation-in-wireless-bro-2009',
  'Two-phase Mobile Transaction Validation in Wireless Broadcast Environments',
  ARRAY['최미선', '박원익', '김영국'],
  'conference',
  true,
  'ICUIMC 2009 (ACM)',
  2009,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd5b63e6a-4815-40d0-b714-cb65f0f30da7',
  'anchorwoman-top-k-structured-mobile-web-search-engine-2009',
  'AnchorWoman: Top-k Structured Mobile Web Search Engine',
  ARRAY['이우기', '이정훈', '김영국', 'Carson', 'Leung'],
  'conference',
  true,
  'CIKM 2009 (ACM)',
  2009,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1da21e91-075e-43fe-9504-442e8e8f41c7',
  'a-study-on-rd-support-system-focused-on-research-result-2009',
  'A Study on R&D Support System Focused on Research Result',
  ARRAY['최기석', '전성진', '김영국'],
  'conference',
  true,
  'ICCC 2009 (KOCON)',
  2009,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5c3aaef7-32c9-4a36-9118-d1ff6371ae9e',
  'an-agent-based-personalized-multimedia-jukebox-for-mobi-2010',
  'An Agent-Based Personalized Multimedia Jukebox for Mobile Devices using Consumption Sentiment',
  ARRAY['박원익', '최미선', '김영국'],
  'conference',
  true,
  'ICCE 2010 (IEEE)',
  2010,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '36507a22-b14c-4cbc-948f-d39cd59b4336',
  'an-efficient-context-aware-personalization-technique-in-2010',
  'An Efficient Context-Aware Personalization Technique in Ubiquitous Environments',
  ARRAY['박원익', '박종현', '김영국', '강지훈'],
  'conference',
  true,
  'ICUIMC 2010 (ACM)',
  2010,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b5545a4a-a95a-49ef-8507-72329481b385',
  'the-design-and-implementation-of-standard-system-to-man-2010',
  'The Design and Implementation of Standard System to Managing, Gathering and Providing of National R&D Outcome Information',
  ARRAY['Won-K', 'yun Joo', 'Ki-Seo', 'k Choi', 'Jae-Soo Kim', 'Young- Kuk', 'Kim'],
  'conference',
  true,
  'Proceedings of ICKIMICS 2010',
  2010,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9c1815b2-d53b-48dd-b51a-a38a00a23eaa',
  'personalized-energy-portal-service-using-consumers-prof-2010',
  'Personalized Energy Portal Service Using Consumers'' Profile Information',
  ARRAY['김종우', '김주완', '강상길', '김학만', '김영국'],
  'conference',
  true,
  'The 1st International Conference on Security-enriched Urban Computing and Smart Grid (SUComS 2010) (SERSC Springer- Verlag)',
  2010,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9859967e-91a6-4ee0-923f-2f6c196c839e',
  'fragmenting-steiner-tree-browsers-based-on-ajax-2011',
  'Fragmenting Steiner Tree Browsers Based on Ajax',
  ARRAY['이우기', '송종수', 'Nidhi', 'Arora', '김영국'],
  'conference',
  true,
  'ICUIMC 2011 (ACM)',
  2011,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0b9dbd95-8d64-4257-acaf-3c639bcfb62d',
  'a-design-of-a-transmission-simulator-based-on-hierarchi-2011',
  'A Design of a Transmission Simulator based on Hierarchical Model',
  ARRAY['한상혁', '김영국'],
  'conference',
  true,
  'UCMA 2011 (Springer)',
  2011,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fa2b5fff-4382-41f3-8bf2-eccbee551d25',
  'an-architecture-of-real-time-historical-database-system-2011',
  'An Architecture of Real-time, Historical Database System for Industrial Process Control & Monitoring',
  ARRAY['한상혁', '김영국'],
  'conference',
  true,
  'CNSI 2011 (ACIS/ JNU)',
  2011,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '17f0cd69-d2cf-43f7-a689-e04f09a2b256',
  'development-of-a-transmission-simulator-based-on-hierar-2011',
  'Development of a Transmission Simulator based on Hierarchical Model',
  ARRAY['한상혁', '유민형', '임진혁', '김영국'],
  'conference',
  true,
  'IEEE EIT 2011',
  2011,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1e0ab4b0-df54-478e-a8e4-a4a6b008eff9',
  'personalized-mobile-e-commerce-system-using-disc-psycho-2011',
  'Personalized Mobile e-commerce System using DISC Psychological Model',
  ARRAY['박원익', '강상길', '김영국'],
  'conference',
  true,
  'RACS 2011 (ACM)',
  2011,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cab21da4-03e4-4976-9199-c6377ad0c7e6',
  'a-study-on-the-core-competency-of-engineering-students--2011',
  'A Study on the Core Competency of Engineering Students Based on the Recognition of Expert',
  ARRAY['이자희', '구진희', '김영국', '최완식'],
  'conference',
  true,
  'ICCC 2011 (KOCON (한국콘텐 츠학회))',
  2011,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '38900d66-0865-45a8-a0b5-f8bdcce84963',
  'the-development-of-integrated-engineering-tool-safecase-2012',
  'The Development of Integrated Engineering Tool (SafeCASE-PLC) for Safety Grade PLC',
  ARRAY['이영준', '이장수', '이동영', '김영국'],
  'conference',
  true,
  'NPIC & HMIT 2012 (American Nuclear Society (ANS))',
  2012,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '196099f3-0901-434b-a447-f726960dfaa4',
  'design-and-implementation-of-collaborative-partner-sear-2012',
  'Design and Implementation of Collaborative Partner Search Services based on Analyzing Expertise and Networks of Human Resources in National R & D Information',
  ARRAY['양명석', '최광남', '강남규', '김윤정', '김재수', '김영국'],
  'conference',
  true,
  'The 2nd Int. Conf. on Convergency Technology 2012 (ICCT 2012) (ISSN 2287-3252) (Korea Converge nce Society (KCS))',
  2012,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bfa7320a-e353-4af8-8213-0801c7cf1745',
  'a-study-of-advanced-promising-technology-database-devel-2012',
  'A Study of Advanced & Promising Technology Database Development and Use System',
  ARRAY['최기석', '김영국'],
  'conference',
  true,
  'The 2nd Int. Conf. on Convergency Technology 2012 (ICCT 2012) (ISSN 2287-3252) (Korea Converge nce Society (KCS))',
  2012,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3e498915-d2c3-42a9-9287-0d54aaf08cb2',
  'evaluation-of-multi-threaded-memory-allocation-operatio-2012',
  'Evaluation of Multi-threaded Memory Allocation Operation Performance on Multi-Core Environment',
  ARRAY['Dada', 'Huang;Ho', 'Young', 'Kim;Sung', 'Woo', 'Choi;Youn', 'g-Kuk', 'Kim;Sang', 'Hyuck', 'Han'],
  'conference',
  true,
  'The 4th Int. Conf. on Emerging Databases (EDB 2012) (KIISE Database Society of Korea)',
  2012,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bd2c9634-848d-4931-af10-f33725242779',
  'evaluating-performance-of-marte-as-a-real-time-framewor-2012',
  'Evaluating performance of MARTe as a real-time framework for feed-back control system at tokamak device (https://doi.org/10.1016/j.fusen gdes.2013.03.028)',
  ARRAY['윤상원', '이웅렬', '이태구', '박미경', '이상일'],
  'conference',
  true,
  '27th Symposium on Fusion Technology (SOFT 2012) (SCK・CE N TEC)',
  2012,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4850f33b-5c5c-4f9e-8837-ee470bc83577',
  'a-real-time-synchronous-v---c-system-with-the-extracted-2013',
  'A Real Time Synchronous V - C System with the Extracted Data from Buffering Function',
  ARRAY['김형세', '정찬석', '이문환', '성백열', '최성우', '최미선', '김영국'],
  'conference',
  true,
  'The 12th Int. Conf. on Networks (ICN 2013) (IARIA)',
  2013,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c5439646-2c32-4d6e-b13c-6b9a584ef841',
  'a-study-of-quality-control-methods-for-guaranteeing-rel-2013',
  'A Study of Quality Control Methods for Guaranteeing Reliability of Distributed Data Interoperability',
  ARRAY['Kiseok Choi', 'Young- Kuk', 'Kim'],
  'conference',
  true,
  'The 3nd Int. Conf. on Convergency Technology 2013 (ICCT 2013) (ISSN 2287-3252) (Korea Converge nce Society (KCS))',
  2013,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ece6e29e-fbff-4fcb-ac92-70630ceaba65',
  'design-of-national-rd-researchers-network-in-ntis-2013',
  'Design of National R&D Researchers Network in NTIS',
  ARRAY['양명석', '최광남', '강남규', '박민우', '정옥남', '김영국'],
  'conference',
  true,
  'The 3nd Int. Conf. on Convergency Technology 2013 (ICCT 2013) (ISSN 2287-3252) (Korea Converge nce Society (KCS))',
  2013,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '59b72007-252d-418a-984c-2479fba3b76d',
  'a-study-on-damage-assessment-data-matching-in-lvc-syste-2013',
  'A Study on Damage Assessment Data Matching in LVC Systems',
  ARRAY['Heenam Lee', 'Hyungse Kim', 'Jaemin Song', 'Hyungd', 'ae Lee', 'Youngk', 'uk Kim'],
  'conference',
  true,
  'The 5th Int. Conf. on Emerging Databases (EDB 2013) (KIISE Database Society of Korea)',
  2013,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'aebbb310-2a16-4cb3-a152-2a65f142fa74',
  'enforcing-web-business-model-and-patentability-consider-2013',
  'Enforcing Web Business Model and Patentability Consideration - International Workshop on Graph Databases and Social Networking 2013 (GSN 2013)',
  ARRAY['Wookey Lee', 'Mye M. Sohn', 'Young-K uk Kim'],
  'conference',
  true,
  'Third International Conference on Cloud and Green Computing (CGC), 2013 (KIT, IEEE TCSC)',
  2013,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f055b2b4-2a7f-4c61-bb81-53aedde97fbc',
  'jdi-based-hadoop-framework-monitoring-for-big-data-anal-2013',
  'JDI based Hadoop Framework Monitoring for Big Data Analysis of Sensor Networks',
  ARRAY['Byoung-J in Bae', 'Young-Jo 0 Kim', 'Young-K uk Kim', 'Ok-Kyoo n Ha', 'Yong-Ke e Jun'],
  'conference',
  true,
  '2nd International Conference on Convergence and its Application (ICCA 2013 2nd) (IACS (Internationa 1 Academic Consulting and Service))',
  2013,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e5c22b92-7398-4d0a-9d70-7839e5d4219a',
  'a-power-aware-scheduler-exploiting-all-slacks-under-edf-2013',
  'A Power-Aware Scheduler Exploiting All Slacks under EDF scheduling',
  ARRAY['Ye-In Seol', 'Jeong-Uk Kim', 'Young-K uk Kim'],
  'conference',
  true,
  'CSA 2013 (Advanced in Computer Science and its Applications, LNEE) (Springer Berlin Heidelberg)',
  2013,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '418ea492-e0ee-4303-9e66-1a3bd2d58a34',
  'a-gpu-accelerated-density-based-clustering-algorithm-2014',
  'A GPU-Accelerated Density-Based Clustering Algorithm',
  ARRAY['Woong-K ee Loh', 'Young-K uk Kim'],
  'conference',
  true,
  '2014 IEEE Fourth International Conference on Big Data and Cloud Computing (International Workshop on Graph Databases and Social Networking 2014; GSN 2014) (IEEE Computer Society)',
  2014,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b3343b39-bef0-48f2-a975-b16402f68e0b',
  'improving-similarity--measurement-of-user-ratin-scoreus-2015',
  'Improving Similarity- Measurement of User Ratin Score_using Sigmoid Function m Personalization System',
  ARRAY['Kim- Ryong', 'Young-K ukKim'],
  'conference',
  true,
  'The 5th- International- Conference on- Convergence- Technology 2015 (ICCT-2015) ISSN 2287 3252 (Korea- Converge nce- Society)',
  2015,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '96ba505c-263e-4d58-b091-9c29f9f254c7',
  'fault-detection-coverage-measurement-using-a-fault-imit-2015',
  'Fault detection coverage measurement using a fault imitation method for nuclear digital controller',
  ARRAY['Young-Ju n Lee', 'Jang-Soo Lee', 'Young-K uk Kim'],
  'conference',
  true,
  'Int''l Conf. Software Eng. Research and Practice (SERP''15)',
  2015,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '92da6a55-0d6e-4bad-96d0-b03d1b039b76',
  'improving-similarity-measurement-of-users-rating-value--2016',
  'Improving Similarity Measurement of User''s Rating Value using Sigmoid Function in Personalization System',
  ARRAY['Kim Ryong', 'Park Kyung-H ye', 'Young-K uk Kim'],
  'conference',
  true,
  'The 10th International Conference on Ubiquitous Information Management and Communication 2016 (IMCOM 2016) ISBN 978-1-4503-4142-4 (Association for Computing Machinery (ACM))',
  2016,
  1,
  '10.1145/2',
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c4a4ddb8-0d4d-4d51-a8f6-139df2cf0c11',
  'interoperation-system-between-hlarti-federation-and-dbm-2016',
  'Interoperation System between HLA/RTI Federation and DBMS through HLA/RTI Simulating Virtual Test',
  ARRAY['Yena Lee', 'Jin-Hyeo k Son', 'Mi-Seon Choi', 'Young-ku k Kim'],
  'conference',
  true,
  'Third International Conference on Big Data and Smart Computing (BigComp 2016) (KIISE, IEEE Computer Society)',
  2016,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '6214b59d-5dae-48fd-871e-0cb57146c203',
  'a-specific-method-for-software-reliability-of-digital-c-2016',
  'A Specific Method for Software Reliability of Digital Controller in NPP',
  ARRAY['이영준', '금종용', '이장수', '김영국'],
  'conference',
  true,
  'The Second Int. Conf. on Fundamentals and Advances in Software Systems Integration (FASSI2016) (IARIA)',
  2016,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '73d4cc5c-b7a8-412a-b8b4-6f5df76e13b2',
  'delta-raid-to-enhance-recovery-and-small-write-performa-2016',
  'Delta RAID to Enhance Recovery and Small-Write Performance of RAID Storage Systems',
  ARRAY['Mehdi Pirahande h', 'Young-K uk Kim', 'Deok-Hw an Kim'],
  'conference',
  true,
  'The 5th Graph DataBase Workshop (GDB 2016) (IEEE)',
  2016,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e3f3801f-c23a-43e8-a2da-5fe183f76300',
  'improving-real-time-interoperation-of-national-defense--2016',
  'Improving real-time interoperation of national defense M&S system using distributed DBMS',
  ARRAY['이예나', '손진혁', '최미선', '김영국'],
  'conference',
  true,
  'Proceedings of the Sixth Int. Conf. on Emerging Databases: Technologies, Applications, and Theory (EDB2016) (IEEE)',
  2016,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b99e36e8-55c3-480e-889d-04f74ab7f867',
  'robust-fault-analysis-using-sensors-in-semiconductor-ma-2018',
  'Robust Fault Analysis using Sensors in Semiconductor Manufacturing Processes',
  ARRAY['Woong-K ee Loh', 'Young-K uk Kim'],
  'conference',
  true,
  '2018 IEEE Conf. on Smart Data (GDB2018)',
  2018,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c6398d8a-bb9e-43c2-9467-4ce0a660ef29',
  'salt-viz-real-time-visualization-for-large-scale-traffi-2019',
  'SALT-Viz: Real-Time Visualization for Large-Scale Traffic Simulation',
  ARRAY['Sung-S', '00', 'Kim', 'Okgee', 'Min', 'Young-', 'Kuk', 'Kim'],
  'conference',
  true,
  '2019 IEEE Transportation Electrification Conference and EXPO Asia-Pacific(ITE C-AP2019)',
  2019,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '601aafe0-44b6-4d87-9007-2aeae5205398',
  'improved-spatial-modeling-using-path-distance-metric-fo-2019',
  'Improved Spatial Modeling using Path Distance Metric for Urban Traffic Prediction',
  ARRAY['Sung-S', '00', 'Kim', 'Okgee', 'Min', 'Young-', 'Kuk', 'Kim'],
  'conference',
  true,
  '7th International Conference on Big Data Applications and Services (BIGDAS2019) (Korea Big Data Services Society)',
  2019,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e9ae0997-583d-40eb-a853-34d510247bd9',
  'hsv-color-space-based-robot-grasping-for-personalized-m-2019',
  'HSV Color Space Based Robot Grasping for Personalized Manufacturing Services',
  ARRAY['Hyunchul Kang', 'Hyonyoung Han', 'Heechul Bae', 'Eunseo Lee', 'Mingi Kim Jiyeon Son', 'Hyun Kimi Young-Kuk Kim'],
  'conference',
  true,
  'The 10th Int. Conf. on ICT Convergence (ICTC 2019) (Korean Institute of Communica tions and Information Sciences (KICS))',
  2019,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '00a9ab69-ac00-47e7-acbe-ea555406b57c',
  'estimation-of-mobile-frequency-saturation-traffic-volum-2019',
  'Estimation of Mobile Frequency Saturation: Traffic Volume and Frequency Resource Utilization Perspective',
  ARRAY['Taeho Kim', 'Seung Keun Park', 'Hyeyeon Kwon; Young-Ku k Kim'],
  'conference',
  true,
  '10th Int. The Conf. on ICT Convergence (ICTC 2019) (Korean Institute of Communica tions and Information Sciences (KICS))',
  2019,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '32e9ad53-4be6-49e9-bd55-a92b2494e289',
  'context-aware-collaborative-filtering-for-data-sparsity-2020',
  'Context-Aware Collaborative Filtering for Data Sparsity Problem using Jaccard Similarity',
  ARRAY['Soo-Yeon Jeong', 'Jin-Hyeo k Son', 'Young-K uk Kim'],
  'conference',
  true,
  'The 6th International Conference for Small & Medium Business in 2020 (ICSMB2020) (Convergen ce Society for Small & Medium Business)',
  2020,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '29d5f452-d6e9-478d-b52f-41f9bc421029',
  'urban-traffic-prediction-using-congestion-diffusion-mod-2020',
  'Urban Traffic Prediction using Congestion Diffusion Model',
  ARRAY['Sung-Soo Kim', 'Moonyou ng Chung. Young-K uk Kim'],
  'conference',
  true,
  'The Fifth International Conference On Consumer Electronics (ICCE) Asia (IEEE-IEIE)',
  2020,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '17cf16a1-0269-471d-955d-a3093cc9baf3',
  'sparsity-aware-reachability-computation-for-massive-gra-2022',
  'Sparsity-Aware Reachability Computation for Massive Graphs',
  ARRAY['Sung-So 0 Kim', 'Young-M in Kang and Young-K uk Kim'],
  'conference',
  true,
  'IEEE BigComp 2022 (IEEE CS)',
  2022,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '91c4ed74-8177-4f64-939d-6bf464911ee5',
  'development-of-a-voice-audio-replacement-for-video-cont-2022',
  'Development of a voice audio replacement for video content using Tacotron2',
  ARRAY['Youngho Kim', 'Dami Cho', 'Taeseong Song', 'Sunghyun Kim and Young-Ku k Kim'],
  'conference',
  true,
  'IEEE BigComp 2022 (VOICE AI 2022) (IEEE CS)',
  2022,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'aeb0699a-0f11-49f9-b8c4-09d70b069622',
  'automatic-classification-of-scientific-and-technical-do-2023',
  'Automatic Classification of Scientific and Technical Documents Using Deep Learning Model',
  ARRAY['Eunjin Lee', 'Hanmin Jung', 'Seungkyo Jin', 'Jungsun Yoon', 'Young-K uk Kim'],
  'conference',
  true,
  '15th International Conference on Knowledge and Smart Technology (KST-2023) (IEEE CS)',
  2023,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '58fcc4a1-0d4a-4c9d-b105-d56f69786789',
  'optimizing-protac-design-a-novel-approach-using-exposur-2025',
  'Optimizing PROTAC Design: A Novel Approach Using Exposure Scores for Linker Site Selection',
  ARRAY['Yeonju Jeong', 'Jae-Mun Choi', 'Young-K uk Kim'],
  'conference',
  true,
  'IEEE BigComp 2025 (IEEE CS)',
  2025,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);

-- ═══ DOM_JOURNAL (45건) ═══

INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0f52029c-f276-4f87-8179-5fe57344e571',
  'e821e0a9-1998',
  '실시간 데이터베이스 시스템',
  ARRAY['김영국'],
  'journal',
  false,
  '한국정보처 리학회지 (한국정보 처리학회)',
  1998,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1f843949-1103-4b98-b22f-b3cd3abb602e',
  '594fed47-1999',
  '인터넷 상점에서의 실시간 개인화된 광고 제공 기법',
  ARRAY['김영국', '외 3인'],
  'journal',
  false,
  '경영정보학 연구 (한국경영 정보학회)',
  1999,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd2245046-48e3-43a5-b547-12b91f9914fa',
  '657d5043-2000',
  '복수의 인터넷 쇼핑몰에서 통용되는 안정한 전자상거래 지불수단으로서 로열티 시스템',
  ARRAY['김영국', '외 3인'],
  'journal',
  false,
  '한국정보 처리학회 논문지',
  2000,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5bc12b6c-f81f-4b95-b5ad-d546403ff91e',
  '25376141-2000',
  '전자상거래 로열티 서비스를 위한 시스템 제공자 설계 및 구현',
  ARRAY['김영국', '외 5인'],
  'journal',
  false,
  '한국정보과 학회논문지 : 컴퓨팅의 실제 (한국정보 과학회)',
  2000,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '89b2c5fc-c99e-4bca-91b5-311a4ae277bf',
  '08dbc340-2001',
  '이동 데이터베이스 개요 및 연구현황',
  ARRAY['김영국', '외 1인'],
  'journal',
  false,
  '한국정보과 학회 데이터베이 스연구 (한국정보 과학회)',
  2001,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e876dc47-846f-4498-a774-88953fb5ce4f',
  'corba-dbms-2001',
  'CORBA기반의 미들웨어를 이용한 DBMS 통합 시스템의 설계 및 구현',
  ARRAY['김영국', '외 1인'],
  'journal',
  false,
  '충남과학 연구지 (충남대학 교 기초과학 연구소)',
  2001,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '443743a3-52f4-46d7-a865-48c7ebf91d0c',
  'ce982b5d-2002',
  '분산 이기종 인터넷 쇼핑몰 환경에서의 벡터모델 기반 개인화서비스 시스템',
  ARRAY['김영국', '외 2인'],
  'journal',
  false,
  '한국정보과 학회논문지 : 컴퓨팅의 실제 (한국정보 과학회)',
  2002,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b9bbb1f8-fc67-4782-b1e0-46cf135bbe27',
  'cfd46794-2003',
  '보안측면에서의 네트워크 이상징후 분석 기술',
  ARRAY['김영국', '외 1인'],
  'journal',
  false,
  '한국통신 학회지',
  2003,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1b917b82-b53f-45c2-997b-86d58e7bc343',
  'a4799ed7-2004',
  '이동 컴퓨팅 환경에서 데이터 방송을 위한 동시성 제어기법',
  ARRAY['윤혜숙', '김영국'],
  'journal',
  false,
  '한국정보과 학회논문지 :데이타베 이스 (한국정보 과학회)',
  2004,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0ef82d55-7556-4e98-bef9-88e2961e07a2',
  '18abe5c0-2004',
  '편재형 컴퓨팅 환경에서의 e-비즈니스 응용을 위한 분할 동기화 이동 트랜잭션 처리 모델',
  ARRAY['최미선', '김영국'],
  'journal',
  false,
  '한국정보처 리학회 논문지D (한국정보 처리학회)',
  2004,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a6a4b4f2-d2e8-404f-a091-7ffecb5355a1',
  '00c11820-2005',
  '추천시스템의 성능 향상을 위한 시간스키마 적용 2단계 클러스터링 기법',
  ARRAY['김영국', '외 4인'],
  'journal',
  false,
  '한국전자거 래학회지 (한국전자 거래학회)',
  2005,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '43118c7b-f808-4942-9bb5-4b9916a158c9',
  '9988ef79-2005',
  '이동 컴퓨팅 환경에서 데이터 특성을 고려한 실시간 혼성 방송 알고리즘',
  ARRAY['윤혜숙', '김영국'],
  'journal',
  false,
  '한국정보과 학회논문지 : 정보통신 (한국정보 과학회)',
  2005,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c1dfe33c-b82d-41c5-8253-16044dc2380b',
  '78562cbd-2006',
  '선호도 전이 확률을 이용한 멀티미디어 컨텐츠 추천 시스템',
  ARRAY['박성준', '강상길', '김영국'],
  'journal',
  false,
  '한국 퍼지 및 지능시스템학 회 논문지 (한국 퍼지 및 지능시스템 학회)',
  2006,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '22de99fa-52b2-4660-9753-7949a6bd16cd',
  '068e3cd1-2006',
  '제어봉구동장치제어계통 원전 시험설비의 임베디드 제어 프로그래밍 실제',
  ARRAY['장귀숙', '금종룡', '박희윤', '김영국'],
  'journal',
  false,
  '한국정보과 학회 프로그래밍 언어논문지 (한국정보 과학회)',
  2006,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '43ae5b85-60e9-4e08-9ef1-b66192ef0ed4',
  'fc4d2133-2006',
  '개인화된 방송 컨텐츠 추천을 위한 가중치 적용 Markov 모델',
  ARRAY['박성준', '홍종규', '강상길', '김영국'],
  'journal',
  false,
  '한국정보과 학회논문지 : 컴퓨팅의 실제 (한국정보 과학회)',
  2006,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4e5fc4cd-5376-470d-91b6-487b88ad38e4',
  '98b75b4c-2006',
  '정규화변환을 지원하는 스트리밍 시계열 매칭알고리즘',
  ARRAY['노웅기', '문양세', '김영국'],
  'journal',
  false,
  '한국정보과 학회논문지 :데이터베 이스 (한국정보 과학회)',
  2006,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f83b2b6f-0cab-4a8f-ba4e-6249d6014c4c',
  'a74462a0-2008',
  '유비쿼터스 환경에서의 상황인지 기반 디바이스 협업 시스템',
  ARRAY['박원익', '박종현', '김영국', '강지훈'],
  'journal',
  false,
  '전자공학회 논문지 (대한전자 공학회)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2004febd-3810-4c11-8de5-3b40470f8940',
  'ab980ba1-2008',
  '신경망을 이용한 결측 수문자료 추정 및 실시간 자료 보정',
  ARRAY['오재우', '박진혁', '김영국'],
  'journal',
  false,
  '한국수자원 학회논문집 (한국수자 원학회)',
  2008,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b05d71c5-68f9-4bbe-9b8c-cb862299a0df',
  'e-commerce-2008',
  'E-Commerce 포탈에서 향상된 개인화 추천 기법',
  ARRAY['고평관', 'Shohel', 'Ahmed', '김영국', '강상길'],
  'journal',
  false,
  '한국정보과 학회논문지 : 컴퓨팅의 실제 및 레터 (한국정보 과학회)',
  2008,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd60312c8-4910-47f1-bcd4-f3f7b8acbb2d',
  '2363fc32-2009',
  '유비쿼터스 환경에서 상황인지 기반 사용자 맞춤형 장치 추천 시스템',
  ARRAY['박종현', '박원익', '김영국', '강지훈'],
  'journal',
  false,
  '전자공학회 논문지 (대한전자 공학회)',
  2009,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '05e55b59-11f4-4ec7-a938-a460d4c4bb63',
  'fe43df04-2009',
  '국가R&D 종합모니터링시스템 구축에 관한 연구',
  ARRAY['최기석', '박만희', '김영국'],
  'journal',
  false,
  '산업경영시 스템학회지 (산업경영 시스템학 회)',
  2009,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4b1d9e3d-b7f3-4260-a4d7-eb6509c95aa4',
  '793475a2-2010',
  '사용자의 심리와 상황을 고려한 맞춤형 모바일 멀티미디어 콘텐츠 추천 기법',
  ARRAY['박원익', '심우제', '김영국'],
  'journal',
  false,
  '정보과학회 논문지: 컴퓨팅의 실제 및 레터 (한국정보 과학회)',
  2010,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c3b7f149-4998-409f-8303-26ac1319aeef',
  '13f67708-2010',
  '지역 질의 생성기반 전역 XQuery 질의 처리 기법',
  ARRAY['박종현', '박원익', '김영국', '강지훈'],
  'journal',
  false,
  '한국컴퓨터 정보학회 논문지 (한국컴퓨 터정보학 회)',
  2010,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '829f613c-fe94-4804-919e-f53371f0c31b',
  '484a13d5-2010',
  '의사결정나무를 이용한 근접전투전문가시스템',
  ARRAY['김형세', '문호석', '이동근', '황명상', '김영국'],
  'journal',
  false,
  '한국국방경 영분석학회 논문지 (한국국방 경영분석 학회)',
  2010,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a820cfe4-4726-42cd-a6e5-03ed392a29ad',
  'a-dynamic-management-technique-for-weighted-testcases-i-2010',
  '가중치를 이용한 소프트웨어 테스트케이스 동적 관리 기법 (A Dynamic Management Technique for Weighted Testcases in Software Testing )',
  ARRAY['한상혁', '정정수', '진성일', '김영국'],
  'journal',
  false,
  '정보처리학 회논문지D (정보처리 학회)',
  2010,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5f2a62d8-ff02-4058-976b-11233e041ff8',
  'fc12a7ab-2011',
  'USN 기반의 화재감시 응용을 위한 센서 데이터 처리 시스템',
  ARRAY['박원익', '김영국'],
  'journal',
  false,
  '컴퓨터정보 학회논문지 (컴퓨터정 보학회)',
  2011,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5d57cb69-66a2-4b5f-ba28-b79b938a7980',
  '0ff34bda-2011',
  '대용량 데이터 고속처리용 분산 메인 메모리 데이터베이스 관리 시스템 구조',
  ARRAY['한상혁', '김영국', '진성일'],
  'journal',
  false,
  '정보과학회 논문지: 데이터베이 스 (한국정보 과학회)',
  2011,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'dd894a9c-cc68-4ae8-b321-29270e028ee3',
  '3-cad-x3d-2011',
  '3차원 CAD 데이터의 제품구조를 포함하는 X3D 기반 데이터로의 변환 기법',
  ARRAY['조귀목', '김영국'],
  'journal',
  false,
  '정보처리학 회논문지A (정보처리 학회)',
  2011,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e6933d69-0083-47f7-9852-55c43e427dda',
  'b2beeb48-2011',
  '분석분야에 훈련모델 활용방안연구: 창조21과 JICM의 방공분야 모의논리 비교를 중심으로',
  ARRAY['김형세', '문호석', '최연호', '이동근', '김영국'],
  'journal',
  false,
  '한국국방경 영분석학회 논문지 (한국국방 경영분석 학회)',
  2011,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5cdf4ef4-f406-4301-9d97-abe01ffa1b62',
  'uav-v-cvirtural-constructive-2011',
  'UAV영상 연동체계 구축개념 연구 : V-C(Virtural Constructive)체계 구축을 중심으로',
  ARRAY['김형세', '김종필', '이동근', '김영국'],
  'journal',
  false,
  '한국국방경 영분석학회 논문지 (한국국방 경영분석 학회)',
  2011,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '62fda3ea-7e53-490c-bf92-1e32178f2375',
  '04c67a23-2012',
  '소비자 심리유형 정보를 이용한 가중치 기반 추천기법',
  ARRAY['박원익', '김영국'],
  'journal',
  false,
  '정보과학회 논문지: 데이터베이스 (ISSN: 1229-7739) (한국정보 과학회)',
  2012,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ca0acb20-ab85-47b9-b02f-486179a53410',
  '4a8ea186-2012',
  '실시간 상황인지 응용에서 다차원 분석 질의 성능 개선을 위한 적응적 데이터 큐브의 구축 방안',
  ARRAY['김호영', '유민형', '라정휘', '박원익', '김영국'],
  'journal',
  false,
  '데이터베이 스연구 (ISSN: 1598-9798) (한국정보 과학회)',
  2012,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2dbb60ec-5bc5-4ab6-9d23-d144453f0a5b',
  'd3bce7e6-2012',
  '온톨로지 기반의 주제-객체관계를 이용한 국가 R&D 지식맵 구축',
  ARRAY['양명석', '강남규', '김윤정', '최광남', '김영국'],
  'journal',
  false,
  '정보관리학 회지 (ISSN 1013-0799) (한국정보 관리학회)',
  2012,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4875e31e-9db0-4376-9c51-820ab20f2eec',
  'ms-simcoredb-2014',
  '국방 M&S 가상시험 연동 환경을 위한 SimCoreDB 설계 및 적합성 평가',
  ARRAY['최미선', '최성우', '이예나', '김영국'],
  'journal',
  false,
  '정보과학회 논문지: 데이터베이스 (ISSN: 1229-7739) (한국정보 과학회)',
  2014,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b96b2aa6-deec-4b13-a3c9-11b2ca88ea9f',
  'f68563f8-2015',
  '그룹추천시스템에서 아이템 평가 빈도수와 속성값을 이용하는 TF-IDF 기반 그룹 집계 전략',
  ARRAY['안두철', '김영국'],
  'journal',
  false,
  '데이터베이 스연구 (ISSN: 1598-9798) (한국정보 과학회)',
  2015,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'adfdb3de-b07c-4148-b373-479ca9d8478a',
  '8a9d2ce4-2016',
  '모바일 단말을 위한 슬라이딩 윈도우 모델 기반의 상황인지 개인화된 사용자 인터페이스 생성 기법',
  ARRAY['윤서현', '김영국'],
  'journal',
  false,
  '데이터 베이 스 (ISS : 1598-9798) (한국정보 과학회)',
  2016,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4435261c-b305-4067-bec8-6df7bb2e3bcf',
  'f69c8b86-2016',
  '가중치 기반 고장감지 커버리지 방법을 이용한 원전 제어기기 소프트웨어 신뢰도 평가',
  ARRAY['이영준', '이장수', '김영국'],
  'journal',
  false,
  '한국정보처 리학회논문 지/컴퓨터 및 통신시스템 (한국정보 처리학회)',
  2016,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8ff634ae-7111-4f66-b730-19aa6961b1a4',
  '75f242f2-2017',
  '상황정보 가중치를 이용한 스마트 자동판매기 개인화 추천시스템',
  ARRAY['정수연', '김룡', '김영국'],
  'journal',
  false,
  '데이터베이 스연구 (ISSN: 1598-9798) (한국정보 과학회)',
  2017,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'aaff597f-a6cc-41f2-9f79-b94066c96306',
  '55bcff4b-2019',
  '사물인터넷 환경에서 데이터 희박성을 고려한 유사도 측정 방법',
  ARRAY['정수연', '손진혁', '김영국'],
  'journal',
  false,
  '데이터베이 스연구 (ISSN: 1598-9798) (한국정보 과학회)',
  2019,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '93afaf1e-8446-469e-857d-a5266da3cab6',
  'doi-httpsdoiorg1012791ksbec2021301085-2021',
  '수경재배 양액 내 탄산정 처리에 의한 상추의 생육 및 생리활성물질 함량 변화 (DOI https://doi.org/10.12791/KSBEC.2021.30.1.085)',
  ARRAY['복권정', '노승원', '김영국', '남창수', '진채린', '박종석'],
  'journal',
  false,
  '생물환경조 절학회지 (pISSN 1229-4675) (생물환경 조절학회)',
  2021,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5b0be804-a92a-4dfd-99b4-fafa141fb1eb',
  '455442e2-2023',
  '저학년 아동 학습지 자동 채점을 위한 딥러닝 기반 한글 손글씨 인식 모델',
  ARRAY['김문현', '김영호', '김영국'],
  'journal',
  false,
  '데이터베이 스연구 (ISSN: 1598-9798) (한국정보 과학회)',
  2023,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '08885d92-204a-49d5-b2fd-09f082537c20',
  '05c47b47-2024',
  '효율적인 HWP 악성코드 탐지를 위한 데이터 유용성 검증 및 확보 기반 준지도학습 기법',
  ARRAY['손진혁', '외 3명'],
  'journal',
  false,
  '한국정보보 호학회 논문지 (한국정보 보호학회)',
  2024,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '88a5e6bf-0f72-4598-a0f0-8460441fa9cd',
  '183cd896-2024',
  '생성형 AI 이미지 증강을 통한 참외 병해충 데이터 불균형 개선 및 분류 성능 향상',
  ARRAY['박진수', '외 4명'],
  'journal',
  false,
  '한국멀티미 이어학회 논문지 (한국멀티 미이어학 회)',
  2024,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c9682657-4522-470f-879f-7b6ff7e3ba42',
  'faster-r-cnn-2025',
  'Faster R-CNN 기반 생활폐기물 존재 여부 이진 분류 시스템',
  ARRAY['정연주', '외 3명'],
  'journal',
  false,
  '정보과학회 컴퓨팅의 실제 논문지 (한국정보 과학회)',
  2025,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '179d7743-31b4-4488-bb1f-06fafde4be05',
  '537c592c-2025',
  '설명가능한 인공지능과 BERT 모델을 활용한 신뢰성 높은 유해 웹사이트 분류 및 한글 특화 해석 기법',
  ARRAY['손진혁', '외 4명'],
  'journal',
  false,
  '정보과학회 컴퓨팅의 실제 논문지 (한국정보 과학회)',
  2025,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);

-- ═══ DOM_CONFERENCE (168건) ═══

INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c690f994-2678-40b9-9ca9-cb0cf725d9dd',
  '9afdfca0-1996',
  '차세대지능망에서의 디렉토리 및 실시간데이타베이스 기술 적용에 관한 연구',
  ARRAY['김영국', '외 2인'],
  'conference',
  false,
  'AIN''96 (한국통신 학회)',
  1996,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1f0449e7-264e-48a3-9f7f-aeefe266ad7c',
  '8593c204-1998',
  '비감독하의 학습을 이용한 전자상거래 시스템에서의 개인화된 광고 제공',
  ARRAY['김영국', '외 5인'],
  'conference',
  false,
  '대한산업공학회/ 한국경영과학회 ''98춘계공동학술 대회 (대한산업 공학회/한 국 경영과학 회)',
  1998,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '064de1a3-42c0-41fb-a5a7-ec92358d3404',
  '8586129c-1998',
  'TMN 시험시스템 구조',
  ARRAY['김영국', '외 2인'],
  'conference',
  false,
  'COMSW''98 (한국통신 학회)',
  1998,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bd65205c-c751-4f46-8c19-cd8288d6fb6c',
  '047e416f-1998',
  '개인화된 전자상거래 서비스를 위한 에이젼트와 데이터베이스 설계 기술',
  ARRAY['김영국', '외 4인'],
  'conference',
  false,
  '한국정보과학회 ''98추계학술대회 (한국정보 과학회)',
  1998,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '03852572-5a4e-412b-97b2-3665c84339c5',
  '6ad2f00c-1998',
  '가상 상점을 위한 마케팅 의사결정 지원시스템',
  ARRAY['김영국', '외 5인'],
  'conference',
  false,
  '한국전자거래학회 학술대회 (한국전자 거래학회)',
  1998,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e598cda7-cf3c-4077-88a7-54b991f765ad',
  '4712e22d-1999',
  '웹과 데이터베이스 연동기법 분석',
  ARRAY['김영국', '외 3인'],
  'conference',
  false,
  '한국정보처리학회 ''99춘계학술대회 (한국정보 처리학회)',
  1999,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '89870d81-71c3-4a88-b235-1fb79273248a',
  '2ec121b0-1999',
  '주기억장치 상주형 데이터베이스 시스템에서 트랜잭션의 순차수행과 2PL기반 동시성제어의 성능비교',
  ARRAY['김영국', '외 4인'],
  'conference',
  false,
  '한국정보처리학회 ''99춘계학술대회 (한국정보 처리학회)',
  1999,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '6c0a52ff-0eba-4b2e-8a6c-253a20d2e15a',
  'f7c00cab-1999',
  '주기억장치 상주형 데이터베이스 시스템을 이용한 대용량 서지정보 검색시스템의 설계 및 구현',
  ARRAY['김영국', '외 5인'],
  'conference',
  false,
  '한국정보처리학회 ''99춘계학술대회 (한국정보 처리학회)',
  1999,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'def10b1c-cdbe-4c35-9d46-a30afb777b18',
  'a7339896-1999',
  '상호운용성 시험 스위트 도출',
  ARRAY['김영국', '외 3인'],
  'conference',
  false,
  '제4회 통신소프트웨어 학술대회 (한국통신 학회)',
  1999,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '51ef45a7-91e9-4063-adb7-f1d0e60143aa',
  '4ee62842-1999',
  '개인화된 광고서비스를 위한 에이전트 시스템 설계',
  ARRAY['김영국', '외 4인'],
  'conference',
  false,
  '한국정보과학회 ''99추계학술대회 (한국정보 과학회)',
  1999,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '541b319b-cb80-4c7c-a0c5-9d7e8b93487e',
  'f9590530-2000',
  '인터넷 쇼핑몰 허브싸이트를 위한 개인화된 맞춤서비스 제공 시스템',
  ARRAY['박성준', '김주연', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''00추계학술대회 (한국정보 과학회)',
  2000,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd2cb1f67-cc25-4230-9cd7-9e03b3f67fb2',
  'dbms-api-2001',
  '주메모리 DBMS를 위한 다계층 자바 API 설계 및 구현',
  ARRAY['이도영', '김영국', '외 1인'],
  'conference',
  false,
  '한국정보과학회 ''01춘계학술대회 (한국정보 과학회)',
  2001,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '6c38d4ca-775e-4b59-88b1-4dcc12e74d26',
  '62059cb3-1999',
  '인터넷 쇼핑몰에서 다중 에이전트기반의 서비스 시스템 설계에 대한 연구',
  ARRAY['김영국', '외 4인'],
  'conference',
  false,
  '한국정보처리학회 ''99추계학술대회 (한국정보 처리학회)',
  1999,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a19468cd-5609-4fc6-b8ec-acb1a2c69c84',
  'e551e71f-2001',
  '분산 이기종 환경에서 XML기반 메타데이터를 이용하는 통합 정보 검색 시스템',
  ARRAY['박성준', '강지훈', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''01추계학술대회 (한국정보 과학회)',
  2001,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '182a2f1d-8424-4ef2-8b44-e6b95c6983eb',
  'e0d06edd-2001',
  'ebXML 비즈니스 프로세스 에디터 설계 및 구현',
  ARRAY['김주연', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''01추계학술대회 (한국정보 과학회)',
  2001,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2ebd9068-8636-4e42-8b42-e1049234a921',
  '0cab3936-2001',
  '무선 인터넷 환경에서의 내장형 DBMS를 위한 자료 동기화 기술',
  ARRAY['김영국', '외 5인'],
  'conference',
  false,
  '제1회 정보가전과 실시간 시스템 응용 워크샵 (한국정보 처리학회)',
  2001,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'edd2478c-ab43-473a-ac83-8e314b512626',
  'cc8e08f8-2001',
  '이동 컴퓨팅 환경에서 분산 이질 정보 통합을 위한 이동 트랜잭션 모델',
  ARRAY['최정인', '김영국', '외 3명'],
  'conference',
  false,
  '한국정보처리학회 ''01추계학술대회 (한국정보 처리학회)',
  2001,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '53b72a55-0bf4-43ad-a312-f6e63801ba95',
  '7934beb1-2001',
  'ebXML 비즈니스 프로세스 문서 작성에서의 사전검증과 사용자 편의 제공 기법',
  ARRAY['김영국', '외 1인'],
  'conference',
  false,
  '한국정보과학회 충청지부 학술발표 (한국정보 과학회)',
  2001,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a15c538c-a5e3-4ef3-bee7-3b6e19f329b7',
  '09c7afb4-2001',
  '객체지향 멀티미디어 DBMS를 위한 비용 기반 질의 최적화 설계',
  ARRAY['김영국', '외 2인'],
  'conference',
  false,
  '한국정보과학회 충청지부 학술발표 (한국정보 과학회)',
  2001,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '573ab364-7619-4240-a849-82e8612127e0',
  'e7551a22-2002',
  '무선랜을 이용한 HAVi 네트워크의 원격 제어 시스템 설계 및 구현',
  ARRAY['이보익', '김영국', '외 2인'],
  'conference',
  false,
  '한국정보처리학회 ''02춘계학술대회 (한국정보 처리학회)',
  2002,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'dd4a17df-306c-436b-9cec-61903a5d7bbd',
  '233a7d24-2002',
  '로그 기반 백업 및 안정기억장치를 이용한 주기억장치 DBMS에서의 회복기법',
  ARRAY['최미선', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''02춘계학술대회 (한국정보 과학회)',
  2002,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '62450d48-0480-48ad-9ebd-fdfe4293728b',
  'e41fd057-2002',
  '항공기용 디지털 지도 데이터 베이스와 디스플레이 소프트웨어 구현',
  ARRAY['김영국', '외 6인'],
  'conference',
  false,
  '제8회 항공기 개발 기술 심포지엄 (한국군사 과학기술 학회)',
  2002,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1ceaec41-f6d3-4242-b3c2-9b9207a60a1b',
  'm-commerce-2002',
  'M-Commerce 모바일 인터넷 환경에서 개인화 맞춤서비스 제공 기법',
  ARRAY['박성준', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''02추계학술대회 (한국정보 과학회)',
  2002,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '629d1178-94a5-4200-b756-e6f9b5a7556f',
  'feea4066-2002',
  '이동 세일즈 응용을 위한 이동 트랜잭션 모델',
  ARRAY['김영국', '외 1인'],
  'conference',
  false,
  '한국정보과학회 ''02추계학술대회 (한국정보 과학회)',
  2002,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'de34fd49-db9f-4bde-99b5-8da91784b908',
  'd793ea78-2002',
  'B2B 환경에서 XML 기반 상호 운용성 향상 제공 기법',
  ARRAY['박성준', '김영국', '외 1인'],
  'conference',
  false,
  '한국정보과학회 ''02추계학술대회 (한국정보 과학회)',
  2002,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '843dff72-d526-4e45-b8fc-ace987424f48',
  '2c94c59b-2002',
  '루프 바이트코드의 정의를 통한 성능 개선',
  ARRAY['이지현', '김영국', '외 2인'],
  'conference',
  false,
  '한국정보처리학회 ''02추계학술대회 (한국정보 처리학회)',
  2002,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e5e75f9a-072d-422f-8c15-03170a76482a',
  'a30d2999-2002',
  '주기억장치 상주형 DBMS에서 범용 트랜잭션 처리를 위한 효율적인 다중단위 잠금기법 설계',
  ARRAY['김영국', '외 3인'],
  'conference',
  false,
  '한국정보과학회 충청지부 학술발표 (한국정보 과학회)',
  2002,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5a9b7fa3-2a80-47ce-9d33-770b4ea12905',
  '6e07710a-2003',
  '공용 UDDI 비즈니스 레지스트리의 현황에 대한 분석',
  ARRAY['김정희', '김영국', '외 1인'],
  'conference',
  false,
  '한국정보과학회 ''03춘계학술대회 (한국정보 과학회)',
  2003,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '66149747-a8de-4bbc-b3d4-8c4fd69b8d29',
  '0e3fefd8-2003',
  '우선순위 큐 기반의 HAVi 메시지 시스템 설계 및 구현',
  ARRAY['이보익', '김영국', '외 1인'],
  'conference',
  false,
  '한국정보처리학회 ''03춘계학술대회 (한국정보 처리학회)',
  2003,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f33ed684-c4e5-4e4b-b242-bc574cbefb18',
  '9ec658a6-2003',
  '자바가상머신에서 다차원배열의 효율적인 접근과 성능개선',
  ARRAY['이지현', '김영국', '외 2인'],
  'conference',
  false,
  '한국정보처리학회 ''03춘계학술대회 (한국정보 처리학회)',
  2003,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '73044337-861f-4f20-b97a-31a7224ab367',
  'f65f48e7-2003',
  '편재형 컴퓨팅 환경에서의 e-비즈니스 현안',
  ARRAY['김영국'],
  'conference',
  false,
  'u-Korea를 위한 전자거래종합학술 대회 (한국전자 거래학회)',
  2003,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f26b0ee8-8472-43bb-8c2c-e70aa8b2fabc',
  'b2b-e-marketplace-2004',
  'B2B e-Marketplace에서 웹 에이전트 기반 추천시스템',
  ARRAY['박성준', '김영국', '김룡'],
  'conference',
  false,
  '한국정보과학회 ''04춘계학술대회 (한국정보 과학회)',
  2004,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0acb046b-03e0-440d-afa2-e1c6f06e4c66',
  '0af8501a-2004',
  '모바일 게이트웨이 응용 시스템',
  ARRAY['김룡', '김영국', '외 2명'],
  'conference',
  false,
  '제9회 통신 소프트웨어 학술대회 (한국통신 학회)',
  2004,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8eab8d04-3b82-4f41-80e4-75ba08a35d26',
  '22b9ea26-2004',
  '모바일 웹 서비스를 위한 확장된 WAP 게이트웨이',
  ARRAY['박성준', '김영국', '외 2명'],
  'conference',
  false,
  '한국정보과학회 ''04추계학술대회 (한국정보 과학회)',
  2004,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '564b9d7a-003d-43ce-9111-02c81ebccf00',
  '7c55715d-2004',
  '협업 필터링 기반 개인화 추천 모바일 게이트웨이',
  ARRAY['김룡', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''04추계학술대회 (한국정보 과학회)',
  2004,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '58892fdd-92da-4a10-8c8e-e0f9da07eeb1',
  '93e90a55-2004',
  '웹 서비스를 이용한 분산 이 기종 통합 시스템 성능분석',
  ARRAY['안영헌', '박성준', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''04추계학술대회 (한국정보 과학회)',
  2004,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'de4237a0-9feb-4df1-a8f7-97de47e7a766',
  'f762f196-2004',
  '웹 서비스 환경에서 온톨로지를 적용한 지능형 추천 시스템',
  ARRAY['김룡', '김영국', '외 3명'],
  'conference',
  false,
  '한국정보과학회 ''04추계학술대회 (한국정보 과학회)',
  2004,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fe9f3f49-ccf3-4bdc-a603-5a774694cb13',
  'recommender-system-using-ontology-in-b2b-e-marketplace--2004',
  'Recommender System using Ontology in B2B e-Marketplace Environment',
  ARRAY['김룡', '김영국', '외 2명'],
  'conference',
  false,
  '한국정보기술응용 학회 ''04 추계공동학술대회 (한국정보 기술응용 학회)',
  2004,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fc39324a-1e54-4f2b-ae45-ab422852b3d2',
  'markov-model-2005',
  'Markov Model을 이용한 개인화된 전자 프로그램 가이드 시스템',
  ARRAY['홍종규', '박원익', '김영국'],
  'conference',
  false,
  '한국정보기술응용 학회 2005 춘계학술대회 (한국정보 기술응용 학회)',
  2005,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2a523272-53fd-4a5a-be50-b3a4cd5a78b0',
  '0c3c141b-2005',
  '시간스키마 기법 2단계 클러스터링 적용 추천시스템의 성능 향상',
  ARRAY['김룡', '김영국', '외 3명'],
  'conference',
  false,
  '한국정보과학회 ''05한국컴퓨터종 합학술대회 (한국정보 과학회)',
  2005,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5adf5b7e-5fe7-408e-bcc7-20c398327e32',
  'e35ab2c0-2005',
  '에이전트 기반의 개인화된 TV 프로그램 추천 시스템',
  ARRAY['홍종규', '박원익', '김룡', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''05추계학술대회 (한국정보 과학회)',
  2005,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c9529515-da9a-441e-bbc4-90eeb1e40d70',
  '9fcaf471-2005',
  '모바일 위치 정보를 이용한 개인화된 영화 예매 서비스',
  ARRAY['김룡', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''05추계학술대회 (한국정보 과학회)',
  2005,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1b4e3414-9380-4513-963f-9f9e17b71f36',
  'e7c2f23e-2006',
  '모바일 환경에서 혼합 필터링 방법을 사용한 개인화 서비스 기법',
  ARRAY['김룡', '이지현', '주원균', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''06한국컴퓨터종 합학술대회 (한국정보 과학회)',
  2006,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9c81be30-8e53-4440-91ae-8981d9f00d8d',
  '94b02285-2006',
  '모바일 환경에서 푸쉬 기술을 이용한 개인화된 멀티미디어 콘텐츠 추천 시스템',
  ARRAY['김룡', '강지헌', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2006 추계종합학술대회 (한국콘텐 츠학회)',
  2006,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '6f7af84b-e4af-4097-99db-cdf08659d9a2',
  '388579ee-2006',
  'Linux와 오픈소스를 활용한 프로그래밍 언어 교육 콘텐츠',
  ARRAY['김성현', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2006 추계종합학술대회 (한국콘텐 츠학회)',
  2006,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4af9ccc1-d9bb-4152-a7b6-07fcac15bfab',
  '3b64a789-2007',
  '웹문서 재배치 에이전트 시스템',
  ARRAY['조영임', '강상길', '김영국'],
  'conference',
  false,
  '한국퍼지및지능시 스템학회 2007년도 춘계학술대회 (한국퍼지 및지능시 스템학회)',
  2007,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '807fa0f2-4f01-467b-a6fa-cf1c94ab2222',
  '4f07b85b-2007',
  '개인화 기법을 적용한 모바일 추천 시스템',
  ARRAY['김룡', '강지헌', '김영국'],
  'conference',
  false,
  '한국경영정보학회 2007년 춘계국제학술대회 (한국경영 정보학회)',
  2007,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '085bfb91-9530-4588-a85e-217879d4a313',
  '118e579d-2007',
  '연구성과 검증시스템 구축에 관한 연구',
  ARRAY['주원균', '박근철', '양명석', '최기석', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2007 춘계종합학술대회 (한국콘텐 츠학회)',
  2007,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '224f82a3-47da-42fd-95d7-d6af679a3c7d',
  '751f9416-2007',
  '국가 R&D 현황을 종합적으로 분석하기 위한 시스템에 관한 연구',
  ARRAY['양명석', '박만희', '주원균', '김태현', '최기석', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2007 춘계종합학술대회 (한국콘텐 츠학회)',
  2007,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8a5c1a4c-e6cf-4f84-918e-526c87893e24',
  '9c9367f3-2007',
  '휴대용 멀티미디어 단말을 위한 컨텐츠 메타 정보 검색 시스템의 설계 및 구현',
  ARRAY['박원익', '이광동', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''07한국컴퓨터종 합학술대회 (한국정보 과학회)',
  2007,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3070b29e-eaa3-48d7-a716-58e05797cce6',
  '1e2b6b1b-2007',
  '원전의 개량형 경보처리를 위한 능동 데이터베이스 기술 도입 분석',
  ARRAY['장귀숙', '박희윤', '금종룡', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''07한국컴퓨터종 합학술대회 (한국정보 과학회)',
  2007,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '99d40e15-bcce-4099-b621-b41d859ef9ac',
  'a1b3c71e-2007',
  '웹 애플리케이션 보안에 관한 고찰',
  ARRAY['정진미', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''07추계학술대회 (한국정보 과학회)',
  2007,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '466a12c4-7fad-430f-b97d-dc2834fe252b',
  '606c5ac4-2007',
  '분산 P2P 환경에서 모바일 동기화 서비스를 통한 멀티미디어 콘텐츠 추천 시스템의 설계',
  ARRAY['김룡', '김병만', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''07추계학술대회 (한국정보 과학회)',
  2007,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '54c9648d-ea57-4a80-a64b-85d40879e65b',
  '61d071f0-2007',
  '유비쿼터스 환경에서 사용자 맞춤 자원 공유 시스템',
  ARRAY['박원익', '김영국', '외 6명'],
  'conference',
  false,
  '한국퍼지및지능시 스템학회 2007년도 추계학술대회 (한국퍼지 및지능시 스템 학회)',
  2007,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c0840f74-acf4-4683-971a-021e12380e74',
  'a32be4cb-2007',
  '유비쿼터스 환경에서 상황 기반 디바이스 추천 시스템',
  ARRAY['최환수', '김영국', '외 6명'],
  'conference',
  false,
  '한국정보처리학회 ''07추계학술대회 (한국정보 처리학회)',
  2007,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1197ff2a-f1c5-46e8-921c-bd708875ba2a',
  '920aad2c-2007',
  '기 개발된 정보시스템 내에 포함된 비즈니스 규칙 관리 방안',
  ARRAY['정진미', '김영국'],
  'conference',
  false,
  '한국정보처리학회 ''07추계학술대회 (한국정보 처리학회)',
  2007,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cb2aed2a-03e1-42c4-bc9d-e060547d9326',
  'e34fd281-2008',
  '개량형원전 경보감축을 위한 데이터마이닝과 능동데이터베이스 기술현안 및 대안',
  ARRAY['장귀숙', '금종룡', '박희윤', '김영국'],
  'conference',
  false,
  'Korean Database Conference 2008 (KDBC 2008) (한국정보 과학회 데이터베 이스 소사이어 티)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e3fc129a-f2cc-45f7-a20b-80b4b6e9f28a',
  'b4468a79-2008',
  'DBMS 기능 시험 도구 설계 및 구현',
  ARRAY['한상혁', '정정수', '유명호', '김영국', '진성일'],
  'conference',
  false,
  'Korean Database Conference 2008 (KDBC 2008) (한국정보 과학회 데이터베 이스 소사이어 티)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1df39855-ac20-43f9-938e-621838dc13d4',
  '29a89658-2008',
  '자바 기반 웹 애플리케이션 프레임워크 고찰',
  ARRAY['정진미', '김영국'],
  'conference',
  false,
  '2008년도 한국멀티미디어학 회 춘계학술대회 논문집 (한국멀티 미디어학 회)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2e3a0443-5fe2-4666-a280-2bb352dd21c2',
  '88624b77-2008',
  '상황인지 기반 사용자 맞춤 자원 공유 시스템',
  ARRAY['이용대', '박원익', '김영국', '강지훈'],
  'conference',
  false,
  '한국콘텐츠학회 2008 춘계종합학술대회 (한국콘텐 츠학회)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fc2790f5-f949-49a0-a784-2dec67aff177',
  'd56b4e28-2008',
  '국가R&D 참여인력 정보 활용을 위한 서비스 체제 구축에 관한 연구',
  ARRAY['양명석', '윤영준', '조항석', '신성호', '손강렬', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2008 춘계종합학술대회 (한국콘텐 츠학회)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8e8a745f-2489-49bf-9534-eeb3aab6538a',
  '0b776296-2008',
  '유비쿼터스 지능공간에서 자원공유를 위한 온톨로지 기반 추론',
  ARRAY['강선희', '박종현', '강지훈', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2008 춘계종합학술대회 (한국콘텐 츠학회)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'eaa6df46-c555-4e3a-9071-37c78fb7c46f',
  'alarm-reduction-processing-of-advanced-nuclear-power-pl-2008',
  'Alarm Reduction Processing of Advanced Nuclear Power Plant Using Data Mining and Active Database Technologies',
  ARRAY['장귀숙', '금종룡', '박희윤', '김영국'],
  'conference',
  false,
  'Transactions of the Korean Nuclear Society Spring Meeting (한국원자 력학회)',
  2008,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0433cb98-3bec-4389-acca-555e29e72f0f',
  'linear-discriminant-clustering-in-pattern-recognition-2008',
  'Linear Discriminant Clustering in Pattern Recognition',
  ARRAY['손조가', '최미선', '김영국'],
  'conference',
  false,
  '2008년도 대한전자공학회 하계종합학술대회 (대한전자 공학회)',
  2008,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f516ecca-f231-4f9c-88d2-60274bfb183e',
  '97ebaff7-2008',
  '유비쿼터스 환경에서 사용자 맞춤형 디바이스 협업 시스템',
  ARRAY['박원익', '이용대', '김영국'],
  'conference',
  false,
  '''08한국컴퓨터종 합학술대회 논문집(D) (한국정보 과학회)',
  2008,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4dde8fa0-0311-4acf-a151-ae58f2ae129c',
  '060e5f46-2008',
  '모바일 환경에서의 멀티미디어 컨텐츠 자동관리 시스템',
  ARRAY['심우제', '황대대', '김영국'],
  'conference',
  false,
  '''08한국컴퓨터종 합학술대회 논문집(D) (한국정보 과학회)',
  2008,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '69e9b004-7276-4666-8ddc-4f69ccfd99b8',
  '0a5339e3-2008',
  '지도기반의 모바일 영업 자동화 시스템',
  ARRAY['임문섭', '홍성범', '김영국'],
  'conference',
  false,
  '''08한국컴퓨터종 합학술대회 논문집(D) (한국정보 과학회)',
  2008,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0e1ff240-a6e1-41a7-a82c-dd4cb202f8a9',
  '49a4f735-2008',
  '유비쿼터스 환경에서 모바일 멀티미디어 콘텐츠의 지능적인 관리 기법',
  ARRAY['이용대', '박원익', '김영국', '강지훈'],
  'conference',
  false,
  '2008년도 대한전자공학회 추계학술대회 (대한전자 공학회)',
  2008,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8605f8c2-5f67-4550-92a3-a525b89795b0',
  'a15e1388-2008',
  '자원 공유 시스템에서 사용자 선호도 및 자원 정보의 동적 처리 기법',
  ARRAY['심우제', '박원익', '김영국', '강지훈'],
  'conference',
  false,
  '2008년도 대한전자공학회 추계학술대회 (대한전자 공학회)',
  2008,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a9f6f724-b6c9-4b97-9668-143431b6426d',
  '65e14025-2008',
  '유비쿼터스 환경에서 개인화된 서비스를 위한 온톨로지와 규칙 기반 자원 추론',
  ARRAY['박종현', '홍성범', '강선희', '김영국', '강지훈'],
  'conference',
  false,
  '2008년도 한국정보처리학회 추계학술발표대회 (한국정보 처리학회)',
  2008,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2825a6d0-ee47-4a3c-9dfb-1b5e15f60a61',
  'f4c0bdbc-2008',
  '자원 공유 환경에서 사용자 맞춤형 서비스 구성을 위한 추론 시스템',
  ARRAY['강선희', '박종현', '김영국', '강지훈'],
  'conference',
  false,
  '2008년도 대한전자공학회 추계학술대회 (대한전자 공학회)',
  2008,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '57eee8b2-3515-4dd0-b91d-b9fde1966dcf',
  'c63975ac-2008',
  '서비스 및 상황에 따른 장치 공유를 위한 온톨로지 기반 추론',
  ARRAY['홍성범', '박종현', '김영국', '강지훈'],
  'conference',
  false,
  '2008년도 대한전자공학회 추계학술대회 (대한전자 공학회)',
  2008,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '674e93d5-c9f6-4b97-82ba-c1703c555420',
  'd986f309-2009',
  '조사분석정보와 국가R&D표준정보 수집체계 일원화에 따른 국가R&D정보 수집체계 개선에 관한 연구',
  ARRAY['권이남', '김태현', '김윤정', '최희석', '김재수', '김영국'],
  'conference',
  false,
  '한국콘텐츠학회 2009 춘계종합학술대회 (한국콘텐 츠학회)',
  2009,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a97e3d42-f3b3-4656-bfa5-1b487f042508',
  '9b5b5db1-2009',
  '사용자의 심리와 상황을 고려한 맞춤형 모바일 멀티미디어 콘텐츠 제공 기법',
  ARRAY['심우제', '박원익', '김영국'],
  'conference',
  false,
  '''09한국컴퓨터종 합학술대회 논문집(A) (한국정보 과학회)',
  2009,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '36c39c74-8607-4470-b04a-44c19ddfea82',
  '87e4be0f-2009',
  'SensorML 기반 센서 메타데이터 정의 및 작성 도구 개발',
  ARRAY['임문섭', '한병엽', '김영국', '강지훈'],
  'conference',
  false,
  '''09한국컴퓨터종 합학술대회 논문집(D) (한국정보 과학회)',
  2009,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '42160fbf-a034-4226-aa16-e98fc254388a',
  '509ed644-2009',
  '모바일 웹2.0 방식의 실시간 여행정보서비스',
  ARRAY['조운형', '김영국'],
  'conference',
  false,
  '''09한국컴퓨터종 합학술대회 논문집(A) (한국정보 과학회)',
  2009,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4c0e2477-bd4a-47ae-84df-3e47b47dca87',
  '2d4a135e-2009',
  '업무 변경시 시스템간 영향력 최소화를 위한 식별체계 웹서비스 설계에 관한 연구',
  ARRAY['권이남', '김재수', '김영국'],
  'conference',
  false,
  '한국기술혁신학회 2009년 추계학술대회 논문집 (한국기술 혁신학회)',
  2009,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '33a5d904-ff6e-44cc-a20b-52026c6b95fc',
  'usn-middleware-2010',
  'USN Middleware에서 센서데이터 패턴분석을 위한 센서데이터 관리 계층',
  ARRAY['조운형', '김영국'],
  'conference',
  false,
  'KCC 2010 (한국정보 과학회)',
  2010,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2355f18b-7d47-4a2d-88bb-d4536818b26c',
  'mmdbms-kairos-2010',
  '맵 저작 시스템용 MMDBMS의 유지보수성 향상을 위한 Kairos 유지보수 테스트 도구',
  ARRAY['한상혁', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''10 추계학술대회 (한국정보 과학회)',
  2010,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '64388a80-3e4c-4ddc-afb7-3daffd46473c',
  '9ff04071-2011',
  '내비게이션 데이터 압축 알고리즘 평가 도구 설계',
  ARRAY['김호영', '한상혁', '김영국'],
  'conference',
  false,
  '한국정보처리학회 2011년 춘계학술발표대회 (한국정보 처리학회)',
  2011,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e6a51e66-bbd0-4b3a-b7f7-8ee60084cf96',
  '01bd9250-2011',
  '공정 데이터 압축 성능평가를 위한 시뮬레이터 설계',
  ARRAY['유민형', '한상혁', '김영국'],
  'conference',
  false,
  '한국정보처리학회 2011년 춘계학술발표대회 (한국정보 처리학회)',
  2011,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '692f4cc5-f4b3-4850-bb40-de6bd7c952a7',
  '5ff84580-2011',
  '모바일 위치 기반 서비스를 위한 필터링 기반 이동 객체 데이터 압축 기법',
  ARRAY['한상혁', '홍순필', '김호영', '김영국'],
  'conference',
  false,
  '한국정보과학회 ''11 추계학술대회 (한국정보 과학회)',
  2011,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b2882478-055f-4ea7-8e09-514041472809',
  'cbfc951c-2012',
  '산업감시 및 제어 응용을 위한 이력 데이터, 트랜잭션 그리고 데이터베이스',
  ARRAY['한상혁', '김영국'],
  'conference',
  false,
  '한국정보처리학회 2012년 춘계학술발표대회 (한국정보 처리학회)',
  2012,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '42269254-3845-452a-8b3f-83e15049e04a',
  'f426d1df-2012',
  '이력 데이터 압축 알고리즘의 성능평가를 위한 시뮬레이터',
  ARRAY['유민형', '김호영', '한상혁', '김영국'],
  'conference',
  false,
  '한국정보과학회 2012 한국컴퓨터종합학 술대회 논문집(A) (한국정보 과학회)',
  2012,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a5b26c15-fb38-46f6-8577-afbc13d98365',
  'e7afa4c1-2012',
  '멀티코어 환경에서의 멀티스레드 기법을 이용한 메모리 할당 연산의 성능 평가를 위한 시뮬레이터',
  ARRAY['김호영', '황대대', '한상혁', '김영국'],
  'conference',
  false,
  '한국정보과학회 2012 한국컴퓨터종합학 술대회 논문집(A) (한국정보 과학회)',
  2012,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8ae58a74-3a5a-4e60-85f6-75277c2f1104',
  'b5735d9b-2012',
  '오픈소스 클라우드 플랫폼 : 오픈스택과 클라우드스택',
  ARRAY['라정휘', '한상혁', '성백열', '김영국'],
  'conference',
  false,
  '한국정보과학회 2012 한국컴퓨터종합학 술대회 논문집(A) (한국정보 과학회)',
  2012,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '50fa4850-f547-4c91-9f1e-4414d4fea537',
  '7597bece-2012',
  '빅데이터 기술 및 분석 기법의 연구 동향',
  ARRAY['최성우', '김호영', '김영국'],
  'conference',
  false,
  '한국정보과학회 2012 가을 학술발표논문집 (A) (한국정보 과학회)',
  2012,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2470446e-5205-4eab-b35c-e449f5ba4beb',
  'd232229b-2012',
  'DBMS 기반의 국방 M&S 분산 시뮬레이션 연동 구조',
  ARRAY['성백열', '최미선', '김영국'],
  'conference',
  false,
  '한국정보과학회 2012 가을 학술발표논문집 (C) (한국정보 과학회)',
  2012,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0ce16bcd-cf18-4a93-9db0-6e809b904966',
  'ad3a01e8-2013',
  '트위터에서 에르되스 수와 네트워크 구조에 관한 연구',
  ARRAY['이지민', '이정', '이민주', '김다은', '조은선', '김영국'],
  'conference',
  false,
  '2013년도 대한전자공학회 하계학술대회 (대한전자 공학회)',
  2013,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '11014d27-f1f2-40fd-99e4-62ab70636480',
  'c0e55827-2013',
  '추천 시스템에서 Sigmoid 함수를 사용한 유사도 측정 개선 방안',
  ARRAY['김룡', '김영국'],
  'conference',
  false,
  '한국정보과학회 2013 추계 학술발표논문집 (한국정보 과학회)',
  2013,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '6ec60ba3-dfa7-4246-9154-0c5b2ee5f6df',
  'ms-db-2013',
  '국방 M&S 가상 시험 연동을 위한 효율적인 DB설계',
  ARRAY['최성우', '이예나', '최미선', '김영국'],
  'conference',
  false,
  '한국정보과학회 2013 추계 학술발표논문집 (한국정보 과학회)',
  2013,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8b590361-08b7-476f-bfcd-ba4b9653ad00',
  '4b09edcb-2014',
  '분산 하둡 시스템의 성능 비교 분석',
  ARRAY['배병진', '김영주', '김영국'],
  'conference',
  false,
  '한국정보통신 종합학술대회 논문집 (2014 춘계) (한국정보 통신학회)',
  2014,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4f60b296-2da9-4ff5-a1a0-80be82146b8d',
  '6b61dc9d-2014',
  '그룹 의사 결정을 위한 AHP기반 영화 추천 기법',
  ARRAY['안두철', '윤서현', '김영국'],
  'conference',
  false,
  '한국정보과학회 2014 한국컴퓨터종합학 술대회 논문집 (한국정보 과학회)',
  2014,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '440d77bc-048d-485f-8691-d9c36a331167',
  '6bcc8a53-2014',
  '추천시스템에서 사용자 평가값의 Sigmoid 함수값을 사용한 개선된 유사도 측정',
  ARRAY['김룡', '김영국'],
  'conference',
  false,
  '한국정보과학회 2014 한국컴퓨터종합학 술대회 논문집 (한국정보 과학회)',
  2014,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e091851f-2691-42d0-88f2-5ebaae895492',
  'interactive-book-cover-design-based-on-language-resourc-2014',
  'Interactive book cover design based on language resources',
  ARRAY['김김영국'],
  'conference',
  false,
  'ICCC 2014 (한국콘텐 츠학회)',
  2014,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5bbee3e6-1126-451f-a20d-d3e9e97d53ec',
  '3d-3d-shape-analysis-based-character-model-deformation-2014',
  '모델 변형을 위한 3D 캐릭터 형태 분석 기법 (3D Shape Analysis based Character Model Deformation)',
  ARRAY['Ki Suk Lee', 'Su Ran Park', 'Young-K uk Kim'],
  'conference',
  false,
  'HCIK 2015 (HCI Society of Korea)',
  2014,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'de5efd7b-f18b-40d8-8893-4b0a628483a8',
  'ms-hlarti-fom-dbms-2014',
  '국방 M&S 분산 시뮬레이션의 HLA/RTI 연동 데이터 저장을 위한 FOM-DBMS 메타 모델 변환 방법 (우수발표논문상)',
  ARRAY['최성우', '이예나', '최미선', '김영국'],
  'conference',
  false,
  '한국정보과학회 2014 동계 학술발표회논문집 (한국정보 과학회)',
  2014,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '57f0d53c-363d-4354-b243-e5c4e9a2628a',
  'hlarti-dbms-2015',
  'HLA/RTI 기반 국방 가상시험 페더레이션과 DBMS 연동 방법',
  ARRAY['이예나', '손진혁', '최미선', '김영국'],
  'conference',
  false,
  '2015 한국데이터베이스 학술대회 논문집 (KDBC 2015) (한국정보 과학회 데이터베 이스소사 이어티)',
  2015,
  5,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '049e5328-b5e6-465b-8e65-1ffe90e22af4',
  '3691febe-2015',
  '모바일 환경에서 상황인지를 통한 개인화된 동적 인터페이스 제공 시스템',
  ARRAY['윤서현', '김영국'],
  'conference',
  false,
  '한국정보과학회 2015 한국컴퓨터종합학 술대회 논문집 (한국정보 과학회)',
  2015,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8ff9d877-29a3-4fc5-91d3-a9d5971b9380',
  'f136cf2e-2015',
  '미래 유망아이템 발굴을 위한 분석 플랫폼 연구 - LOD 활용을 중심으로 -',
  ARRAY['권이남', '이방래', '박준환', '문영호', '김영국'],
  'conference',
  false,
  '한국기술혁신학회 2015 추계학술대회 (한국기술 혁신학회)',
  2015,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7b4e8855-ae54-46b9-a120-6662941c61d6',
  'hlarti-ms-db-db-2015',
  'HLA/RTI 기반 국방 M&S 가상시험을 위한 DB 연동 및 분산 DB 설계 방법',
  ARRAY['이예나', '손진혁', '최미선', '김영국'],
  'conference',
  false,
  '한국정보과학회 2015 동계 학술발표회논문집 (한국정보 과학회)',
  2015,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'dab72d81-2853-4466-8d11-a63f7ee767eb',
  '7f396107-2015',
  '멀티모달 센서 기반 상황인지를 통한 스마트폰 개인화 스케줄링 시스템',
  ARRAY['윤서현', '정수연', '김영국'],
  'conference',
  false,
  '한국정보과학회 2015 동계 학술발표회논문집 (한국정보 과학회)',
  2015,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ae028be9-5350-4f01-a760-e3f30a6eef9c',
  '7d95739a-2016',
  '시뮬레이션에 기반한 원전 계측제어 계통의 시험검증 방법',
  ARRAY['이영준', '금종룡', '김영국'],
  'conference',
  false,
  '한국정보처리학회 2016년 춘계학술발표대회 (한국정보 처리학회)',
  2016,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4cf93cb0-ed2f-47af-bc94-eb720f854757',
  'hlarti-ms-db-2016',
  'HLA/RTI 기반 국방 M&S 가상시험을 위한 분산 DB 코디네이터 프로토콜 설계',
  ARRAY['손진혁', '이예나', '최미선', '김영국'],
  'conference',
  false,
  '한국정보과학회 2016 한국컴퓨터종합학 술대회 논문집 (한국정보 과학회)',
  2016,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '70b3ac4f-3371-403a-a700-077509bc6d36',
  '1a0d9a38-2016',
  '원격으로 콘텐츠 제어가 가능한 디지털 액자 시스템',
  ARRAY['김태호', '김영국'],
  'conference',
  false,
  '한국정보과학회 2016 한국컴퓨터종합학 술대회 논문집 (한국정보 과학회)',
  2016,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1936a775-a332-492f-ba57-cdbd9ba8ad55',
  '698cb9b2-2016',
  'IoT 환경에서의 베이지안 네트워크를 이용한 추천시스템',
  ARRAY['정수연', '김영국'],
  'conference',
  false,
  '한국컴퓨터정보학 회 하계학술대회 논문집 (한국컴퓨 터정보학 회)',
  2016,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '006239bd-9ce6-411a-846c-f93d2b204c1a',
  '404be828-2016',
  'HLA/RTI 기반 분산 시뮬레이션 연동 환경을 위한 데이터 관리 도구',
  ARRAY['최승환', '김병수', '황석규', '최미선', '김영국'],
  'conference',
  false,
  '국방SW연구회 추계워크샵 (한국정보 과학회)',
  2016,
  9,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0616f75a-2701-4ed9-b251-4053ead4805d',
  'rest-api-3d-2016',
  'REST API를 이용한 3D프린터 제어 시스템 구현',
  ARRAY['강현철', '김영국', '외 5명'],
  'conference',
  false,
  '2016년 한국통신학회 추계종합학술대회 논문집 (한국통신 학회)',
  2016,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8993aa01-7e48-448e-962a-a032f368ead8',
  '026e49de-2016',
  '안드로이드 어플리케이션에서 효율적인 개인 프로파일 데이터 저장을 위한 라이브러리',
  ARRAY['장진규', '김진학', '박지혜', '김영국', '정수연'],
  'conference',
  false,
  '한국정보과학회 2016 동계 학술발표회논문집 (한국정보 과학회)',
  2016,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '34ee15de-db0d-478b-830b-8a347621cc1b',
  'psr-sac-pir-2016',
  '접촉감응기술(PSR)과 적응제어(SAC) PIR 기술이 적용된 재난 방재 시스템 개발',
  ARRAY['김태호', '김영국', '황재용'],
  'conference',
  false,
  '한국정보과학회 2016 동계 학술발표회논문집 (한국정보 과학회)',
  2016,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cfc95a88-bdc6-4b94-9069-4d0e981e7a10',
  '83fa4b51-2016',
  'IoT 환경을 지원하는 스마트 자동판매기를 위한 사용자 맞춤 모바일 앱',
  ARRAY['이예찬', '이슬기', '윤연주', '김영국'],
  'conference',
  false,
  '대한전자공학회 학술심포지움 논문집 (대한전자 공학회)',
  2016,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a3b5d553-bc9a-471a-b011-d507b289eb7a',
  '90de5aae-2017',
  'BLE 비콘 기반 전자 출결 시스템에서의 상황인지를 기반으로 한 사용자 인식 기법',
  ARRAY['강승완', '김영국'],
  'conference',
  false,
  '한국정보통신학회 2017년 춘계학술대회 (한국정보 통신학회)',
  2017,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '400f9602-47c3-40e8-8302-61f16a5900fa',
  '70a53d7c-2017',
  '개인화 제조 서비스를 위한 IoT기반 멀티 3D프린터 관리 방안 연구',
  ARRAY['강현철', '김영국', '외 5명'],
  'conference',
  false,
  '한국정보통신학회 2017년 춘계학술대회 (한국정보 통신학회)',
  2017,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7ed3082f-3971-4f43-af2b-cec388fa6050',
  'a820f8aa-2017',
  '스마트 제조 환경에서 IoT기반 로봇의 상태 분류방법에 대한 연구',
  ARRAY['강현철', '김영국', '외 5명'],
  'conference',
  false,
  '한국정보통신학회 2017년 추계학술대회 (한국정보 통신학회)',
  2017,
  10,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '42b37644-06fb-4178-b850-69e148b457b7',
  'afc68db1-2017',
  '일라이트 기능성 침대와 연동하는 IoT 기반의 헬스케어 시스템 개발',
  ARRAY['서정현', '심예인', '박성호', '김영국'],
  'conference',
  false,
  '제19회 전자정보통신 학술대회(CEIC20 17) (대한전자 공학회/ 한국통신 학회)',
  2017,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0b7245e2-49d9-4b21-ab6c-d60f0dca0205',
  '7daf07ca-2017',
  '게임 콘텐츠를 포함한 범용 드론 시뮬레이터 개발',
  ARRAY['김진식', '이지혜', '황예은', '김영국'],
  'conference',
  false,
  '제19회 전자정보통신 학술대회(CEIC20 17) (대한전자 공학회/ 한국통신 학회)',
  2017,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '35430846-7b49-4be5-97ad-eeea202cad2d',
  '7cd03e47-2018',
  '멀티모달 데이터 기반 교통 흐름 예측 시스템 설계',
  ARRAY['김성수', '민옥기', '김영국'],
  'conference',
  false,
  '2018 한국지능시스템학 회 춘계학술대회 논문집 (한국지능 시스템학 회)',
  2018,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4adb8d0f-9616-4b53-a6f7-c9e9253a01c9',
  'fb12c7c7-2018',
  '메소스코픽 트래픽 시뮬레이션을 위한 실시간 가시화 시스템 구현',
  ARRAY['김성수', '민옥기', '김영국'],
  'conference',
  false,
  '2018년 대한전자공학회 추계학술대회 논문집 (대한전자 공학회)',
  2018,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '886b44b2-c959-4330-8ed4-c2bb5516fd92',
  'd439eb84-2018',
  '모바일 환경에서 크로스 플랫폼 실행을 위한 OCTOPUS 프레임워크 설계',
  ARRAY['김재식', '김영국'],
  'conference',
  false,
  '2018년 대한전자공학회 추계학술대회 논문집 (대한전자 공학회)',
  2018,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'facab416-a4d6-4a8e-8814-08b642c22a27',
  '091d9458-2018',
  '사용자 컨텍스트 기반 주기적인 구매 데이터를 위한 추천시스템',
  ARRAY['정수연', '손진혁', '김영국'],
  'conference',
  false,
  '2018년 대한전자공학회 추계학술대회 논문집 (대한전자 공학회)',
  2018,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '161de82e-7414-47d2-89b4-fb3100ee67ca',
  '6d48a8cd-2018',
  '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 관리 도구',
  ARRAY['심지수', '안정은', '김영국', '김현석'],
  'conference',
  false,
  '2018년 대한전자공학회 추계학술대회 논문집 (대한전자 공학회)',
  2018,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e560a575-f01a-496a-9f8f-3d2aa242bb65',
  '737e7539-2020',
  '산을 위한 모듈형 FaaS 공정제어 템',
  ARRAY['김민기', '김영국', '외 5명'],
  'conference',
  false,
  '대회 논문집',
  2020,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '115297e6-5967-42a6-9f60-f858acc7c27b',
  '18195046-2020',
  '병렬 은닉층을 사용한 오토인코더 모델 경량화',
  ARRAY['문하겸', '김영국'],
  'conference',
  false,
  '한국컴퓨터비전학회 제32회 영상처리 및 이해에 관한 워크샵(IPIU2020) (한국컴퓨터 비전학회)',
  2020,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e5081b4c-ccce-4f1d-bbed-1e521c022791',
  'b041f29b-2020',
  '사용자 채팅 데이터를 활용한 스트리밍 방송 하이라이트 구간 자동추출 시스템',
  ARRAY['문하겸', '김영국'],
  'conference',
  false,
  '한국정보과학회 2020 한국컴퓨터종합학 술대회 논문집 (한국정보 과학회)',
  2020,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bf4f5b2c-f60f-4a42-8c99-b52b7dcd451c',
  '67ef58a2-2020',
  '적외선 영상 기반 신경망 구조와 군집 분석을 이용한 고속 피플 카운팅',
  ARRAY['권현송', '이종화', '구호근', '이범주', '김영국'],
  'conference',
  false,
  '대한전자공학회 2020년도 하계종합학술대회 (대한전자 공학회)',
  2020,
  8,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8fd5948f-0c82-43e9-8285-a543d18f5af6',
  '830c3abd-2020',
  '기계학습을 활용한 국화 작물의 정식기 및 수확 시기 자동조절 시스템',
  ARRAY['김정환', '김성진', '박종석', '김영국'],
  'conference',
  false,
  '한국통신학회 추계종합학술발표 회 (한국통신 학회)',
  2020,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cbf030d1-7ece-4bef-962b-70dbe4986950',
  'bc10ebe0-2021',
  '그림 기반 심리검사에 인공지능 기술을 적용하기 위한 지식 데이터베이스 구축 방법과 평가',
  ARRAY['김영국', '김영호'],
  'conference',
  false,
  '2021 한국데이터베이스 학술대회 논문집 (KDBC 2021) (한국정보 과학회 데이터베 이스소사 이어티)',
  2021,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7cc97e52-c388-4801-9e04-634f797624af',
  'c86509e5-2021',
  '딥러닝 음성합성기술을 활용한 동영상 콘텐츠의 음성 오디오 부분 교체 프로그램 개발',
  ARRAY['조다민', '김성현', '송태성', '김영국', '김영호'],
  'conference',
  false,
  '2021 한국데이터베이스 학술대회 논문집 (KDBC 2021) (한국정보 과학회 데이터베 이스소사 이어티)',
  2021,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '31944878-ac85-4067-a6e4-61a3a2253ce9',
  '7ebec52e-2021',
  '차량 운행 데이터의 딥러닝을 통한 실시간 위험 운전 행동 예측 시스템',
  ARRAY['김지현', '김아영', '송현진', '김영국', '이규현'],
  'conference',
  false,
  '한국정보과학회 KSC2021 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2021,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2635ce49-e84f-475a-b6a4-0589ad08cf4e',
  '456bea12-2021',
  '개인화된 TTS 구현 가능성을 위한 딥러닝 모델 비교',
  ARRAY['권세영', '맹지연', '백예슬', '김영국'],
  'conference',
  false,
  '2021 한국정보기술학회 추계종합학술대회 (한국정보 기술학회)',
  2021,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4bb1db8a-e9a8-420c-bc5c-f91a5d6430b1',
  'efficientdet-2022',
  'EfficientDet 기반 온실 내 해충 피해 예방을 위한 실시간 해충 객체 감지',
  ARRAY['강채영', '박종석', '김영국'],
  'conference',
  false,
  '한국정보과학회 KCC2022 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2022,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4bff246b-7ae2-408e-9439-e2817f1ff93c',
  'e1c06b0c-2022',
  '인공지능 언어 모델을 이용한 인 실리코 약물 발굴에서의 데이터 전처리와 도킹 사이트 발견',
  ARRAY['윤유경', '외 8인'],
  'conference',
  false,
  '한국정보과학회 KCC2022 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2022,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e413af2a-fdc0-41c7-83c8-5830fd8d974c',
  'ef8d4f19-2022',
  '특징 추출과 딥러닝을 활용한 항원 결정기 예측',
  ARRAY['하정민', '조원근', '김영국'],
  'conference',
  false,
  '2022 한국데이터베이스 학술대회 논문집 (KDBC 2022) (한국정보 과학회 데이터베 이스소사 이어티)',
  2022,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0c97158f-6cc7-4f22-821c-ce57ba6acc67',
  '957d9364-2022',
  '딥러닝을 활용한 아동 집 그림 심리 분석표 작성 모듈',
  ARRAY['이문영', '외 4인'],
  'conference',
  false,
  '2022 한국데이터베이스 학술대회 논문집 (KDBC 2022) (한국정보 과학회 데이터베 이스소사 이어티)',
  2022,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1cd235da-0fbb-4e39-96ff-074bbd16c5aa',
  '71e9c51e-2022',
  '딥러닝을 활용한 차량 데이터 기반의 고장 예측 시스템',
  ARRAY['주상현', '외 4명'],
  'conference',
  false,
  '2022 한국데이터베이스 학술대회 논문집 (KDBC 2022) (한국정보 과학회 데이터베 이스소사 이어티)',
  2022,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8b9a4ab1-9cf1-451f-aadf-9fbb5f52516b',
  '9efe6613-2022',
  'IoT 기반의 돼지 재고 자동 카운팅과 이상행동 감지 시스템 개발',
  ARRAY['김태우', '외 4명'],
  'conference',
  false,
  '2022 한국데이터베이스 학술대회 논문집 (KDBC 2022) (한국정보 과학회 데이터베 이스소사 이어티)',
  2022,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '575d5e3b-f38c-4003-b366-117c59eaee4f',
  'ee62aa58-2022',
  '딥러닝 기반 식품 이미지 인식을 통한 당뇨병 환자 대상 식품 영양정보 제공 시스템',
  ARRAY['문혜림', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KSC2022 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2022,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b8601b3c-9ea4-4e8b-a252-a3cd4532b81b',
  '290dfd9f-2022',
  '딥러닝 기반 어린이 손글씨 답안 자동 채점 시스템',
  ARRAY['김문현', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KSC2022 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2022,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8bca695f-e512-452c-8cb1-81804f21a694',
  '34b84dea-2023',
  '특징 추출을 활용한 단백질-단백질 수소 결합 거리 예측',
  ARRAY['하정', '민', '외 3인'],
  'conference',
  false,
  'AAICON2023 http://aifrenz.notion.sit /2023-2-d0181ac6514946 1cba3c5fa4271b0128 (에이아이 프렌즈학 회)',
  2023,
  2,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '012f22d2-63e8-4d59-a3da-de7a65128c2a',
  '4845205e-2023',
  '딥러닝 기반 과학기술문서 자동분류 (우수논문상 수상)',
  ARRAY['이은진', '외 3명'],
  'conference',
  false,
  '2023 한국스마트미디어 학회 종합학술대회 (한국스마 트미디어 학회)',
  2023,
  4,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '706a1b2e-0c55-415f-a83f-ad4a4e3b4264',
  'xai-pdf-2023',
  'XAI 모델 해석 기반의 PDF 문서형 악성코드 분석 강화',
  ARRAY['손진혁', '외'],
  'conference',
  false,
  '한국정보과학회 KCC2023 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2023,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8c3e89d2-b7cd-4457-af15-34b58b214797',
  'a-genome-wide-association-study-for-chicken-plumage-col-2023',
  'A genome-wide association study for chicken plumage color using image analysis',
  ARRAY['외 9인'],
  'conference',
  false,
  '2023 한국동물유전육종 학회 종합학술대회 ((사)한국 동물유전 육종학회)',
  2023,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8e485eeb-f475-4fc0-bf58-2fb60bc394e2',
  'lstm-autoencoder-2023',
  '차량 데이터를 활용한 LSTM-Autoencoder 기반 차량 고장 예측 모델의 성능 개선',
  ARRAY['손유지', '외'],
  'conference',
  false,
  '대한전자공학회 2023년도 하계종합학술대회 (대한전자 공학회)',
  2023,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fa857843-5465-482b-ae48-adf7cb5155cf',
  '90bfe501-2023',
  '화학적 지문을 이용한 저분자 생체활성 예측',
  ARRAY['배당기', '수니야', '니외'],
  'conference',
  false,
  '대한전자공학회 2023년도 하계종합학술대회 (대한전자 공학회)',
  2023,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ebff689c-4f25-4b8c-b8d8-3477cd810dfb',
  'digital-image-based-phenotyping-for-genetic-studies-on--2023',
  'Digital image-based phenotyping for genetic studies on chicken feathers',
  ARRAY['외 8명'],
  'conference',
  false,
  '2023년도 (사)한국축산학회 학술발표회 ((사)한국 축산학회)',
  2023,
  NULL,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a9d5e703-f801-4c29-bdaf-97a197ae78bc',
  '6328a970-2023',
  '광안대교 운영관리를 위한 상세 공간 바람정보 생산 기술 연구 및 인공지능 분석 정보 표출 시스템 구현',
  ARRAY['정희석', '외 6인'],
  'conference',
  false,
  '2023 한국기상학회 가을학술대회 (한국기상 학회)',
  2023,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '08bee579-c951-4724-a70e-7b0865eee474',
  'd1cd3861-2023',
  '불균형한 감귤 병해충 데이터 분류를 위한 딥러닝 기반 오버샘플링 기법',
  ARRAY['이동연', '외 5인'],
  'conference',
  false,
  '2023 한국데이터베이스 학술대회 논문집 (KDBC 2023) (한국정보 과학회 데이터베 이스소사 이어티)',
  2023,
  11,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ad6d151d-3c41-42d5-a5e2-6bd6cf94a849',
  '96b71ad3-2023',
  '딥러닝 기반 인삼 자동 분류 서비스',
  ARRAY['반연', '김문현', '김영국'],
  'conference',
  false,
  '한국정보과학회 KSC2023 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5802bf8a-7bbd-4791-bfac-9bf80b960e42',
  '9a4fe37c-2023',
  '딥러닝 기반 참외 잎의 병해충 이미지 분류',
  ARRAY['박진수', '외 5인'],
  'conference',
  false,
  '한국정보과학회 KSC2023 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9d3f9bf9-3674-452e-be6e-a3bdad711648',
  'swin-transformer-2023',
  'Swin Transformer 모델을 적용한 한우 발정 탐지',
  ARRAY['이형석', '외 3명'],
  'conference',
  false,
  '한국정보과학회 KSC2023 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a63d5491-b48d-4a3f-bba7-73ad0daf8447',
  'c58ed7ab-2023',
  '차량 운행 데이터를 활용한 딥러닝 기반 고장 유형 분류 및 예측',
  ARRAY['손유지', '외 5명'],
  'conference',
  false,
  '한국정보과학회 KSC2023 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '05531a8c-56f3-4fed-b916-cde5293bbafc',
  'b8bc5db8-2023',
  '파의 질병 분류를 위한 딥러닝 모델 성능 비교',
  ARRAY['이민재', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KSC2023 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '68591621-b258-4fc6-8b5c-07073a3efa96',
  '8a1372a9-2023',
  '발전소 데이터에서 이상 패턴 탐지 방법을 이용한 고장시점 예측 및 원인 탐지',
  ARRAY['김영현', '외 3인'],
  'conference',
  false,
  '한국정보과학회 KSC2023 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2023,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '58a913ee-0c1e-4156-9f57-32e5ba75d500',
  '3b608726-2024',
  'AI 레시피 기반 자율재배를 위한 통합 데이터 관리 체계와 재배 시스템 설계 및 구현',
  ARRAY['송유진', '외 2명'],
  'conference',
  false,
  '한국통신학회 2024년도 동계종합학술발표 회 (한국통신 학회)',
  2024,
  1,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '95f26638-deed-4052-a228-62d154c9ccc2',
  'daf4edd5-2024',
  '딥러닝 기반 객체 탐지를 활용한 버섯 병해충 예측 시스템',
  ARRAY['남민지', '외 4명'],
  'conference',
  false,
  '한국정보과학회 KCC2024 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2024,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b1ac1795-89ad-4931-9479-48fb4e7af0c7',
  'ac0fad96-2024',
  '배추 종자의 발아예측을 위한 딥러닝 모델 성능비교',
  ARRAY['이민재', '외 5명'],
  'conference',
  false,
  '한국정보과학회 KCC2024 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2024,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7c5b3483-c63b-4cd4-a58b-4bef42892c6b',
  'protac-2024',
  '워헤드-링커-앵커 조합 최적화를 통한 PROTAC 설계 자동화 알고리즘',
  ARRAY['정연주', '외 2명'],
  'conference',
  false,
  '한국정보과학회 KCC2024 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2024,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5ee80d67-83af-438b-a375-f575befd63e0',
  '643fef93-2024',
  'XAI를 활용한 BERT 기반 유해사이트 분류 모델의 신뢰성 검증 기법 (우수논문상 수상)',
  ARRAY['손진혁', '외 4명'],
  'conference',
  false,
  '한국정보과학회 KCC2024 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2024,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '181a83f2-5925-456d-a251-4262e3e87c91',
  'd76a1c35-2024',
  '제로샷 객체 탐지 모델과 경로 최적화를 통한 생활 폐기물 수거 효율화 시스템 (우수발표논문상)',
  ARRAY['정연주', '외 6인'],
  'conference',
  false,
  '한국정보과학회 KSC2024 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2024,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'de342c4e-9232-419d-8a6a-00e63f0c579c',
  'c4ebea4d-2024',
  '시계열 분석을 통한 차량 OBD 센서 데이터 고장 예측',
  ARRAY['이관희', '김영국'],
  'conference',
  false,
  '한국정보과학회 KSC2024 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2024,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '83e7c3cd-ee9d-48a6-b548-68afb48bc09f',
  'f9513296-2024',
  '항만 물류 환경에서 이미지 향상 및 복원 기법을 활용한 컨테이너 ID 자동 인식 성능 향상',
  ARRAY['황민', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KSC2024 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2024,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a33adf65-33d4-40e5-8b7e-f3edf8d49687',
  '623b15c8-2024',
  '모바일 게임 어플리케이션 리뷰의 분석 자동화: 토픽 모델링과 감성 분석을 통한 시장 동향 파악',
  ARRAY['임세빈', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KSC2024 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2024,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd7bc9529-1473-45d4-832e-7f66c37a5f0c',
  '15f21962-2024',
  '딥러닝 기반 횡단보도 및 과속방지턱 인식 및 훼손여부 탐지',
  ARRAY['이동현', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KSC2024 (한국소프트웨어 종합학술대회) (한국정보 과학회)',
  2024,
  12,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '18712757-5247-49a4-bcec-1ff49e5b15fb',
  'contextual-protein-function-interpretation-via-structur-2025',
  'Contextual Protein Function Interpretation via Structure-Guided Annotation and Large Language Model Integration',
  ARRAY['이상운', '외 5명'],
  'conference',
  false,
  '2025년 한국구조생물학회 하계연례학술대회 (한국구조 생물학회)',
  2025,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8f93e3ed-e3a5-48fb-b9b3-94809cea68dc',
  'structure-based-deep-learning-design-of-dual-target-inh-2025',
  'Structure-Based Deep Learning Design of Dual-Target Inhibitor Candidates for Galactosemia',
  ARRAY['윤윤기', '외 5명'],
  'conference',
  false,
  '2025년 한국구조생물학회 하계연례학술대회 (한국구조 생물학회)',
  2025,
  6,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '80d3308f-3f37-449e-b716-51718e28db07',
  'gnn-protac-2025',
  'GNN 기반 PROTAC 링커 길이 예측',
  ARRAY['정연주', '외 4인'],
  'conference',
  false,
  '한국정보과학회 KCC2025 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2025,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3224836d-a0e2-415f-9c35-a4ad98b92e09',
  'rna-trna-2025',
  'RNA 언어모델 프롬프트 튜닝을 통한 tRNA 서열 생성 및 평가',
  ARRAY['이상운', '외 3인'],
  'conference',
  false,
  '한국정보과학회 KCC2025 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2025,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'de2113d8-2307-4433-afb3-455335a7b0c2',
  'smiles-molecular-attention-transformer-2025',
  'SMILES 증강을 이용한 Molecular Attention Transformer 기반 고리형 펩타이드의 세포막 투과성 예측 모델 성능 향상',
  ARRAY['윤윤기', '외 3인'],
  'conference',
  false,
  '한국정보과학회 KCC2025 (한국컴퓨터종합 학술대회) (한국정보 과학회)',
  2025,
  7,
  NULL,
  NULL, NULL, ARRAY[]::text[], NULL, false
);

-- ═══ PATENTS (99건) ═══

INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c6967417-bbca-4074-a3ad-a266b0a3392d',
  'fe215f9a-1999',
  '안전기억장치를 이용한 로그가 필요 없는 주기억장치 상주 형 데이터베이스 회복기법',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  1999,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a351086e-aaf4-433a-a6d0-65b90580f748',
  'ff8e7867-2000',
  '주기억장치 상주형 데이터베 이스시스템에서 로그처리를 하지 않은 백업/회복 장치 및 그 방법',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-0365891)',
  2000,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '15a9fb6e-e1b6-4b93-b5ce-e7330edf930a',
  '00c0b1b6-2008',
  '유비쿼터스 모바일 오브젝트의 자 원 추천 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2008,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '35a92c7e-1e79-4977-80be-ebe5cc20b01a',
  'f5312e4e-2010',
  '에이전트 기반의 개인화된 멀티미디어 주크박스 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2010,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '609401f9-a717-4d7e-9f9c-e46a5384bcf0',
  'c0d2bd7e-2011',
  '계층구조 기반 송배전 시뮬레이터',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2011,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cadbabcf-06f7-4620-9e18-109eb012d262',
  'f68b6e97-2012',
  '에이전트 기반의 개인화된 멀티미디어 주크박스 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1111086)',
  2012,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3d535e81-e6f9-490d-86ef-e1e470686d84',
  '4b397ea4-2012',
  '실시간 무인첩보기 영상 시 뮬레이터와 훈련시뮬레이션의 연동방법 및 그 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2012,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0a03e550-af26-4088-8840-0af9333ab9dd',
  'uav-training-simulator-and-the-real-time-simulatio-2013',
  'UAV training simulator and the real-time simulation method and system for interworking',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1236195)',
  2013,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '093e2cd7-3008-4e9e-a61c-e3f949551405',
  'diaperchangemonitoring-system-2013',
  'Diaperchange_monitoring system',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2013,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '38a1de71-05a3-49d3-8f9b-2f2c7e2d20f5',
  'themethodandsy-2015',
  '공동체 구성원 간의 자산과 재능의 상호 기부 지원방법 및시스템(themethodand_system for supporting mutualdonationofcommunity member''s assets_and_talents)',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '03faddd4-d2bd-4c64-8450-517793dd19ad',
  'identificationmodule-trackingsystemusing-broadcas-2015',
  'IDENTIFICATION_MODULE TRACKINGSYSTEMUSING BROADCASTINGFUNCTIONOFBLUETOOTH',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '51e1442d-0cc1-4c02-a791-5712bb5a0e00',
  'wi-fi-authenticationsystem-thatutilizes-a-beacon-2015',
  'WI-FI AUTHENTICATIONSYSTEM THAT_UTILIZES A BEACON',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '783f1572-15cd-4632-9d87-b3f87a96f94b',
  'diaper-change-monitoring-system-2015',
  'Diaper change monitoring system',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1531280)',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f3ccd84c-ed3c-457d-b56d-6b4f782bdd12',
  'context-aware-personalized--dynamic-interface-syst-2016',
  'CONTEXT-AWARE PERSONALIZED- DYNAMIC INTERFACE SYSTEM APPLYING SLIDING WINDOW MODEL IN MOBILE ENVIRONMENT',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e49bd1cc-1cc0-457b-a2d0-30de64c689d3',
  'context-aware-personalized-bus-information-system-2016',
  'Context-Aware Personalized Bus Information System based on Beacon',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a6b22fc6-17bd-4526-8e27-73202c833f2b',
  'digitalphoto-frame-system-with-remotecontentmanage-2016',
  'Digitalphoto frame system with remotecontentmanagement',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '82fcacda-faf3-4f32-86a1-27feb70b3b3a',
  'golfpractice-systemfor-swing-posture-analysis-and-2016',
  'GOLF_PRACTICE SYSTEMFOR SWING POSTURE ANALYSIS AND CALIBRATION',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b3ef1817-d271-4627-a7d1-699214da51fe',
  'context-aware-personalized-dynamic-interface-syste-2016',
  'CONTEXT-AWARE PERSONALIZED DYNAMIC INTERFACE SYSTEM APPLYING SLIDING WINDOW MODEL IN MOBILE ENVIRONMENT',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1690052)',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a403a602-ca6a-4761-8659-b463f919fbc0',
  'hlarti-dbms-2017',
  '데이터 모델 변환을 통한HLA/RTI 연동데이터의 DBMS자동 저장및분석방법',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '11aa6331-a4c2-45f6-a64e-2f861cc8fb81',
  'a-smart-vending-machine-system-2017',
  'A SMART VENDING MACHINE-SYSTEM',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4d916d9f-b206-4fe6-b9ce-7256285a008d',
  'a-context-aware-personalized-service-system-for-ve-2017',
  'A CONTEXT AWARE PERSONALIZED SERVICE SYSTEM FOR VENDING MACHINE',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '51280a41-73d6-4210-a91a-3147e7e781b5',
  'identification-module-tracking-system-using-broadc-2017',
  'IDENTIFICATION MODULE TRACKING SYSTEM USING BROADCASTING FUNCTION OF BLUETOOTH',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '46d1d649-4742-4002-bf87-fc51ef66f8fb',
  'the-method-a-2017',
  '공동체 구성원 간의 자산과 재능의 상호 기부 지원 방 법 및 시스템(the method and system for supporting mutual donation of community member''s assets and talents)',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1737500)',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '83a1f00a-e659-4192-bc40-3eefb6ff0ebd',
  'digital-photo-frame-system-with-remote-content-man-2017',
  'Digital photo frame system with remote content management',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1737505)',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a8b27f3c-d5b2-4296-9673-ab1161416734',
  '83730b97-2018',
  '침대와 연동하는 헬스케어 시스템 및 방법',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fc6e5797-6d42-40ce-a097-bf90f929cfaa',
  'disaster-prevention-system-to-which-pressure-senso-2018',
  'DISASTER PREVENTION SYSTEM TO WHICH PRESSURE SENSOR REGISTER, SENSOR ADAPTIVE HUMAN BODY DETECTION TECHNOLOGY IS APPLIED',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1833647)',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bbc1d25a-13c0-4e56-af83-42307a8f43eb',
  'golf-practice-system-for-swing-posture-analysis-an-2018',
  'GOLF PRACTICE SYSTEM FOR SWING POSTURE ANALYSIS AND CALIBRATION',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-1889617)',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '2a1edb74-a386-4d22-aa88-29fbb0fcd9a7',
  'aaaa6a09-2018',
  '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 관리시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'eb98a0a8-4472-4c85-a87d-b8a9933ad04b',
  'cb9a4a11-2018',
  '이미지인식기술을이용한기포감지장치및 ュ 방법',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '853c383e-1e89-41d8-819e-e847983cf611',
  '4ce35e92-2019',
  '음성인식과 게임 콘텐츠를 활용한 언어 학습 시 스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-2012096)',
  2019,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '954c1062-4b0e-4624-8492-a296bbe34e3c',
  '425f9845-2021',
  '이미지 인식 기술을 이용한 기포 감지 장치 및 그 방법',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-2208507)',
  2021,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a463d351-bb0f-4bc1-9446-90a5712894d6',
  'cced25c7-2022',
  '스마트 금고 인증 방법 및 이를 이용한 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2022,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9945489d-c5ce-4a19-9da5-043393e29cb3',
  '3cd97058-2023',
  '개인화된 차량 고장 예측 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2023,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '56f4168d-ac43-423c-9105-6b294c947248',
  '18253af2-2023',
  '이미지를 이용한 인공지능 기반의 대마 기능성분 예측시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2023,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7d1a731f-e1a5-40f9-aef0-9d3bd33ffcfe',
  'a8bc7a8d-2023',
  '고객 맞춤형 향수 추천 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2023,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3cb16702-a35c-4884-8084-54056092afa2',
  'd483da7d-2024',
  '딥러닝 기반 차량 고장 징후 감지 를 통한 조치 방안 제공 서비스',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e8c22106-c63f-42e2-a7a3-786ea638667f',
  '66a9aa49-2024',
  'AI융합혁신인재양 성사업 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7ae4ee65-db85-4772-aea2-b0caa366f1ac',
  'b17eadc4-2024',
  'AI융합혁신인재양성지원사업 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-2668501)',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '70e627c5-da5d-49bf-948f-c6df5b87bdea',
  '7e0a6587-2024',
  'LINC+사업단 과제 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-2683996)',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '03b91925-6c73-42f5-84f1-bfd7c65d7311',
  'd6d0caf5-2024',
  'AI융합혁신인재양성지원사업 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '49e7848a-5cae-42b4-a9cf-40d72562f456',
  'a6746fce-2024',
  'AI융합혁신인재양성지원사업 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '49c15c1c-8167-444b-866b-6d92c1ca8a54',
  '7f32ffc6-2024',
  'AI융합혁신인재양성지원사업 성과물?',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-2730477)',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'aafbf149-6240-41e4-9c1e-c901204a8e92',
  'ba18e450-2025',
  'AI융 합연구센터지원사업 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허등록 (10-2842365)',
  2025,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'bb1e2ea5-8bb0-4129-9a3d-497f35a4c6b6',
  '594c59ca-2025',
  'AI융합혁신인재양성지원사업 성과물',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2025,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b57a4176-45b2-4e63-b108-cb0e8fbdab16',
  '163f2c94-2000',
  '로열티 시스템의 시스템 제공자',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2000,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '6af92b6b-bc4c-4ec2-af48-9606c0dd13bb',
  '77e224bc-2008',
  '모바일 환경에서의 멀티미디어 컨텐츠 자동관리 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2008,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'a8880430-01f2-49a3-bdb1-2feea85a8649',
  '96551b78-2009',
  '디스크 및 메모리기반 데이터베이스 동시성 제어 시뮬레이 터',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2009,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b9105c2a-fc21-4a68-8044-49c186ceff0d',
  '499c587c-2016',
  '상황인지 기반 모바일 환경에서 슬라이딩 윈도우 모델을 적용한 개 인화된 동적 인터페이스 제공 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c36636ab-9c11-450e-8005-9c338d8413e7',
  '1271b17b-2016',
  '상황인지 맞춤형 버스 정보 제공 앱',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b0147106-de37-46ac-8b52-05e1a6e7c616',
  '9a508c93-2016',
  '원격으로 콘텐츠 제어가 가능한 디지털 액자 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b5214824-7c4f-4b82-b1d8-e25ae7aa9ab5',
  'c515e483-2016',
  '스마트자판기 시뮬레이터와 이를 위한 어 플리케이션',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e8ef2f3b-ad85-49e2-bdb6-ce0a28ee1e06',
  '205c6c01-2016',
  '융합형 센서기술을 적용한 난간추락 위험 감지 및 알림 프로그램',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '924b3cf4-191f-45ab-b7da-885528acc3f6',
  'b50e4fec-2016',
  '융합형 센서 기술을 적용한 독거노인 모니터링 프로그램',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0ebe7a86-7ae0-47f7-b974-16d18d500b7e',
  'b614b074-2017',
  'HLA/RTI(에이치엘에이/알티아이)을 이용한 분산 시뮬레이션 연동 환경을 위한 데이터 관리 도구',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fe7caf5d-e7cf-4703-9c70-e2d923813f40',
  '2e0713c3-2017',
  '일라이트 기능성 침대와 연동하는 IoT(사물인터넷) 기반의 헬스케어 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e9bf23c1-f80a-4ce6-b044-db16309bc598',
  'drone-sim-fighter-2017',
  'Drone Sim Fighter(드론 심 파이터)',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ae738908-761a-4328-aea8-a645f795d1b8',
  '1f929fc9-2018',
  '팩트 지식베이스에 기반한 가짜뉴스 판별 시스템',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b0277624-14e4-4c9b-b6a0-78b1fe56fb52',
  'a8242ca4-2018',
  '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 출력 도구',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ac0e9019-b638-405a-ad7c-94569b5eb496',
  'e580bb11-2018',
  '자동차용 능동소음제어 시스템 튜닝을 위한 실시간 데이터 입력 도구',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4cc5f132-504f-4651-baa7-b3cbc9905546',
  '1d60047b-2018',
  '이미지 인식기술을 이용한 혈액 주입시 발생하는 기포감지 프로그램',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f6082ab0-a911-4162-82b5-3eb0e4ec1228',
  'd33f8707-2023',
  '딥러닝 기반 어린이 학습지 손글씨 답안 자동 채점 프로그 램',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2023,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '4accd5a3-5905-4754-aa77-136ec8a322a5',
  '95ede247-2023',
  '딥러닝 기반 식품 이미지 인식을 통한 당뇨병 환자 대상 식품 영양정보 제공 프로그램',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2023,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '97bd6f0d-754b-4bda-8bea-77a82a3670a7',
  '2012-12-5-2011-2012',
  '一 2012년 12월 5일 중소기업청장상 수상: (주)모비다임과의 2011년 ''산학연 공동기술 개발사업'' 과제가 ''R&D 및 사업화우수과제'' 부문에서 최우수 과제로 선정됨.',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2012,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '72abde2f-7d2b-434b-868f-ec05510fc79f',
  '73552015-2014',
  '2014년 6월 26일 한국정보과학회 공로상',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2014,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '009d46e9-1993-400a-aa68-904d3a33fbee',
  '2014-12-24-20-2014',
  '2014년 12월 24일 대전광역시 제20회 경제과학대상 (산학협동부문) 수상',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2014,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'e0e7fc70-3444-4731-9ccd-99d82fa6d7d3',
  'c06131d1-2015',
  '2015년 1월 2일 충남대학교 총장 표창장',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f6eb7d36-3043-4ea1-a64c-bc7a7c382031',
  '2016-1-18-20-bigcomp2016-best-presentation-awar-2016',
  '2016년 1월 18-20일 BigComp2016 Best Presentation Award',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '31d27151-1dd6-4c6f-b41e-77028c8064da',
  'be4c092f-2017',
  '2017년 6월 18일 한국정보과학회 데이터베이스 소사이어티 공로상',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '03d0ada6-5b0e-4c75-a53d-dd4c75c5af2f',
  '2019-5-10-ieee-transportation-electrification-c-2019',
  '2019년 5월 10일 IEEE Transportation Electrification Conference (ITEC2019) Best Presentation Award',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2019,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '1d10fd6b-ab4a-4505-9b29-190b1a57bb07',
  'd36519a4-2023',
  '2023년 4월 29일 한국스마트미디어학회 종합학술대회 우수논문상 수상',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2023,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '430282f9-758a-4ab6-b696-01768d82c17d',
  '2024-2-19-2023-cnu-2024',
  '2024년 2월 19일 "2023년도 CNU(충남대학교) 우수연구자" 선정',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '16df2867-90c0-4432-8cf3-3ed369fe300d',
  '2024-6-28-kcc2024-2024-12-18-2024',
  '2024년 6월 28일 KCC2024 우수논문상 수상 2024년 12월 18일 과기정통부 장관 표창 (제24-04044호)',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2024,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'fb12e813-77e3-4f62-9def-456149f622ac',
  '9e4757ba-2013',
  '2013년 4건 (두레텍 2건',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2013,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '18b153fb-b084-4e64-a53b-95c72bd3a78c',
  '8bad6b79-2014',
  '2014년 2건 (이언텔 1건',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2014,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'f5cb0e5d-3fad-4a4c-9926-b8f9b9685cc4',
  '6a02245a-2015',
  '2015년 4건 (모비다임 3건',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '3d141458-14ac-4e51-bca4-0f9047df75d6',
  'd9156adf-2016',
  '2016년 2건 (라이즈글로벌 2건)',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '9586470b-79c5-4007-befd-78e76037741a',
  'b79ddae7-2017',
  '2017년 1건 (모비다임 1건)',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2017,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8e62592d-f95c-408f-850f-7aa88d383b5b',
  '7a31ab2f-2019',
  '2019년 1월 2건 (모비다임',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2019,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'c5d25b77-bf2e-4c78-b348-2a899cf2dda5',
  '67e37356-2018',
  '2018년 3월 28일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '42c27b4d-5b5e-489a-aeb3-9a395e936b51',
  '212493ea-2020',
  '2020년 1월 30일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2020,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'b25d4bf7-9045-4690-bd34-65d281721163',
  '9c629425-2020',
  '2020년 3월 18일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2020,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8e2b17af-5e78-4c5e-b502-0b5a47a7c644',
  'a5392983-2020',
  '2020년 4월 2일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2020,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '0e075c11-d8bb-4779-a3d0-d67e46c8e2b1',
  'b9953700-2021',
  '2021년 8월 31일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2021,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cca4205e-b856-49f2-9b93-ccf3184f1304',
  '2021-12-17-2021',
  '2021년 12월 17일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2021,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '285ee8e8-7883-4495-bcaa-9c7d064a6b8d',
  '8c8255a8-2022',
  '2022년 5월 27일',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2022,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '7c12e6d1-58c1-4bfe-829e-4b4ff1305626',
  'cd9290a3-2013',
  'LINC사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2013,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'def6cca4-4e53-4bc5-86d5-5856156ab84e',
  'f6ba24c4-2013',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2013,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'ea4f28a2-423d-4e65-a7fd-f611e795b92c',
  'ca113ba3-2013',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2013,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '59b65ebd-eebc-46e5-a7c0-0e9ebb3a5b59',
  '83e96f9a-2014',
  'LINC사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2014,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '5afc52d8-5dcc-43ea-baf2-ea3d373f4200',
  'bea3086a-2014',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2014,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '38517004-7b4b-4266-abfc-159996212f10',
  '3d446554-2015',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'd768707b-3400-40b2-9369-ec7b3822500a',
  'd193e8e8-2015',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '24a93e88-9ec0-4ddb-9f9f-27237567fc16',
  'fcfb9e7f-2015',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2015,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  'cc87a89f-14de-4397-8d15-e5b82f1694c0',
  '38ffddc2-2016',
  'LINC사업단 애로기술지원사업',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '430abf2c-878f-46aa-a8db-95c2f740e1c6',
  '38673c3d-2016',
  'LINC사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2016,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '705af203-cc24-41f6-b9fb-ca94dc069479',
  '6451e36d-2018',
  'LINC+사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '26288f6c-e6b3-4854-80cb-f2dc32aaea85',
  'c3386f6e-2018',
  'LINC+사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2018,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '32c0149d-f14b-4859-bc7f-c1ba8f6cd04a',
  '73a1cad8-2019',
  'LINC+사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2019,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
INSERT INTO publications (id, slug, title, authors, type, is_international, venue, year, month, doi, pdf_url, abstract, keywords, bibtex, is_featured) VALUES (
  '8b66c0b9-4b58-48e0-a650-afb1956efd4e',
  'd4d0eee3-2020',
  'LINC+사업단 기술지도과제 수행',
  ARRAY['김영국'],
  'patent',
  false,
  '특허출원',
  2020,
  NULL,
  NULL, NULL, NULL, ARRAY[]::text[], NULL, false
);
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
