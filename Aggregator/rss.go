package main

import (
	"encoding/xml"
	"io"
	"net/http"
	"time"
)

type RSSFeed struct {
    XMLName xml.Name `xml:"rss"`
    Channel struct {
        Title       string `xml:"title"`
        Link        string `xml:"link"`
        Description string `xml:"description"`
        Language    string `xml:"language"`
        Items       []RSSItem `xml:"item"`
    } `xml:"channel"`
}

type RSSItem struct {
    Title       string `xml:"title"`
    Link        string `xml:"link"`
    Description string `xml:"description"`
    PubDate     string `xml:"pubDate"`
    // Add the media:thumbnail field with the correct XML tag
    MediaThumbnail struct {
        URL string `xml:"url,attr"`
    } `xml:"thumbnail"`
}

func urlFeed(url string) (RSSFeed, error) {
	httpclient := http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := httpclient.Get(url);
	if err != nil {
		return RSSFeed{}, err;
	}
	defer resp.Body.Close();

	data, err := io.ReadAll(resp.Body);
	if err != nil {
		return RSSFeed{}, err;
	}
	rssFeed := RSSFeed{};

	err = xml.Unmarshal(data, &rssFeed);
	if err != nil {
		return RSSFeed{}, err;
	}
	return rssFeed, nil;
}