package main

import (
	"net/http"
)

func handlerPing(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusOK, map[string]string{"status": "ok"});
}