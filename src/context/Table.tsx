import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

const initialState = {
  currentTable: {},
};

export type currentTable = Record<string, string>;

// Define the initial state interface
interface TableState {
  currentTable: currentTable;
}

// Define action types
export enum ActionTypes {
  SET_CELL = "SET_CELL",
  SET_SAVED_TABLE = "SET_SAVED_TABLE",
}

interface Cell {
  id: number;
  value: string;
}

// Define the reducer function
interface TableAction {
  type: ActionTypes;
  payload: Record<string, Cell | currentTable>;
}

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case ActionTypes.SET_CELL: {
      const {
        payload: {
          cell: { id, value },
        },
      } = action;
      state.currentTable[id] = value;
      return { ...state };
    }
    case ActionTypes.SET_SAVED_TABLE: {
      const {
        payload: { table },
      } = action;
      state.currentTable = table as currentTable;
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
