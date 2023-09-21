import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import './Table.css';
import Row from './components/row/Row';
import { ActionTypes, useTable } from '../../context/Table';
import { COLUMNS, ROWS, letters } from '../../utils';

function Table() {
  // Keeps track of the spreadsheet table as simple matrix 
  // of numbers so we keep rendering faster without complex json objects
  const [table, setTable] = useState<number[][]>([[]]);
  
  const { id } = useParams();

  const [savedTableId, setSavedTableId] = useState<string | undefined>(id);

  const [headerCols, setHeaderCols] = useState<string[]>([]);

  const [clickedRow, setClickedRow] = useState<number>(-1);

  const [cellValue, setCellValue] = useState<string>("");

  const { state: { currentTable }, dispatch } = useTable();

  const [showMessage, setShowMessage] = useState(false);


  // Function to show the floating message
  const shareTableUrl = () => {
    let tableId = savedTableId ? savedTableId : uuidv4();
    localStorage.setItem(tableId, JSON.stringify(currentTable))
    setSavedTableId(tableId);
    const sharedUrl = `${window.location.href}/${tableId}`;
    navigator.clipboard.writeText(sharedUrl);
    console.log(sharedUrl);
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 2000); // Hide the message after 2 seconds
  };

  useEffect(() => {
    if(savedTableId){
      const savedTable = localStorage.getItem(savedTableId) || "";
      dispatch({
        type: ActionTypes.SET_SAVED_TABLE,
        payload: { table: JSON.parse(savedTable)}
      });
    }
  }, [savedTableId])

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
      sheetList[i] = i+initial+1;
    }
    return sheetList;
  }

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

    // Defines the header list to keep track of the related indexes using useMemo
    const newHeaderCols = new Array(COLUMNS);
    for (let i = 0; i < COLUMNS; i++) {
      newHeaderCols[i] = generateSheetHeader(i);
    }
    setHeaderCols(newHeaderCols)

  }, [COLUMNS, ROWS]);

  const setCurrentCell = (id: number) => {
    if(id in currentTable){
      setCellValue(currentTable[id]);
    }
    setClickedRow(id)
  }

  const onCellValueChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setCellValue(e.currentTarget.value);
  };

  const onCellBlur = (childValue: number) => {
    if (childValue in currentTable || (!(childValue in currentTable) || cellValue !== "")) {
      dispatch({
        type: ActionTypes.SET_CELL,
        payload: { cell: {id: childValue, value: cellValue}}
      });
      setClickedRow(-1)
      setCellValue("");
    }
  }

  return (
    <div className="home">
      <div className="spreadsheet">
        <table>
            <thead>
              <tr>
                <th>
                <div className="share-button">
                  <button className="share-button-text" onClick={shareTableUrl}>Share</button>
                  {
                    showMessage && (
                      <div className={`floating-message ${showMessage ? 'show' : ''}`}>
                        <p className="copy-url">URL Copied!</p>
                      </div>
                    )
                  }
                </div>
                </th>
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
                          (childValue: number) => clickedRow === childValue ?
                            <td key={childValue+parentIndex} className='input-focus'>
                              <input
                                autoFocus
                                type='text'
                                value={cellValue}
                                onChange={onCellValueChange}
                                onBlur={() => onCellBlur(childValue)}
                              />
                              </td>
                          :
                            <Row
                              key={childValue+parentIndex}
                              id={childValue}
                              headerCols={headerCols}
                              table={table}
                              onClick={() => setCurrentCell(childValue)}
                            />
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

export default Table;
