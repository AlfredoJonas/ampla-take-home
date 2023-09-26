import { ROWS } from "../../../../constants";
import { type currentTable as currentTableType } from "../../../../context/Table";

const cellRefRegex = "([A-Z]+)([1-9]+)";

const operators = {
  ref: new RegExp(`^=${cellRefRegex}$`, "i"),
  sum: new RegExp(`^=sum\\(${cellRefRegex},${cellRefRegex}\\)$`, "i"),
};

export const getCellValue = (
  currentRefId: number,
  currentTable: currentTableType,
  table: number[][],
  headerCols: string[],
): Record<string, any> => {
  const currentCellValue =
    currentRefId in currentTable ? currentTable[currentRefId] : "";
  let visitedCells = new Set<number>();

  const checkNextCell = (
    refId: number,
    visitedCells: Set<number>,
  ): Record<string, any> => {
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
      const matches = cellValue.match(operators.ref);
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
          const cellId = table[refRowIndex][refColIndex];

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

  const sum = (refIdA: number, refIdB: number): Record<string, any> => {
    const { error: errorA = false, value: numA } = checkNextCell(
      refIdA,
      visitedCells,
    );
    visitedCells = new Set<number>();
    const { error: errorB = false, value: numB } = checkNextCell(
      refIdB,
      visitedCells,
    );
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return (errorA || errorB) &&
      typeof numA === "number" &&
      typeof numB === "number"
      ? { error: true, value: "#¡REF! Circular" }
      : {
          error: false,
          value: parseFloat(numA) + parseFloat(numB),
        };
  };
  const sumRegexResult = currentCellValue.match(operators.sum);
  if (sumRegexResult !== null) {
    const aColIndex = headerCols.indexOf(sumRegexResult[1].toUpperCase());
    const aRowIndex = parseInt(sumRegexResult[2]) - 1;
    const bColIndex = headerCols.indexOf(sumRegexResult[3].toUpperCase());
    const bRowIndex = parseInt(sumRegexResult[4]) - 1;
    return sum(table[aRowIndex][aColIndex], table[bRowIndex][bColIndex]);
  }
  return checkNextCell(currentRefId, visitedCells);
};
