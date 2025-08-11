package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
);

func getInput(prompt string, newReader *bufio.Reader) (string, error) {
	fmt.Print(prompt);

	input, err := newReader.ReadString('\n');
	
	return strings.TrimSpace(input), err;
}

func createBill() Bill {
	reader := bufio.NewReader(os.Stdin);

	// fmt.Print("Create a new bill name: ");
	// name, _ := reader.ReadString('\n');
	// name = strings.TrimSpace(name);

	name, _ := getInput("Create a new bill name: ", reader);

	bill := newBill(name);
	fmt.Printf("Created the bill for %v\n", bill.name);

	return bill;
}

func promptOptions(bill Bill) {
	reader := bufio.NewReader(os.Stdin);

	opt, _ := getInput("Choose option (a - add item, s - save bill, t - add tip): ", reader);
	
	switch opt {
	case "a":
		fmt.Println("Adding an item to the bill...");
		itemName, _ := getInput("Enter item name: ", reader);
		price, _ := getInput("Enter item price: ", reader);

		p, err := strconv.ParseFloat(price, 64);
		if err != nil {
			fmt.Println("The price is not a valid number.");
			promptOptions(bill);
		}

		bill.addItem(itemName, p);
		fmt.Printf("Adding the item %v with price %v to the bill...\n", itemName, price);

		promptOptions(bill);
	case "s":
		bill.save();
		fmt.Println("Saving the bill... - ", bill.name);
	case "t":
		fmt.Println("Adding a tip...");
		tip, _ := getInput("Enter tip amount($): ", reader);

		t, err := strconv.ParseFloat(tip, 64);
		if err != nil {
			fmt.Println("The tip is not a valid number.");
			promptOptions(bill);
		}

		bill.updateTip(t);
		fmt.Println("Adding tip: ", "$" + tip);

		promptOptions(bill);
	default:
		fmt.Println("Invalid option.");
		promptOptions(bill);
	}

	fmt.Println(opt);
}

func main() {
	// struct
	my_bill := createBill();

	promptOptions(my_bill);

	fmt.Println(my_bill.format());

	// update bill
	// my_bill.updateTip(2.50);
	// fmt.Println(my_bill.format());

	// my_bill.addItem("Salad", 4.99);
	// my_bill.addItem("Soda", 1.99);
	// my_bill.addItem("Fries", 2.49);
	// my_bill.addItem("Soup", 3.49);
	// fmt.Println(my_bill.format());
}