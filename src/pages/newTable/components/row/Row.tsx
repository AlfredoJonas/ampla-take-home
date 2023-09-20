import React, { memo } from "react";
import { useTable } from "../../../../context/Table";

interface RowProps {
  id: number,
  onClick: () => void;
}

const Row: React.FC<RowProps> = ({ id, onClick }) => {
  const { state: { currentTable } } = useTable();

  return (
    <td onClick={onClick}>{id in currentTable && currentTable[id]}</td>
  );
};

export default memo(Row);