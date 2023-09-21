import React, { ReactNode, memo, useEffect, useState } from "react";
import { useTable } from "../../../../context/Table";
import { ROWS } from "../../../../utils";
import './Row.css';

interface RowProps {
  id: number,
  headerCols: string[],
  table: number[][],
  onClick: () => void;
}

const Row: React.FC<RowProps> = ({ id, headerCols, table, onClick }) => {
  const { state: { currentTable }, } = useTable();
  const regex = /^=([A-Za-z]+)([1-9]+)$/;

  const checkNextCell = (refId: number, visitedCells: Set<number>): Record<string, string | boolean> => {
    if (refId in currentTable) {
      const cellValue = currentTable[refId];

      // Check if the cell has been visited before
      // if yes, this means that any of the previous references 
      // was already referenced and it means a circular error
      if (visitedCells.has(refId)) {
        // Since this text is not being stored 
        // it'll change if we set the current cell
        return {error: true, value: '#¡REF! Circular'};
      }

      visitedCells.add(refId);

      // Use a regular expression to separate letters and numbers
      const matches = cellValue.match(regex);

      if (matches) {
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
          return {error: false, value: cellValue};
        }
      } else {
        return {error: false, value: cellValue};
      }
    }
    return {error: false, value: ''}; // Handle the case when id is not in currentTable
  }

  const visitedCells = new Set<number>();
  const {error, value} = checkNextCell(id, visitedCells);
  return <td className={`${error ? 'cell-error' : ''}`} onClick={onClick}>{value}</td>;
};

export default memo(Row);
