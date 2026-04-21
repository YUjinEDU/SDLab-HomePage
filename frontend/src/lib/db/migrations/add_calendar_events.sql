CREATE TABLE IF NOT EXISTS calendar_events (
  id serial PRIMARY KEY,
  title text NOT NULL,
  start timestamptz NOT NULL,
  "end" timestamptz,
  all_day boolean NOT NULL DEFAULT false,
  color text NOT NULL DEFAULT '#059669',
  description text,
  author_id integer REFERENCES members(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
