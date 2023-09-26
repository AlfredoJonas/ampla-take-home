import { COLUMNS, ROWS, letters } from "../constants";
import { type currentTableType, type renderingTableType } from "./Table";

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

export const buildHeaderCols = (): string[] => {
  // Defines the header list to keep track of the related indexes
  const newHeaderCols = new Array(COLUMNS);
  for (let i = 0; i < COLUMNS; i++) {
    newHeaderCols[i] = generateSheetHeader(i);
  }
  return newHeaderCols;
};

/**
 * Generates an array of numbers starting from an initial value and
 * ending at a specified number.
 * @param {number} many - The `many` parameter represents the number of elements you want in the
 * sheetList array. It determines the length of the array.
 * @param {number} [initial=0] - The `initial` parameter is an optional parameter that specifies the
 * starting value for the sheet list. If not provided, it defaults to 0.
 * @returns The function `buildSheetList` returns an array of numbers.
 */
const buildSheetList = (
  many: number,
  currentTable: currentTableType,
  renderingTable: renderingTableType,
  headerCols: string[],
  initial: number = 0,
): number[] => {
  const sheetList = new Array(many);
  for (let i = 0; i < many; i++) {
    const id = i + initial + 1;
    sheetList[i] = {
      key: id,
      value:
        id in currentTable
          ? findCellValue(id, currentTable, renderingTable, headerCols)
          : "",
      error: false,
    };
  }
  return sheetList;
};

export const buildRenderingTable = (
  currentTable: currentTableType,
  renderingTable: renderingTableType,
  headerCols: string[],
): renderingTableType => {
  const newTable = new Array(ROWS);
  for (let i = 0; i < ROWS; i++) {
    const startingKeyValue = COLUMNS * i;
    newTable[i] = buildSheetList(
      COLUMNS,
      currentTable,
      renderingTable,
      headerCols,
      startingKeyValue,
    );
  }
  return newTable;
};

export const findCellValue = (
  id: number,
  currentTable: currentTableType,
  renderingTable: renderingTableType,
  headerCols: string[],
): Record<string, string | boolean> => {
  const regex = /^=([A-Za-z]+)([1-9]+)$/;
  const checkNextCell = (
    refId: number,
    visitedCells: Set<number>,
  ): Record<string, string | boolean> => {
    if (refId in currentTable) {
      const cellValue = currentTable[refId];

      // Check if the cell has been visited before
      // if yes, this means that any of the previous references
      // was already referenced and it means a circular error
      if (visitedCells.has(refId)) {
        // Since this text is not being stored
        // it'll change if we set the current cell
        return { error: true, value: "#¡REF! Circular" };
      }

      visitedCells.add(refId);

      // Use a regular expression to separate letters and numbers
      const matches = cellValue.match(regex);

      if (matches != null) {
        const letterCode = matches[1].toUpperCase();
        // We decrease the index in 1 because of the translation
        // of the real array index to the beauty left numered column
        const refRowIndex = parseInt(matches[2]) - 1;
        // Got the index related to the header letter codes
        const refColIndex = headerCols.indexOf(letterCode);

        // Check that the letter code belongs exists
        // and row index it's in the range of ROWS
        if (refColIndex >= 0 && refRowIndex <= ROWS) {
          // In this way we know wich specific cell it's beinf referenced
          const cellId = renderingTable[refRowIndex][refColIndex];

          // Then we call this function recursively to get the value of the
          // referenced cell or continue referencing other cells
          return checkNextCell(cellId, visitedCells);
        } else {
          return { error: false, value: "" };
        }
      } else {
        return { error: false, value: cellValue };
      }
    }
    return { error: false, value: "" }; // Handle the case when id is not in currentTable
  };

  const visitedCells = new Set<number>();

  return checkNextCell(id, visitedCells);
};
