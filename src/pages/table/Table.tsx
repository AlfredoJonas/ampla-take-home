import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Table.css";
import {
  ActionTypes,
  type renderingTableRowType,
  useTable,
} from "../../context/Table";
import Row from "./components/row/Row";

const Table: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const [savedTableId, setSavedTableId] = useState<string | undefined>(id);

  const {
    state: { headerCols, currentTable, renderingTable },
    dispatch,
  } = useTable();

  const [showMessage, setShowMessage] = useState(false);

  // Function to show the floating message
  const shareTableUrl = (): void => {
    const tableId = savedTableId ?? uuidv4();
    localStorage.setItem(tableId, JSON.stringify(currentTable));
    setSavedTableId(tableId);
    const sharedUrl = `${window.location.href}/${tableId}`;
    try {
      void navigator.clipboard.writeText(sharedUrl);
      console.log(sharedUrl);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 2000); // Hide the message after 2 seconds
    } catch (error) {
      console.error("Error copying URL to clipboard:", error);
    }
  };

  useEffect(() => {
    let newTable = null;
    if (savedTableId != null) {
      const savedTable = localStorage.getItem(savedTableId) ?? "";
      newTable = JSON.parse(savedTable);
    } else {
      newTable = currentTable;
    }
    dispatch({
      type: ActionTypes.SET_RENDERING_TABLE,
      payload: { table: newTable },
    });
  }, [savedTableId]);

  return (
    <div className="home">
      <div className="spreadsheet">
        <table>
          <thead>
            <tr>
              <th>
                <div className="share-button">
                  <button className="share-button-text" onClick={shareTableUrl}>
                    Share
                  </button>
                  {showMessage && (
                    <div
                      className={`floating-message ${
                        showMessage ? "show" : ""
                      }`}
                    >
                      <p className="copy-url">URL Copied!</p>
                    </div>
                  )}
                </div>
              </th>
              {headerCols.map((value: string) => (
                <th key={value}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderingTable.map(
              (row: renderingTableRowType[], rowIndex: number) => {
                return (
                  <Row
                    key={"tr" + rowIndex + 1}
                    row={row}
                    headerColsLenght={headerCols.length}
                    rowIndex={rowIndex}
                  />
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
