package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/callezenwaka/golang/Aggregator/internal/database"
	"github.com/google/uuid"
)

func (apiconfig apiConfig) handlerCreateFeed(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		Title   string `json:"title"`
		Description string `json:"description"`
		Url     string `json:"url"`
	}

	decoder := json.NewDecoder(r.Body);
	params := parameters{};
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Error parsing JSON: %v", err));
		return;
	}

	feed, err := apiconfig.DB.CreateFeed(r.Context(), database.CreateFeedParams{
		ID:        uuid.New(),
		UserID:   user.ID,
		Title:    params.Title,
		Description:  params.Description,
		Url:      params.Url,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	});

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error creating feed: %v", err));
		return;
	}

	respondWithJSON(w, http.StatusCreated, databaseFeedToFeed(feed));
}

func (apiconfig apiConfig) handlerGetFeeds(w http.ResponseWriter, r *http.Request) {
	feeds, err := apiconfig.DB.GetFeeds(r.Context(), database.GetFeedsParams{
		// UserID: user.ID,
		Limit:  10,
		Offset: 0,
	});
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error fetching feeds: %v", err));
		return;
	}

	respondWithJSON(w, http.StatusOK, databaseFeedsToFeeds(feeds));
}