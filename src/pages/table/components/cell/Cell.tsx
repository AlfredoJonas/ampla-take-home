import React, { useState } from "react";
import { ActionTypes, useTable } from "../../../../context/Table";
import "./Cell.css";
import { getCellValue } from "./utils";

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
    : getCellValue(id, currentTable, table, headerCols);

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
