import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders title", () => {
	render(<App />);
	const restaurant = screen.getByText(/Menu/i);
	expect(restaurant).toBeInTheDocument();
});
