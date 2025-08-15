package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/callezenwaka/golang/Aggregator/internal/database"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func (apiconfig apiConfig) handlerCreateFeedFollow(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		FeedID   uuid.UUID `json:"feed_id"`
	}

	decoder := json.NewDecoder(r.Body);
	params := parameters{};
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Error parsing JSON: %v", err));
		return;
	}

	feed, err := apiconfig.DB.CreateFeedFollow(r.Context(), database.CreateFeedFollowParams{
		ID:        uuid.New(),
		UserID:   user.ID,
		FeedID:   params.FeedID,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	});

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error creating feed follow: %v", err));
		return;
	}

	respondWithJSON(w, http.StatusCreated, databaseFeedFollowToFeedFollow(feed));
}

func (apiconfig apiConfig) handlerGetFeedFollows(w http.ResponseWriter, r *http.Request, user database.User) {
	// Alternatively feedFollows, err := apiconfig.DB.GetFeedFollows(r.Context(), user.ID);
	feedFollows, err := apiconfig.DB.GetFeedFollows(r.Context(), database.GetFeedFollowsParams{
		UserID: user.ID,
		Limit:  10,
		Offset: 0,
	});
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error fetching feed follows: %v", err));
		return;
	}

	respondWithJSON(w, http.StatusOK, databaseFeedFollowsToFeedFollows(feedFollows));
}

func (apiconfig apiConfig) handlerDeleteFeedFollow(w http.ResponseWriter, r *http.Request, user database.User) {
	feedFollowIDStr :=chi.URLParam(r, "feedFollowID");
	feedFollowID, err := uuid.Parse(feedFollowIDStr);
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("unable to parse feedFollowID: %v", err));
		return;
	}

	err = apiconfig.DB.DeleteFeedFollow(r.Context(), database.DeleteFeedFollowParams{
		ID: feedFollowID,
		UserID: user.ID,
	});
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("unable to read the feed follow: %v", err));
		return;
	}

	// Alternatively respondWithJSON(w, http.StatusOK, struct{} {});
	respondWithJSON(w, http.StatusOK, feedFollowID);
}