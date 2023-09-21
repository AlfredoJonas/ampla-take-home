import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Table from "./Table";
import { useTable } from "../../context/Table";
import { useParams } from "react-router-dom";

// Mock the context and any required dependencies for your component
jest.mock("../../context/Table");

// Mock the react-router useParams hook
jest.mock("react-router-dom");

// Mock the clipboard API
const clipboardWriteTextMock = jest.fn();
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: clipboardWriteTextMock },
});

describe("Table Component", () => {
  beforeEach(() => {
    (useTable as jest.Mock).mockReturnValue({
      state: {
        currentTable: {
          1: "cell value example",
        },
      },
      dispatch: jest.fn(),
    });
    (useParams as jest.Mock).mockReturnValue({ id: null });
    // Mock localStorage methods
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    clipboardWriteTextMock.mockClear();
  });

  it("renders without crashing", () => {
    render(<Table />);
  });

  it("shares the table URL when Share button is clicked", async () => {
    const mockedSavedTable = [
      ["1", "2", "3"],
      ["4", "5", "6"],
    ];
    (localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify(mockedSavedTable),
    );
    const { getByText } = render(<Table />);
    // Click the Share button
    const shareButton = getByText("Share");
    fireEvent.click(shareButton);
    // Verify clipboard API was called with the correct URL
    expect(clipboardWriteTextMock).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost//null"),
    );

    // Verify the URL Copied message is displayed
    await waitFor(() => {
      expect(getByText("URL Copied!")).toBeInTheDocument();
    });
  });

  it("loads a saved table from localStorage if an ID is provided", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "mockedId" });
    const mockedSavedTable = [
      ["1", "2", "3"],
      ["4", "5", "6"],
    ];
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify(mockedSavedTable),
    );

    render(<Table />);

    expect(localStorage.getItem).toHaveBeenCalledWith("mockedId");
  });
});
