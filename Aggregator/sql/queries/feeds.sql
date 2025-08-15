-- name: CreateFeed :one
INSERT INTO feeds (id, user_id, title, description, url, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetFeeds :many
SELECT * FROM feeds
-- WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $1
OFFSET $2;

-- name: GetNextFeedToFetch :many
SELECT * FROM feeds
ORDER BY last_fetched_at ASC NULLS FIRST
LIMIT $1;

-- name: MarkFeedAsFetched :one
UPDATE feeds
SET last_fetched_at = NOW()
WHERE id = $1
RETURNING *;