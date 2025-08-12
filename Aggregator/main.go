package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// project 1 - RSS Aggregator
	
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file from the parent directory")
	}

	PORT := os.Getenv("PORT")
	if PORT == "" {
		log.Fatal("PORT environment variable is not set!")
	}

	fmt.Printf("Server is running on port %s\n", PORT)
}