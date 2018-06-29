import React from "react";
import "./Palette.css";

const Color = ({ color, onClick }) => {
    return <li onClick={onClick} style={{ backgroundColor: color }} />;
};

const Palette = ({ colors, onClick }) => {
    return (
        <ul>
            {colors.map((color, i) => (
                <Color key={color} onClick={() => onClick(i)} color={color} />
            ))}
        </ul>
    );
};

export default Palette;
