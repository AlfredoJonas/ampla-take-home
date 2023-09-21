import React, { useState } from "react";
import { ActionTypes, useTable } from "../../../../context/Table";
import { ROWS } from "../../../../constants";
import "./Cell.css";

interface CellProps {
  id: number;
  headerCols: string[];
  table: number[][];
}

const Cell: React.FC<CellProps> = ({ id, headerCols, table }) => {
  const [editable, setEditable] = useState(false);
  const {
    state: { currentTable },
    dispatch,
  } = useTable();
  const [cellValue, setCellValue] = useState(
    id in currentTable ? currentTable[id] : "",
  );
  const regex = /^=([A-Za-z]+)([1-9]+)$/;
  const visitedCells = new Set<number>();

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

  const onCellValueChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setCellValue(e.currentTarget.value);
  };

  /**
   * Updates the cell value in the current table state if the new value is
   * different from the old value or if the new value is not empty.
   * @param {number} childValue - The `childValue` parameter is a number that represents the new value
   * entered in the cell.
   */
  const onCellBlur = (childValue: number): void => {
    const newCellValueDiffOld =
      childValue in currentTable && currentTable[id] !== cellValue;
    const newCellValueDiffEmpty =
      !(childValue in currentTable) && cellValue !== "";
    if (newCellValueDiffOld || newCellValueDiffEmpty) {
      dispatch({
        type: ActionTypes.SET_CELL,
        payload: { cell: { id: childValue, value: cellValue } },
      });
    }
    setEditable(false);
  };

  const { error, value } = editable
    ? { error: false, value: "" }
    : checkNextCell(id, visitedCells);
  return editable ? (
    <td className="input-focus">
      <input
        autoFocus
        type="text"
        value={cellValue}
        onChange={onCellValueChange}
        onBlur={() => {
          onCellBlur(id);
        }}
      />
    </td>
  ) : (
    <td
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      className={error ? "cell-error" : ""}
      onClick={() => {
        setEditable(true);
      }}
    >
      {value}
    </td>
  );
};

export default Cell;
