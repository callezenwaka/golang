package main

import (
	"time"

	"github.com/callezenwaka/golang/Aggregator/internal/database"
	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	APIKey    string    `json:"api_key"`
}

func databaseUserToUser(dbUser database.User) User {
	return User{
		ID:        dbUser.ID,
		Name:      dbUser.Name,
		Email:     dbUser.Email,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
		APIKey:    dbUser.ApiKey,
	}
}

type Feed struct {
	ID        uuid.UUID `json:"id"`
	UserID   uuid.UUID `json:"user_id"`
	Title    string    `json:"title"`
	Description  string    `json:"description"`
	Url      string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func databaseFeedToFeed(dbFeed database.Feed) Feed {
	return Feed{
		ID:        dbFeed.ID,
		UserID:   dbFeed.UserID,
		Title:    dbFeed.Title,
		Description:  dbFeed.Description,
		Url:      dbFeed.Url,
		CreatedAt: dbFeed.CreatedAt,
		UpdatedAt: dbFeed.UpdatedAt,
	}
}

func databaseFeedsToFeeds(dbFeeds []database.Feed) []Feed {
	feeds := []Feed{};
	for _, dbFeed := range dbFeeds {
		feeds = append(feeds, databaseFeedToFeed(dbFeed));
	}

	return feeds;
}

type FeedFollow struct {
	ID        uuid.UUID `json:"id"`
	UserID   uuid.UUID `json:"user_id"`
	FeedID   uuid.UUID `json:"feed_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func databaseFeedFollowToFeedFollow(dbFeedFollow database.FeedFollow) FeedFollow {
	return FeedFollow{
		ID:        dbFeedFollow.ID,
		UserID:   dbFeedFollow.UserID,
		FeedID:   dbFeedFollow.FeedID,
		CreatedAt: dbFeedFollow.CreatedAt,
		UpdatedAt: dbFeedFollow.UpdatedAt,
	}
}

func databaseFeedFollowsToFeedFollows(dbFeedFollows []database.FeedFollow) []FeedFollow {
	feedFollows := []FeedFollow{};
	for _, dbFeedFollow := range dbFeedFollows {
		feedFollows = append(feedFollows, databaseFeedFollowToFeedFollow(dbFeedFollow));
	}
	
	return feedFollows;
}