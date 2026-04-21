ALTER TABLE announcements ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS announcement_attachments (
  id serial PRIMARY KEY,
  announcement_id integer NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  uploaded_at timestamp NOT NULL DEFAULT now()
);
