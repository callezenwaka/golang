-- +goose Up
-- Rename the 'title' column to 'name'
ALTER TABLE feeds RENAME COLUMN title TO name;

-- Drop the 'description' column
ALTER TABLE feeds DROP COLUMN description;

-- +goose Down
-- Revert the changes: Rename 'name' back to 'title'
ALTER TABLE feeds RENAME COLUMN name TO title;

-- Re-add the 'description' column. Since we have no data to restore,
-- it will be added as NULL by default.
ALTER TABLE feeds ADD COLUMN description TEXT;