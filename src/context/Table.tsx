import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import { buildRenderingTable, findCellValue, buildHeaderCols } from "./utils";

const initialState = {
  headerCols: buildHeaderCols(),
  currentTable: {},
  // Keeps track of the spreadsheet table as simple matrix
  // of numbers so we keep rendering faster without complex json objects
  renderingTable: [[]],
};

export type currentTableType = Record<string, any>;
export type renderingTableType = any[][];
export type renderingTableRowType = Record<string, any>;

// Define the initial state interface
interface TableState {
  headerCols: string[];
  currentTable: currentTableType;
  renderingTable: renderingTableType;
}

// Define action types
export enum ActionTypes {
  SET_CELL = "SET_CELL",
  SET_RENDERING_TABLE = "SET_RENDERING_TABLE",
}

// Define the reducer function
interface TableAction {
  type: ActionTypes;
  payload: Record<string, any>;
}

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case ActionTypes.SET_CELL: {
      const {
        payload: {
          cell: { id, value, rowIndex, colIndex },
        },
      } = action;
      state.currentTable[id] = value;
      const { value: realCellValue } = findCellValue(
        id,
        state.currentTable,
        state.renderingTable,
        state.headerCols,
      );
      state.renderingTable[rowIndex][colIndex].value = realCellValue;
      return { ...state };
    }
    case ActionTypes.SET_RENDERING_TABLE: {
      const {
        payload: { table },
      } = action;
      state.currentTable = table as currentTableType;
      state.renderingTable = buildRenderingTable(
        state.currentTable,
        state.renderingTable,
        state.headerCols,
      );
      return { ...state }; // Return the updated state here
    }
    default:
      return state;
  }
};

// Create the context
const TableContext = createContext<
  { state: TableState; dispatch: React.Dispatch<TableAction> } | undefined
>(undefined);

// Create a custom hook to access the context
export const useTable = (): {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
} => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};

// Create a context provider component
interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({
  children,
}: TableProviderProps) => {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  return (
    <TableContext.Provider value={{ state, dispatch }}>
      {children}
    </TableContext.Provider>
  );
};
