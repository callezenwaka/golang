package main

import (
	"fmt"
	"os"
	"strings"
)

type Bill struct {
	name string
	items map[string]float64
	tip float64
}

func dottedLine(label string, width int) string {
	numDots := width - len(label)
	if numDots < 0 {
		numDots = 0
	}
	return label + strings.Repeat(".", numDots)
}

// make new bills
func newBill(name string) Bill {
	bill := Bill{
		name: name,
		items: map[string]float64{"Pie": 3.99, "Coffee": 2.49, "Sandwich": 5.99, "Cake": 4.99},
		tip: 0,
	}

	return bill;
}

func (bill Bill) format() string {
	const width = 25
	format_str := fmt.Sprintf("Bill for %s\n", bill.name)
	var total float64 = 0;

	for k, v := range bill.items {
		line := dottedLine(k+":", width)
		format_str += fmt.Sprintf("%v$%v \n", line, v);
		total += v;
	}

	format_str += fmt.Sprintf("%s$%.2f", dottedLine("\ntip:", width), bill.tip);
	total += bill.tip;
	// formatStr += fmt.Sprintf("%s$%.2f", dottedLine("\ntotal:", width), total)
	format_str += fmt.Sprintf("%-25v $%0.2f", "\n\ntotal: ", total)

	return format_str;
}

// update tip
func (bill *Bill) updateTip(tip float64) {
	bill.tip = tip;
}

// add an item to the bill
func (bill *Bill) addItem(name string, price float64) {
	bill.items[name] = price;
}

// save bill
func (bill *Bill) save() {
	data := []byte(bill.format());

	err := os.WriteFile("bills/"+bill.name+".txt", data, 0644);

	if err != nil {
		panic(err);
	}

	fmt.Printf("Bill with name %s saved successfully\n", bill.name);
}