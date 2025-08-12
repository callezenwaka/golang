package main

import (
	"fmt"
	"sort"
	"sync"
	"time"
)

type safeCounter struct {
	counts map[string]int
	mux    *sync.Mutex
}

type Email struct {
	email string
	count int
}

func (sc safeCounter) inc(key string) {
	sc.mux.Lock();
	defer sc.mux.Unlock();
	sc.slowIncrement(key);
}

func (sc safeCounter) val(key string) int {
	sc.mux.Lock();
	defer sc.mux.Unlock();
	return sc.counts[key];
}

func (sc safeCounter) slowIncrement(key string) {
	tempCouter := sc.counts[key];
	time.Sleep(time.Millisecond);
	tempCouter++;
	sc.counts[key] = tempCouter;
}

func run(sc safeCounter, emails []Email) {
	mails := make(map[string]struct{});

	var wg sync.WaitGroup;

	for _, mail_to := range emails {
		mails[mail_to.email] = struct{}{};
		for i := 0; i < mail_to.count; i++ {
			wg.Add(1);
			go func(mail_to Email) {
				sc.inc(mail_to.email);
				wg.Done();
			}(mail_to);
		}
	}
	wg.Wait();

	emailsSorted := make([]string, 0, len(mails));
	for email := range mails {
		emailsSorted = append((emailsSorted), email);
	}
	sort.Strings(emailsSorted);

	for _, email := range emailsSorted {
		fmt.Printf("Email %s has %d\n", email, sc.val(email));
	}

	fmt.Println("<==========>Done<============>");
}

func main() {
	fmt.Println("Mutexes");

	sc := safeCounter {
		counts: make(map[string]int),
		mux: &sync.Mutex{},
	}

	run(sc, []Email{
		{
			email: "john@example.com",
			count: 23,
		},
		{
			email: "john@example.com",
			count: 29,
		},
		{
			email: "jill@example.com",
			count: 31,
		},
		{
			email: "jill@example.com",
			count: 67,
		},
	});

	run(sc, []Email{
		{
			email: "kaden@example.com",
			count: 23,
		},
		{
			email: "george@example.com",
			count: 126,
		},
		{
			email: "kaden@example.com",
			count: 31,
		},
		{
			email: "george@example.com",
			count: 453,
		},
	});
}
