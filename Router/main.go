package main

import "fmt";

type Message struct {
	recipient string
	text      string
}

type Car struct {
	color string
}

func sendMessage(m *Message) {
	fmt.Printf("To: %v\n", m.recipient)
	fmt.Printf("Message: %v\n", m.text)
}

func (c *Car) setColor(color string) {
	c.color = color
}

func main() {
	// pointer
	sendMessage(&Message{"Alice", "Hello, Alice!"});
	sendMessage(&Message{"Bob", "Hello, Bob!"});
	sendMessage(&Message{"Charlie", "Hello, Charlie!"});

	// pointer receiver
	c := Car{color: "white"};
	c.setColor("blue");
	fmt.Printf("The car color is %v\n", c.color);
}
