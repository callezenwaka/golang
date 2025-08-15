-- +goose Up
ALTER TABLE feeds
ADD COLUMN description TEXT,
ADD COLUMN image_url TEXT;

-- +goose Down
ALTER TABLE feeds
DROP COLUMN description,
DROP COLUMN image_url;