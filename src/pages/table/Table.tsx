import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Table.css";
import { ActionTypes, useTable } from "../../context/Table";
import { COLUMNS, ROWS, letters } from "../../utils";
import Row from "./components/row/Row";

const Table: React.FC = () => {
  // Keeps track of the spreadsheet table as simple matrix
  // of numbers so we keep rendering faster without complex json objects
  const [table, setTable] = useState<number[][]>([[]]);

  const { id } = useParams();

  const [savedTableId, setSavedTableId] = useState<string | undefined>(id);

  const [headerCols, setHeaderCols] = useState<string[]>([]);

  const {
    state: { currentTable },
    dispatch,
  } = useTable();

  const [showMessage, setShowMessage] = useState(false);

  // Function to show the floating message
  const shareTableUrl = (): void => {
    const tableId = savedTableId != null ? uuidv4() : "null";
    localStorage.setItem(tableId, JSON.stringify(currentTable));
    setSavedTableId(tableId);
    const sharedUrl = `${window.location.href}/${tableId}`;
    try {
      void navigator.clipboard.writeText(sharedUrl);
      console.log(sharedUrl);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 2000); // Hide the message after 2 seconds
    } catch (error) {
      console.error("Error copying URL to clipboard:", error);
    }
  };

  useEffect(() => {
    if (savedTableId != null) {
      const savedTable = localStorage.getItem(savedTableId) ?? "";
      dispatch({
        type: ActionTypes.SET_SAVED_TABLE,
        payload: { table: JSON.parse(savedTable) },
      });
    }
  }, [savedTableId]);

  /**
   * Generates an array of numbers starting from an initial value and
   * ending at a specified number.
   * @param {number} many - The `many` parameter represents the number of elements you want in the
   * sheetList array. It determines the length of the array.
   * @param {number} [initial=0] - The `initial` parameter is an optional parameter that specifies the
   * starting value for the sheet list. If not provided, it defaults to 0.
   * @returns The function `buildSheetList` returns an array of numbers.
   */
  const buildSheetList = (many: number, initial: number = 0): number[] => {
    const sheetList = new Array(many);
    for (let i = 0; i < many; i++) {
      sheetList[i] = i + initial + 1;
    }
    return sheetList;
  };

  /**
   * Converts a numerical column index into a string representation
   * using letters from "A" to "Z" and beyond (like "AA," "AB," "AC," ...)
   * @param {number} columnIndex - The columnIndex parameter is a number
   * that represents the index of a column in a spreadsheet.
   * @returns a string, which is the generated column header for a given column index.
   */
  const generateSheetHeader = (columnIndex: number): string => {
    // Initialize an empty string to build the column header
    let columnHeader = "";
    let index = columnIndex;

    // Start a loop that continues until 'index' becomes negative
    while (index >= 0) {
      // Calculate the letter for the current position in the column header
      columnHeader = letters[index % 26] + columnHeader;

      // Update 'index' to move to the next position in the header
      index = Math.floor(index / 26) - 1;
    }

    return columnHeader;
  };

  // Generate the initial table for the spreadsheet
  useEffect(() => {
    // Initialize the table array
    const newTable = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
      const startingKeyValue = COLUMNS * i;
      newTable[i] = buildSheetList(COLUMNS, startingKeyValue);
    }
    setTable(newTable);
    // Defines the header list to keep track of the related indexes
    const newHeaderCols = new Array(COLUMNS);
    for (let i = 0; i < COLUMNS; i++) {
      newHeaderCols[i] = generateSheetHeader(i);
    }
    setHeaderCols(newHeaderCols);
  }, [COLUMNS, ROWS]);

  return (
    <div className="home">
      <div className="spreadsheet">
        <table>
          <thead>
            <tr>
              <th>
                <div className="share-button">
                  <button className="share-button-text" onClick={shareTableUrl}>
                    Share
                  </button>
                  {showMessage && (
                    <div
                      className={`floating-message ${
                        showMessage ? "show" : ""
                      }`}
                    >
                      <p className="copy-url">URL Copied!</p>
                    </div>
                  )}
                </div>
              </th>
              {headerCols.map((value: string) => (
                <th key={value}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row: number[], parentIndex: number) => {
              return (
                <Row
                  key={"tr" + parentIndex + 1}
                  parentIndex={parentIndex}
                  row={row}
                  headerCols={headerCols}
                  table={table}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
