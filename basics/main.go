package main

import (
	"fmt"
	"math"
	"sort"
	"strings"
)

var score = 85;

type Shape interface {
	area() float64
	circumference() float64
}

type Square struct {
	side float64
}

type Circle struct {
	radius float64
}

type messageToSend struct {
	user    user
	message string
}

type user struct {
	name string
	phoneNumber  int
}

type auth struct {
	username string
	password string
}

func greet(name string) {
	fmt.Printf("Hello, %v!\n", name);
}

func bye(name string) {
	fmt.Printf("Goodbye, %v!\n", name);
}

func cycleNames(names []string, f func(string)) {
	for _, name := range names {
		f(name);
	}
}

func concat(s1 string, s2 string) string {
	return s1 + " "+ s2;
}

func incrementSends(sendsSoFar int, sendsToAdd int) int {
	sendsSoFar = sendsSoFar + sendsToAdd;

	return sendsSoFar;
}

func (a auth) formatAuth() string {
	return fmt.Sprintf("Authorization: Basic %s:%s", a.username, a.password);
}

func sum(nums ...float64) float64 {
	total := 0.0;
	for i := range nums {
		total += nums[i];
	};

	return total;
}

// func (i invalid) cost() float64 {
// 	return 0.0;
// }	

func circleArea(radius float64) float64 {
	return math.Pi * radius * radius;
}

func getInitials(name string) (string, string) {
	parts := strings.ToUpper(name);
	names := strings.Split(parts, " ");

	var initials []string;
	for _, v := range names {
		initials = append(initials, v[:1]);
	}

	if len(initials) > 1 {
		return  initials[0], initials[1];
	}

	return initials[0], "_";
}

func updateName(newName string) string {
	var name = newName;
	//fmt.Println("Updated name:", name);
	return name;
}

func updateMenu(newMenu map[string]float64) {
	newMenu["Salad"] = 4.99;
}

func updateNamePtr(newName *string) {
	*newName = "Jack";
	//fmt.Println("Updated name:", name);
	// return *newName;
}

func (square Square) area() float64 {
	return square.side * square.side;
}

func (square Square) circumference() float64 {
	return 4 * square.side;
}

func (circle Circle) area() float64 {
	return math.Pi * circle.radius * circle.radius;
}

func (circle Circle) circumference() float64 {
	return 2 * math.Pi * circle.radius;
}

func printShape(shape Shape) {
	fmt.Printf("The area of the shape %T is: %v\n", shape, shape.area());
	fmt.Printf("The circumference of the shape %T is: %v\n", shape, shape.circumference());
}

