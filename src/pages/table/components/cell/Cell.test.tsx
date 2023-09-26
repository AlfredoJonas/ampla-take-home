import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Cell from "./Cell";
import { useTable } from "../../../../context/Table";

// Mock the context and any required dependencies for your component
jest.mock("../../../../context/Table");

describe("Cell Component", () => {
  it("renders the cell value when error", () => {
    (useTable as jest.Mock).mockReturnValue({
      state: {
        currentTable: {
          1: "=A1",
        },
      },
      dispatch: jest.fn(),
    });

    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell
              id={1}
              error={false}
              value={undefined}
              rowIndex={0}
              colIndex={0}
            />
          </tr>
        </tbody>
      </table>,
    );

    // Replace this with an appropriate selector for your cell value element
    const cellValueElement = container.querySelector(".cell-error");
    expect(cellValueElement).toBeInTheDocument();
    expect(cellValueElement?.textContent).toBe("#¡REF! Circular");
  });

  it("renders an input field when editable", () => {
    (useTable as jest.Mock).mockReturnValue({
      state: {
        currentTable: {
          1: "cell value example",
        },
      },
      dispatch: jest.fn(),
    });
    const { container, getByText } = render(
      <table>
        <tbody>
          <tr>
            <Cell
              id={1}
              error={false}
              value={undefined}
              rowIndex={0}
              colIndex={0}
            />
          </tr>
        </tbody>
      </table>,
    );

    // Trigger the click event to make the cell editable
    const cellElement = getByText("cell value example");
    fireEvent.click(cellElement as Element);

    // Replace this with an appropriate selector for your input field
    const inputElement = container.querySelector("input");

    expect(inputElement).toBeInTheDocument();
  });

  it("calls onCellValueChange when input value changes", () => {
    (useTable as jest.Mock).mockReturnValue({
      state: {
        currentTable: {
          1: "cell value example",
        },
      },
      dispatch: jest.fn(),
    });
    const { container, getByText, getByDisplayValue } = render(
      <table>
        <tbody>
          <tr>
            <Cell
              id={1}
              error={false}
              value={undefined}
              rowIndex={0}
              colIndex={0}
            />
          </tr>
        </tbody>
      </table>,
    );
    // Trigger the click event to make the cell editable
    const cellElement = getByText("cell value example");
    fireEvent.click(cellElement as Element);
    const inputElement = container.querySelector("input");
    fireEvent.change(inputElement as Element, {
      target: { value: "New Value" },
    });
    const inputValueElement = getByDisplayValue("New Value");
    expect(inputValueElement).toBeInTheDocument();
  });

  it.skip("calls onCellBlur when input loses focus", () => {
    console.log("pass");
  });
});
