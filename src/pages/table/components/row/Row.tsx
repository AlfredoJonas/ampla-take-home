import React from "react";
import Cell from "../cell/Cell";
import { type renderingTableRowType } from "../../../../context/Table";

interface TableRowProps {
  row: renderingTableRowType[];
  headerColsLenght: number;
  rowIndex: number;
}

const Row: React.FC<TableRowProps> = ({ rowIndex, headerColsLenght, row }) => (
  <tr key={"tr" + rowIndex + 1}>
    <th key={"th" + headerColsLenght * rowIndex + rowIndex}>{rowIndex + 1}</th>
    {row.map(({ key, error, value }, colIndex) => (
      <Cell
        key={key + rowIndex}
        id={key}
        rowIndex={rowIndex}
        colIndex={colIndex}
        error={error}
        value={value}
      />
    ))}
  </tr>
);

export default Row;
