import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("navigates between the main portfolio sections", () => {
  window.scrollTo = jest.fn();
  render(<App />);

  expect(screen.getByRole("heading", { name: /Aliezzar Wijaya/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "03 Karya" }));
  expect(screen.getByRole("heading", { name: /Karya pilihan/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "04 Kontak" }));
  expect(screen.getByRole("heading", { name: /Ada ide/i })).toBeInTheDocument();
});
