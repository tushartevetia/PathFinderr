export const dijkstra = (START_NODE, FINISH_NODE, boardDimensions) =>
  new Promise((resolve) => {
    const visitedSet = [];
    const unvisitedSet = fillSet(boardDimensions);
    // By setting start node dist 0 we can have our 1st target node
    START_NODE.distance = 0;

    while (unvisitedSet.length) {
      // sort nodes by distance
      sortNodes(unvisitedSet);

      // set target node to node with lowest distance
      let targetNode = unvisitedSet.shift();

      if (targetNode.distance === Infinity) {
        resolve(visitedSet);
        return;
      }

      targetNode.isVisited = true;
      visitedSet.push(targetNode);

      if (targetNode.isWall) {
        continue;
      }
      if (targetNode === FINISH_NODE) {
        resolve(visitedSet);
        return;
      }

      updateSet(targetNode, boardDimensions);
    }
  });

//   new properties added for every node
const fillSet = (boardDimensions) => {
  let set = [];
  boardDimensions.forEach((row) => {
    row.forEach((node) => {
      node.isVisited = false;
      node.distance = Infinity;
      node.previousNode = undefined;
      set.push(node);
    });
  });

  return set;
};

const sortNodes = (unvisitedSet) => {
  unvisitedSet.sort((a, b) => a.distance - b.distance);
};

const updateSet = (targetNode, boardDimensions) => {
  const neighbours = getNeighbours(targetNode, boardDimensions);
  neighbours.forEach((neighbour) => {
    neighbour.distance = targetNode.distance + 1;
    neighbour.previousNode = targetNode;
  });
};

const getNeighbours = (targetNode, boardDimensions) => {
  const { col, row } = targetNode;
  let neighbours = [];
  let targetNeighbour;

  if (row > 0) {
    targetNeighbour = boardDimensions[row - 1][col];
    neighbours.push(targetNeighbour);
  }
  if (row < boardDimensions.length - 1) {
    targetNeighbour = boardDimensions[row + 1][col];
    neighbours.push(targetNeighbour);
  }
  if (col > 0) {
    targetNeighbour = boardDimensions[row][col - 1];
    neighbours.push(targetNeighbour);
  }
  if (col < boardDimensions[0].length - 1) {
    targetNeighbour = boardDimensions[row][col + 1];
    neighbours.push(targetNeighbour);
  }

  return neighbours.filter((neighbour) => !neighbour.isVisited);
};

export const getNodesInOrder = (FINISH_NODE) => {
  let arr = [];
  let targetNode = FINISH_NODE.previousNode;
  arr.push(targetNode);
  if (!targetNode) {
    return;
  }
  while (targetNode.previousNode !== undefined) {
    arr.push(targetNode.previousNode);
    targetNode = targetNode.previousNode;
  }

  // remove start node
  arr.pop();
  return arr.reverse();
};
