package main

import "fmt";

type employee interface {
	getName() string
	getSalary() float64
}

type fullTime struct {
	name   string
	salary float64
}

type contractor struct {
	name   string
	hourlyPay   float64
	hoursPerYear  int
}

type expense interface {
	cost() float64
}

type email struct {
	isSubscribed bool
	body string
	toAddress string
}

type sms struct {
	isSubscribed bool
	body string
	toPhoneNumber string
}

func(f fullTime) getName() string {
	return f.name;
}

func (f fullTime) getSalary() float64 {
	return f.salary;
}

func (c contractor) getName() string {
	return c.name;
}

func (c contractor) getSalary() float64 {
	return c.hourlyPay * float64(c.hoursPerYear);
}

func getExpenseReport(e expense) (string, float64) {
	em, ok := e.(email);
	if ok {
		return em.toAddress, e.cost();
	}
	sm, ok := e.(sms);
	if ok {
		return sm.toPhoneNumber, e.cost();
	}

	return "", 0.0;
}

func (e email) cost() float64 {
	if e.isSubscribed {
		return float64(len(e.body)) * 0.05; // cost based on body length
	}
	return float64(len(e.body)) * 0.01; // cost based on body length
}

func (s sms) cost() float64 {
	if s.isSubscribed {
		return float64(len(s.body)) * 0.1; // cost based on body length
	}
	return float64(len(s.body)) * 0.03; // cost based on body length
}

func main() {
	// 
	var full_time = fullTime{
		name:  "Jack",
		salary: 60000,
	}

	var contract = contractor{
		name:       "Alice",
		hourlyPay:  50.0,
		hoursPerYear: 2000,
	}

	var employees = []employee{
		full_time,
		contract,
	}

	for _, emp := range employees {
		fmt.Printf("Employee %s has salary %.2f\n", emp.getName(), emp.getSalary());
	}

	// fmt.Printf("Full-time employee %s has salary of %.2f\n", full_time.getName(), full_time.getSalary());
	// fmt.Printf("Contractor %s has hourly pay %.2f, hours per year %d and salary of %.2f\n", contract.getName(), contract.hourlyPay, contract.hoursPerYear, contract.getSalary());

	testEmail := email{
		isSubscribed: true,
		body:        "Hello, this is a test email.",
		toAddress:   "test@example.com",
	}
	fmt.Printf("Cost of sending email to %s: %.2f\n", testEmail.toAddress, testEmail.cost());

	testSms := sms{
		isSubscribed: true,
		body:        "Hello, this is a test SMS.",
		toPhoneNumber:    "123-456-7890",
	}
	fmt.Printf("Cost of sending SMS to %s: %.2f\n", testSms.toPhoneNumber, testSms.cost());

	// Use the expense interface to avoid unused type error
	expenses := []expense{testEmail, testSms}
	for _, exp := range expenses {
		addr, cost := getExpenseReport(exp)
		fmt.Printf("Expense to %s costs %.2f\n", addr, cost)
	}
}