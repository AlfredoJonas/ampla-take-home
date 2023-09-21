import React from "react";
import Cell from "../cell/Cell";

interface TableRowProps {
  parentIndex: number;
  row: number[];
  headerCols: string[];
  table: number[][];
}

function Row({ parentIndex, row, headerCols, table }: TableRowProps) {
  const startingKeyValue = headerCols.length * parentIndex;

  return (
    <tr key={"tr" + parentIndex + 1}>
      <th key={"th" + startingKeyValue}>{parentIndex + 1}</th>
      {row.map((childValue) => (
        <Cell
          key={childValue + parentIndex}
          id={childValue}
          headerCols={headerCols}
          table={table}
        />
      ))}
    </tr>
  );
}

export default Row;
