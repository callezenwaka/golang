package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/callezenwaka/golang/Aggregator/internal/database"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	DB *database.Queries
}

func main() {
	
	err := godotenv.Load();
	if err != nil {
		log.Fatalf("❌ Error loading .env file: %v", err);
	} else {
		fmt.Println("✅ Success loading .env file");
	}

	databaseURL := os.Getenv("DATABASE_URL");
	if databaseURL == "" {
		fmt.Println("❌ DATABASE_URL environment variable is not set.");
	} else {
		fmt.Println("✅ DATABASE_URL environment variable is set.");
	}

	PORT := os.Getenv("PORT");
	if PORT == "" {
		log.Fatal("❌ PORT environment variable is not set!");
	} else {
		fmt.Printf("✅ Server is running on port %s\n", PORT);
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("❌ Error connecting to the database: %v", err)
	}
	defer db.Close()

	queries := database.New(db);

	apiconfig := apiConfig{
		DB: queries,
	};

	router := chi.NewRouter();

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter();
	v1Router.Get("/healthz", handlerPing);
	v1Router.Get("/err", handlerError);
	v1Router.Post("/users", apiconfig.handlerCreateUser);
	v1Router.Get("/users", apiconfig.middleware_auth(apiconfig.handlerGetUser));
	v1Router.Post("/feeds", apiconfig.middleware_auth(apiconfig.handlerCreateFeed));
	v1Router.Get("/feeds", apiconfig.handlerGetFeeds);
	router.Mount("/v1", v1Router);

	server := &http.Server {
		Addr: ":" + PORT,
		Handler: router,
	}

	err = server.ListenAndServe();
	if err != nil {
		log.Fatal(err);
	}
}