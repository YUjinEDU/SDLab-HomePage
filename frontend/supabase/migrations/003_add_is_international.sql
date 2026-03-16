-- publications 테이블에 국제/국내 구분 컬럼 추가
ALTER TABLE publications
  ADD COLUMN is_international boolean NOT NULL DEFAULT true;

-- 기존 인덱스 보완
CREATE INDEX idx_publications_international ON publications(is_international);
