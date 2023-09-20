import React from "react";

interface RowProps {
    key: number;
}

const Row: React.FC<RowProps> = ({key}) => {
    return (
        <td key={key}></td>
    );
};

export default Row;