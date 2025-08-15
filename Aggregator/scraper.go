package main

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/callezenwaka/golang/Aggregator/internal/database"
)


func startScraping(db *database.Queries, concurrency int, timeBetweenRequest time.Duration) {
	log.Printf("Scraping on %v goroutines every %s duration", concurrency, timeBetweenRequest);
	ticker := time.NewTicker(timeBetweenRequest);
	for ; ; <-ticker.C {
		feeds, err := db.GetNextFeedToFetch(context.Background(), int32(concurrency));
		if err != nil {
			log.Printf("Error fetching feeds: %v", err);
			continue;
		}

		wg := &sync.WaitGroup{};
		for _, feed := range feeds {
			wg.Add(1);
			go scrapeFeed(db, wg, feed);
		}
		wg.Wait();
	}
}

func scrapeFeed(db *database.Queries, wg *sync.WaitGroup, feed database.Feed) {
	defer wg.Done();

	_, err := db.MarkFeedAsFetched(context.Background(), feed.ID);
	if err != nil {
		log.Printf("Error marking feed as fetched: %v", err);
		return;
	}

	rssFeed, err := urlFeed(feed.Url);
	if err != nil {
		log.Printf("Error fetching RSS feed: %v", err);
		return;
	}

	for _, item := range rssFeed.Channel.Items {
		log.Printf("Fetched item, %s, on feed %s", item.Title, feed.Title);
	}
	log.Printf("Feed %s collected, %v posts found", feed.Title, len(rssFeed.Channel.Items));
}