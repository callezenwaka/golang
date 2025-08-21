package main

import (
	"fmt"
	"net/http"
	"time"
)

func events(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream");
    w.Header().Set("Cache-Control", "no-cache");
    w.Header().Set("Connection", "keep-alive");
    w.Header().Set("Access-Control-Allow-Origin", "*");

	tokens := []string{"this", "is", "a", "live", "event", "test", "from", "gdg", "hull", "2025"};

	for _, token := range tokens {
		content := fmt.Sprintf("data: %s\n\n", string(token));
		w.Write([]byte(content));
		w.(http.Flusher).Flush(); // Ensure the response is flushed to the client

		time.Sleep(time.Millisecond * 420);
	}
}

func serveTyper(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, "typer.html")
}

func main() {
    fmt.Println("Realtime Typer Server started on :8080")
    // Register the events handler
    http.HandleFunc("/events", events)
    
    // Register the HTML file handler for the root path
    http.HandleFunc("/", serveTyper)
	http.ListenAndServe(":8080", nil);
}
