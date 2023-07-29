import React from "react";
import { DEFAULT_COLORS } from "../utils/constants";

const Node = ({ node, mouseDown, updateNode }) => {
  const { isStart, isFinish, isWall, row, col } = node;

  const handleClick = () => {
    updateNode(node);
  };
  const handleMouseOver = (e) => {
    e.preventDefault();
    if (mouseDown) {
      updateNode(node);
    }
  };

  return (
    <td
      onClick={handleClick}
      id={`node-${row}-${col}`}
      onMouseOver={handleMouseOver}
      style={{
        backgroundColor: isStart
          ? DEFAULT_COLORS.start
          : isFinish
          ? DEFAULT_COLORS.finish
          : isWall && DEFAULT_COLORS.wall,
      }}
    ></td>
  );
};

export default Node;
