import React, { useEffect, useState } from 'react';
import './NewTable.css';
import Row from './components/row/Row';

// For a bigger table requirements up to 100 rows and 30 columns 
// use virtualizations to keep performance
const COLUMNS = 30;
const ROWS = 100;
// Define an array 'letters' to represent the characters A to Z
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


function NewTable() {
  // Keeps track of the spreadsheet table as simple matrix 
  // of numbers so we keep rendering faster without complex json objects
  const [table, setTable] = useState<number[][]>([[]]);

  // Keeps track the related indexes of each column header
  const [headerCols, setHeaderCols] = useState<string[]>([]);

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
    for(let i=0; i<many ;i++){
      sheetList[i] = i+initial;
    }
    return sheetList;
  }


  // Generate the initial table for the spreadsheet
  useEffect(() => {
    // Starting on 0 and increasing in 1 until the array is finished
    // so if we have a table of 2 by 3 the first row will be [0,1] and
    // the last one [4,5]
    const newTable = new Array(ROWS);
    for(let i=0; i<ROWS ;i++){
      const startingKeyValue = COLUMNS*i;
      newTable[i] = buildSheetList(COLUMNS, startingKeyValue);
    }
    setTable(newTable);

    // Build once the headers list to keep track of the related indexes
    const newHeaderCols = new Array(COLUMNS);
    for(let i=0; i<COLUMNS ;i++){
      newHeaderCols[i] = generateSheetHeader(i);
    }
    setHeaderCols(newHeaderCols);
  }, [COLUMNS, ROWS]);

  /**
   * Converts a numerical column index into a string representation 
   * using letters from "A" to "Z" and beyond (like "AA," "AB," "AC," ...)
   * @param {number} columnIndex - The columnIndex parameter is a number 
   * that represents the index of a column in a spreadsheet.
   * @returns a string, which is the generated column header for a given column index.
   */
  const generateSheetHeader = (columnIndex: number): string => {
    // Initialize an empty string to build the column header
    let columnHeader = '';
    let index = columnIndex;

    // Start a loop that continues until 'index' becomes negative
    while (index >= 0) {
        // Calculate the letter for the current position in the column header
        columnHeader = letters[index % 26] + columnHeader;

        // Update 'index' to move to the next position in the header
        index = Math.floor(index / 26) - 1;
    }

    return columnHeader;
  }

  return (
    <div className="home">
      <div className="spreadsheet">
        <table>
            <thead>
              <tr>
                <th></th>
                {headerCols.map((value: string) => 
                  <th key={value}>{value}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {table.map((row: number[], parentIndex: number) => {
                  const startingKeyValue = COLUMNS*parentIndex;
                  return (
                    <tr key={'tr'+parentIndex+1}>
                      <th key={'th'+startingKeyValue}>{parentIndex+1}</th>
                      {
                        row.map(
                          (childValue: number) => 
                            <Row key={childValue+parentIndex}></Row>
                        )
                      }
                    </tr>
                  );
                }
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default NewTable;
