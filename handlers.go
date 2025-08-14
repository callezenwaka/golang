package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/callezenwaka/golang/Aggregator/internal/database"
	"github.com/google/uuid"
)

func handlerReady(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusOK, map[string]string{"status": "ok"});
}

func handlerError(w http.ResponseWriter, r *http.Request) {
	respondWithError(w, http.StatusInternalServerError, "Internal Server Error.");
}

func (apiconfig apiConfig) handlerCreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	decoder := json.NewDecoder(r.Body);
	params := parameters{};
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Error parsing JSON: %v", err));
		return;
	}

	user, err :=apiconfig.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID: uuid.New(),
		Name: params.Name,
		Email: params.Email,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	});

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error creating user: %v", err));
		return;
	} else {
		respondWithJSON(w, http.StatusCreated, databaseUserToUser(user));
	}

	// respondWithJSON(w, http.StatusCreated, map[string]string{"status": "ok"});
}

func (apiconfig apiConfig) handlerGetUser(w http.ResponseWriter, r *http.Request, user database.User) {
	respondWithJSON(w, http.StatusOK, databaseUserToUser(user));
}