package main

import (
	"fmt";
	"time"
)

func sendMail(message string) {
	go func() {
		time.Sleep(time.Millisecond * 250);
		fmt.Printf("Email received %s at '%s'\n", message, time.Now().Format(time.RFC1123));
	}()

	fmt.Printf("Email %s sent at '%s'\n", message, time.Now().Format(time.RFC1123));
}

func main() {
	fmt.Println("Concurrency");
	// sendMail("Hello, Jane!")
	var messages = []string{"Hello, World!", "How are you?", "Goodbye!"};
	for _, msg := range messages {
		sendMail(msg);
	}
}
