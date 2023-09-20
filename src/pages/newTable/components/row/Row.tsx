import React, { memo } from "react";

interface RowProps {
    onClick: () => void;
}

const Row: React.FC<RowProps> = ({onClick}) => {
    return (
        <td onClick={onClick}></td>
    );
};

export default memo(Row);