func main() {
    fmt.Println("=== variables ===");

	var first_name string = "John";
	var last_name = "Doe";
	var age int = 30;
	var weight float64 = 70.5;

	fmt.Println("Hello, " + first_name + " " + last_name + ".");
	fmt.Println("You are " + fmt.Sprint(age) + " years old.");
	fmt.Println("Your weight is " + fmt.Sprint(weight) + " kg.");
	fmt.Println();
	// formatted string
	fmt.Printf("Hello, %v %v.\nYou are %v years old.\nYour weight is %0.1f kg.\n", first_name, last_name, age, weight)

	// array
	fmt.Println();
	fmt.Println("=== array ===");
	var ages [3]int = [3]int{20, 25, 30};
	fmt.Println(ages, len(ages));

	// slices
	fmt.Println();
	fmt.Println("=== slices ===");
	var weights []float64 = []float64{70.5, 75.0, 80.0};
	fmt.Println(weights, len(weights));
	weights = append(weights, 85.0);
	fmt.Println(weights, len(weights));

	// slice range
	var slice_range = weights[1:3];
	fmt.Println(slice_range, len(slice_range));

	var nums = []float64{1.0, 2.0, 3.0, 4.0, 5.0};
	fmt.Printf("The sum of numbers is: %.2f\n", sum(nums...));

	// strings
	fmt.Println();
	fmt.Println("=== strings ===");
	var greeting string = "Hello, welcome to the new world! All orders served here.";
	fmt.Println(strings.Contains(greeting, "World")); // true
	fmt.Println(strings.ReplaceAll(greeting, "Hello", "Hi")); // "Hi, World!"
	fmt.Println(strings.Index(greeting, "om")); // 7
	fmt.Println(strings.Split(greeting, " ")); // [Hello, welcome to the new world! All orders served here.]

	// sort
	fmt.Println();
	fmt.Println("=== sort ===");
	var numbers = []int{5, 2, 8, 1, 4};
	sort.Ints(numbers);
	fmt.Println(numbers);
	var index = sort.SearchInts(numbers, 4);
	fmt.Println(index);

	var names = []string{"Alice", "Bob", "Charlie", "Dave"};
	sort.Strings(names);
	fmt.Println(names);
	var nameIndex = sort.SearchStrings(names, "Bob");
	fmt.Println(nameIndex);

	// loop
	fmt.Println();
	fmt.Println("=== loop ===");
	for i, v := range numbers {
		fmt.Printf("The Value %d is at the Index %d, \n", v, i);
	}
	fmt.Println();
	var x = 0;
	for x < len(numbers) {
		fmt.Println(numbers[x]);
		x++;
	}
	fmt.Println();
	for i := 0; i < len(numbers); i++ {
		fmt.Println(numbers[i]);
	}

	// conditionals
	fmt.Println();
	fmt.Println("=== conditionals ===");
	var score = 85;
	fmt.Println(score > 80);
	if score >= 90 {
		fmt.Println("Grade is: A");
	} else if score >= 80 {
		fmt.Println("Grade is: B");
	} else if score >= 70 {
		fmt.Println("Grade is: C");
	} else {
		fmt.Println("Grade is: D");
	}

	for index, value := range names {
		if index == 1 {
			fmt.Println("Continuing at position ", index);
			continue;
		}

		if index > 2 {
			fmt.Println("Breaking at position ", index);
			break;
		}

		fmt.Printf("The value at position %v is %v\n", index, value);
	}

	// functions
	fmt.Println();
	fmt.Println("=== functions ===");
	bye("Bob");
	cycleNames(names, greet);
	area := circleArea(5.0);
	fmt.Printf("Area of circle with radius 5.0 is: %0.2f\n", area);
	fmt.Println(concat("Carl", "Doe"));
	var sendsSoFar = 430;
	const sendsToAdd = 25;
	sendsSoFar = incrementSends(sendsSoFar, sendsToAdd);
	fmt.Println("Total sends so far:", sendsSoFar);

	// returns
	fmt.Println();
	fmt.Println("=== returns ===");
	first, second := getInitials("John Doe");
	fmt.Printf("Initials: %v %v\n", first, second);
	firstInitial, secondInitial := getInitials("Jane");
	fmt.Printf("Initials: %v %v\n", firstInitial, secondInitial);

	// package scope
	fmt.Println();
	fmt.Println("=== package scope ===");
	sayHello("Mice");

	for i, v := range points {
		fmt.Printf("Point %d: %d\n", i + 1, v);
	}

	showScore();

	// map
	fmt.Println();
	fmt.Println("=== map ===");
	var menu = map[string]float64 {
		"Pizza":  9.99,
		"Burger": 5.99,
		"Pasta":  7.99,
	}

	for item, price := range menu {
		fmt.Printf("The price of %s is %.2f\n", item, price);
	}
	
	fmt.Println(menu["Pizza"]); // 9.99

	var phonebook = map[int]string {
		1234567890: "Alice",
		9876543210: "Bob",
		5555555555: "Charlie",
	}
	fmt.Println();
	for number, name := range phonebook {
		fmt.Printf("Phone number %d belongs to %s\n", number, name);
	}

	// pass by value
	fmt.Println();
	fmt.Println("=== pass by value ===");
	var oldName = "Jane";
	var updatedName = updateName(oldName);
	fmt.Println("Old name:", oldName);
	fmt.Println("Updated name:", updatedName);

	updateMenu(menu);
	// fmt.Println("Updated menu:")
	for item, price := range menu {
		fmt.Printf("The price of %s is %.2f\n", item, price);
	}

	// pointers
	fmt.Println();
	fmt.Println("=== pointers ===");
	fmt.Println("The memory address of oldname is: ", &oldName);

	var nameptr = &oldName;
	fmt.Println("The memory address of nameptr is: ", nameptr);
	fmt.Println("The value of nameptr is: ", *nameptr);

	fmt.Println("The oldname is:", oldName);
	updateNamePtr(nameptr);
	fmt.Println("The newname is:", oldName);

	// struct
	fmt.Println();
	fmt.Println("=== struct ===");
	var user1 = user {
		name:        "Alice",
		phoneNumber: 1234567890,
	};
	var contact = messageToSend {
		user:       user1,
		message:     "Hello, this is a test message!",
	};
	fmt.Printf("Sending message '%s' to the user '%s' with the phone number '%d'.\n", contact.message, contact.user.name, contact.user.phoneNumber);
	
	// receiver
	var cred = auth{
		username: "user",
		password: "pass",
	}
	// authHeader := cred.formatAuth();
	fmt.Println("Formatted Authorization Header:", cred.formatAuth());

	// interface
	fmt.Println();
	fmt.Println("=== interface ===");
	shapes := []Shape {
		Circle{radius: 5.0},
		Square{side: 4.0},
		Circle{radius: 3.0},
		Square{side: 6.0},
	}

	for _, v := range shapes {
		printShape(v);
		fmt.Println("--------------------");
	}


}

