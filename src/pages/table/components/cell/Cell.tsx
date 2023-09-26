import React, { memo, useState } from "react";
import { ActionTypes, useTable } from "../../../../context/Table";
import "./Cell.css";

interface CellProps {
  id: number;
  error: boolean;
  value: any;
  rowIndex: number;
  colIndex: number;
}

const Cell: React.FC<CellProps> = ({
  id,
  error,
  value,
  rowIndex,
  colIndex,
}) => {
  const [editable, setEditable] = useState(false);
  const { dispatch } = useTable();
  const [cellValue, setCellValue] = useState(value);

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
    dispatch({
      type: ActionTypes.SET_CELL,
      payload: {
        cell: { id: childValue, value: cellValue, rowIndex, colIndex },
      },
    });
    setEditable(false);
  };

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

export default memo(Cell);
