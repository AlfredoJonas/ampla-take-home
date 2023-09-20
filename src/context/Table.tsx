import React, { createContext, useContext, useReducer, ReactNode } from 'react';

const initialState = {
  currentTable: {},
  savedTables: {}
};

type currentTable = Record<string, string>

// Define the initial state interface
interface TableState {
  currentTable: currentTable;
  savedTables: Record<string, currentTable>;
}

// Define action types
export enum ActionTypes {
  NEW_CELL = 'NEW_CELL',
  MODIFY_CELL = 'MODIFY_CELL',
  SAVE_TABLE = 'SAVE_TABLE'
}

type Cell = {id: number, value: string};
// Define the reducer function
type TableAction = { type: ActionTypes; payload: {cell: Cell}};

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case ActionTypes.NEW_CELL:
      const {
				payload: {cell: {id, value}},
			} = action;
      state.currentTable[id] = value;
      return { ...state };
    case ActionTypes.MODIFY_CELL:
      return { ...state };
    case ActionTypes.SAVE_TABLE:
      return { ...state };
    default:
      return state;
  }
};

// Create the context
const TableContext = createContext<{ state: TableState; dispatch: React.Dispatch<TableAction> } | undefined>(undefined);

// Create a custom hook to access the context
export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

// Create a context provider component
interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider = ({ children }: TableProviderProps) => {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  return (
    <TableContext.Provider value={{ state, dispatch }}>
      {children}
    </TableContext.Provider>
  );
};
