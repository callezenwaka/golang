package main

import (
	"fmt"
	"net/http"

	"github.com/callezenwaka/golang/Aggregator/internal/auth"
	"github.com/callezenwaka/golang/Aggregator/internal/database"
)

type authHandler func(http.ResponseWriter, *http.Request, database.User);

func (apiconfig *apiConfig) middleware_auth(handler authHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		apiKey , err := auth.GetAPIKey(r.Header);
		if err != nil {
			respondWithError(w, http.StatusForbidden, fmt.Sprintf("Authentication error: %v", err));
			return;
		}

		user, err := apiconfig.DB.GetUserByApiKey(r.Context(), apiKey);
		if err != nil {
			respondWithError(w, http.StatusNotFound, fmt.Sprintf("User not found: %v", err));
			return;
		}

		handler(w, r, user);
	}
}