package main

import "fmt";

func sendSMSToCouple(msgToCustomer string, msgToSpouse string) (float64, error) {
	costForCustomer, err := sendSMS(msgToCustomer);
	if err != nil {
		return 0.0, err;
	}

	costForSpouse, err := sendSMS(msgToSpouse);
	if err != nil {
		return 0.0, err;
	}

	return costForCustomer + costForSpouse, nil;
}

func sendSMS(message string) (float64, error) {
	const maxTextLen = 25;
	const costPerChar = 0.002;
	if len(message) > maxTextLen {
		return 0, fmt.Errorf("message exceeds maximum length of %d characters", maxTextLen);
	}
	return float64(len(message)) * costPerChar, nil;
}

func main() {
	customers := map[float64]string{
		0.0: "Customer 1",
		1.0: "Customer 2",
		2.0: "Customer 3",
	}
	couples := map[float64]string{
		0.0: "Couple 1",
		1.0: "Couple 2",
		2.0: "Couple 3",
	}

	for customerID, customerName := range customers {
		coupleName, ok := couples[customerID];
		if !ok {
			continue;
		}

		totalCost, err := sendSMSToCouple(customerName, coupleName);
		if err != nil {
			fmt.Printf("Error sending SMS to %s and %s: %v\n", customerName, coupleName, err);
			continue;
		}

		fmt.Printf("Total cost for sending SMS to %s and %s: $%.2f\n", customerName, coupleName, totalCost);
	}

	var messages = map[string]string{
		"Message to Customer 1": "Hello Customer 1, this is a reminder for your appointment.",
		"Message to Customer 2": "Hello Customer 2.",
		"Message to Customer 3": "Hello Customer 3, this is a reminder for your appointment.",
	};

	for msgToCustomer, msgToSpouse := range messages {
		totalCost, err := sendSMSToCouple(msgToCustomer, msgToSpouse);
		if err != nil {
			fmt.Printf("Error sending SMS for %s: %v\n", msgToCustomer, err);
			continue;
		}

		fmt.Printf("Total cost for sending SMS for %s: $%.2f\n", msgToCustomer, totalCost);
	}
}