-- +goose Up
ALTER TABLE posts
ADD COLUMN guid TEXT UNIQUE,
ADD COLUMN author TEXT,
ADD COLUMN thumbnail_url TEXT;

-- +goose Down
ALTER TABLE posts
DROP COLUMN guid,
DROP COLUMN author,
DROP COLUMN thumbnail_url;