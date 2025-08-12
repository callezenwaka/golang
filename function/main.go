package main

import "fmt";

func add(x int, y int) int {
	return x + y;
}

func mul(x int, y int) int {
	return x * y;
}

func sub(x int, y int) int {
	return x - y;
}

// func div(x int, y int) float64 {
// 	return float64(x) / float64(y);
// }

func aggregate(a int, b int, c int, arithmetic func(int, int) int) int {
	return arithmetic(arithmetic(a, b), c);
}

func main() {
	fmt.Println("Function aggregator");
	fmt.Printf("The result of addition is %d\n", aggregate(5, 3, 2, add));
	fmt.Printf("The result of multiplication is %d\n", aggregate(5, 3, 2, mul));
	fmt.Printf("The result of subtraction is %d\n", aggregate(5, 3, 2, sub));
	// fmt.Println(aggregate(5, 3, 2, div)); // div returns float64, incompatible with aggregate
}	
