-- -- name: GetNextFeedToFetch :many
-- SELECT * FROM feeds
-- ORDER BY last_fetched_at ASC NULLS FIRST
-- LIMIT $1;

-- -- name: MarkFeedAsFetched :exec
-- UPDATE feeds
-- SET last_fetched_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
-- WHERE id = $1;

-- name: CreatePost :one
INSERT INTO posts (
    id, 
    feed_id, 
    title, 
    url, 
    description, 
    author,
    thumbnail_url,
    published_at, 
    guid,
    created_at, 
    updated_at
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;
--

-- name: GetPostsForUser :many
SELECT posts.* FROM posts
JOIN feed_follows ON feed_follows.feed_id = posts.feed_id
WHERE feed_follows.user_id = $1
ORDER BY posts.published_at DESC
LIMIT $2;
--