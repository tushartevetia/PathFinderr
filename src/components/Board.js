import React, { useContext, useEffect, useState } from "react";
import "../styles/_board.scss";
import { fetchBoardDimensions, generateBoard } from "../utils/Grid";
import Node from "./Node";
import { GlobalContext } from "../utils/GlobalContext";
import { DEFAULT_COLORS } from "../utils/constants";
import { styled } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { dijkstra, getNodesInOrder } from "../algorithms/dijkstra";
import { visualizeDijkstra, visulaizePath } from "../utils/VisualizeDijkstra";
// import ResetBoard, { resetBoard } from "../utils/ResetBoard";

const Board = () => {
  const [mouseDown, setMouseDown] = useState(false);

  const {
    isAnimating,
    setIsAnimating,
    success,
    setSuccess,
    speed,
    isResetting,
    setIsResetting,
    startNode,
    setStartNode,
    finishNode,
    setFinishNode,
    boardDimensions,
    setBoardDimensions,
    resetBoard,
    setResetDimensions,
    mode,
    setMode,
    setPreviousNode,
    setIsProcessingNode,
    colors,
  } = useContext(GlobalContext);

  useEffect(() => {
    const { gridCols, gridRows } = fetchBoardDimensions();

    // start node temporary posn
    const tempStartNode = {
      col: randomIntFromInterval(1, gridCols - 1),
      row: randomIntFromInterval(1, gridRows - 1),
    };
    // finish node temporary posn
    const tempFinishtNode = {
      col: randomIntFromInterval(1, gridCols - 1),
      row: randomIntFromInterval(1, gridRows - 1),
    };

    setStartNode(tempStartNode);
    setFinishNode(tempFinishtNode);

    const boardDimensions = generateBoard(
      gridCols,
      gridRows,
      tempStartNode,
      tempFinishtNode
    );

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    setResetDimensions({ gridRows, gridCols });
    setBoardDimensions(boardDimensions);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (mode.start || mode.finish || mode.wall) {
      handleMode();
    }
  }, [mode]);

  const handleMode = () => {
    // reset previous node
    setPreviousNode(null);
    const startDomEl = document.getElementById(
      `node-${startNode.row}-${startNode.col}`
    );
    const finishDomEl = document.getElementById(
      `node-${finishNode.row}-${finishNode.col}`
    );

    // add blink on click start node
    if (mode.start) {
      startDomEl.classList.add("node_blink");
    }

    // add blink on finish node click
    if (mode.finish) {
      finishDomEl.classList.add("node_blink");
    }
  };

  const handleDijkstra = async () => {
    setIsAnimating(true);
    const start = boardDimensions[startNode.row][startNode.col];
    const finish = boardDimensions[finishNode.row][finishNode.col];

    // fix dupe nodes
    boardDimensions.forEach((row) => {
      row.forEach((node) => {
        if (node.isFinish) {
          if (node.row === finishNode.row && node.col === finishNode.col)
            return;
          node.isFinish = false;
        }
        if (node.isStart) {
          if (node.row === startNode.row && node.col == startNode.col) return;
          node.isStart = false;
        }
      });
    });

    const visitedSet = await dijkstra(start, finish, boardDimensions);

    await visualizeDijkstra(visitedSet, speed);
    const nodesInOrder = getNodesInOrder(finish);

    if (!nodesInOrder) {
      setIsAnimating(false);
      setSuccess(true);
      return;
    }
    setTimeout(async () => {
      await visulaizePath(nodesInOrder);
      setIsAnimating(false);
      setSuccess(true);
    }, 250);
  };

  const handleMouseDown = () => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const updateNode = (target) => {
    const { row, col, isWall, isStart, isFinish } = target;
    const nodeElement = document.getElementById(`node-${row}-${col}`);
    if (isAnimating) {
      return;
    }
    // if user clicks on start node
    if (mode.start) {
      setIsProcessingNode(true);
      if (isFinish || isWall) {
        return;
      }
      setStartNode({ col, row });
      const prevStartElement = document.getElementById(
        `node-${startNode.row}-${startNode.col}`
      );

      prevStartElement.classList.remove("node_blink");
      nodeElement.style.backgroundColor = colors.start;
      setMode({ ...mode, start: false });

      // update start node in board state
      let updatedBoard = [];
      boardDimensions.forEach((tempRow, index, array) => {
        let updatedRow = [];
        tempRow.forEach((node) => {
          if (node.isStart) {
            node.isStart = false;
          }
          if (node.col === col && node.row === row) {
            node.isStart = true;
          }
          updatedRow.push(node);
        });
        updatedBoard.push(updatedRow);
      });
      setBoardDimensions(updatedBoard);
      setTimeout(() => {
        setIsProcessingNode(false);
      }, 1500);
      return;
    }

    // if user clicks on finish node
    if (mode.finish) {
      setIsProcessingNode(true);
      if (isStart || isWall) {
        return;
      }
      setFinishNode({ col, row });
      const prevFinishElement = document.getElementById(
        `node-${finishNode.row}-${finishNode.col}`
      );
      prevFinishElement.classList.remove("node_blink");
      nodeElement.style.backgroundColor = colors.finish;
      setMode({ ...mode, finish: false });

      // update finish node in board state
      let updatedBoard = [];
      boardDimensions.forEach((tempRow, index, array) => {
        let updatedRow = [];
        tempRow.forEach((node) => {
          if (node.isFinish) {
            node.isFinish = false;
          }
          if (node.col === col && node.row === row) {
            node.isFinish = true;
          }
          updatedRow.push(node);
        });
        updatedBoard.push(updatedRow);
      });
      setBoardDimensions(updatedBoard);
      setTimeout(() => {
        setIsProcessingNode(false);
      }, 1500);
      return;
    }

    // set a wall on click or mouseover
    if (!isWall && !(isStart || isFinish)) {
      target.isWall = true;
      nodeElement.style.background = DEFAULT_COLORS.wall;
    }
  };

  return (
    <div className="board-wrap" id="board-wrap">
      <table className="board">
        <tbody>
          {boardDimensions &&
            boardDimensions.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  {row.map((node) => {
                    return (
                      <Node
                        mouseDown={mouseDown}
                        node={node}
                        updateNode={updateNode}
                        key={`node-${node.row}-${node.col}`}
                      />
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <VisualizeButton
        className="visualize"
        onClick={success ? resetBoard : handleDijkstra}
        endIcon={success ? <RestartAltIcon /> : <AutoFixHighIcon />}
        loading={isAnimating}
        loadingPosition="end"
        variant="contained"
      >
        {isAnimating
          ? "animating..."
          : success
          ? isResetting
            ? "resetting..."
            : "Reset"
          : "Visualize"}
      </VisualizeButton>
    </div>
  );
};

export default Board;

const VisualizeButton = styled(LoadingButton)({
  color: "#cfc4ff",
  backgroundColor: "#3f22c0",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "&:disabled": {},
});
