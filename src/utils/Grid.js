export const generateBoard = (
  DEFAULT_COLS,
  DEFAULT_ROWS,
  START_NODE,
  FINISH_NODE
) => {
  const neighbourNodes = fetchNeighbourNodes(START_NODE, FINISH_NODE);

  const tempBoard = [];
  for (let row = 0; row < DEFAULT_ROWS; row++) {
    const tempRow = [];
    for (let col = 0; col < DEFAULT_COLS; col++) {
      // setting start and end node values as true
      const isStart = row === START_NODE.row && col === START_NODE.col;
      const isFinish = row === FINISH_NODE.row && col === FINISH_NODE.col;

      // 20% chance of it will be a wall
      let isWall = Math.random() < 0.2;

      // neighbour nodes can not be a wall
      neighbourNodes.forEach((node) => {
        if (node.col === col && node.row === row) {
          isWall = false;
        }
      });
      if (isStart || isFinish) isWall = false;
      const node = {
        row: row,
        col: col,
        isWall: isWall,
        isFinish: isFinish,
        isStart: isStart,
        distance: Infinity,
        previousNode: null,
      };
      tempRow.push(node);
    }
    tempBoard.push(tempRow);
  }
  return tempBoard;
};

const fetchNeighbourNodes = (startNode, finishNode) => {
  const neighbourNodes = [];
  // START NODE NEIGHBOURS
  const topStart = { ...startNode, row: startNode.row + 1 };
  const bottomStart = { ...startNode, row: startNode.row - 1 };
  const leftStart = { ...startNode, col: startNode.col - 1 };
  const rightStart = { ...startNode, col: startNode.col + 1 };

  // FINISH NODE NEIGHBOURS
  const topFinish = { ...finishNode, row: finishNode.row + 1 };
  const bottomFinish = { ...finishNode, row: finishNode.row - 1 };
  const leftFinish = { ...finishNode, col: finishNode.col - 1 };
  const rightFinish = { ...finishNode, col: finishNode.col + 1 };

  neighbourNodes.push(
    topStart,
    bottomStart,
    leftStart,
    rightStart,
    topFinish,
    bottomFinish,
    leftFinish,
    rightFinish
  );

  return neighbourNodes;
};

export const fetchBoardDimensions = () => {
  const boardWidth = document.getElementById("board-wrap");
  const availableWidth = boardWidth?.offsetWidth - 30;
  const availableHeight = boardWidth?.offsetHeight - 30;
  const gridCols = Math.floor(availableWidth / 27);
  const gridRows = Math.floor(availableHeight / 27);

  return { gridCols, gridRows };
};
