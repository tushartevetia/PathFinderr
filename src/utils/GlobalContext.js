import { createContext, useState } from "react";
import { generateBoard } from "./Grid";

export const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [colors, setColors] = useState({
    start: "#73f2b0",
    finish: "#C41E3A",
    wall: "#003549",
  });
  const [mode, setMode] = useState({
    start: false,
    finish: false,
    wall: false,
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [speed, setSpeed] = useState(6);
  const [isResetting, setIsResetting] = useState(false);
  const [startNode, setStartNode] = useState({ col: 1, row: 1 });
  const [finishNode, setFinishNode] = useState({ col: 2, row: 2 });
  const [boardDimensions, setBoardDimensions] = useState([]);
  const [resetDimensions, setResetDimensions] = useState({});
  const [isProcessingNode, setIsProcessingNode] = useState(false);
  const [previousNode, setPreviousNode] = useState(null);

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const resetBoard = () => {
    if (isResetting) {
      return;
    }
    setIsResetting(true);
    const visitedNodes = Array.from(
      document.getElementsByClassName("node-visited")
    );
    visitedNodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.contains("node-path") &&
          node.classList.remove("node-path");
        node.classList.remove("node-visited");
      }, 1 * index);
    });

    setTimeout(() => {
      const tempStartNode = {
        col: randomIntFromInterval(1, resetDimensions.gridCols - 1),
        row: randomIntFromInterval(1, resetDimensions.gridRows - 1),
      };
      const tempFinishNode = {
        col: randomIntFromInterval(1, resetDimensions.gridCols - 1),
        row: randomIntFromInterval(1, resetDimensions.gridRows - 1),
      };
      const resetBoard = generateBoard(
        resetDimensions.gridCols,
        resetDimensions.gridRows,
        tempStartNode,
        tempFinishNode
      );

      setStartNode(tempStartNode);
      setFinishNode(tempFinishNode);
      setBoardDimensions(resetBoard);
      setSuccess(false);
      setIsResetting(false);
    }, 1 * visitedNodes.length);
  };

  const value = {
    isAnimating,
    setIsAnimating,
    success,
    setSuccess,
    speed,
    setSpeed,
    isResetting,
    setIsResetting,
    startNode,
    setStartNode,
    previousNode,
    setPreviousNode,
    finishNode,
    setFinishNode,
    boardDimensions,
    setBoardDimensions,
    resetDimensions,
    setResetDimensions,
    resetBoard,
    colors,
    setColors,
    loaded,
    setLoaded,
    isProcessingNode,
    setIsProcessingNode,
    mode,
    setMode,
    showSidebar,
    setShowSidebar,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
