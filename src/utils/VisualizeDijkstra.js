export const visualizeDijkstra = (visitedSet, speed) =>
  new Promise((resolve) => {
    visitedSet.forEach((node, index) => {
      setTimeout(() => {
        // no animation on start finish and wall node
        if (node.isStart || node.isFinish || node.isWall) {
          return;
        }
        document
          .getElementById(`node-${node.row}-${node.col}`)
          .classList.add("node-visited");
      }, speed * index);
    });

    setTimeout(() => {
      resolve();
    }, speed * visitedSet.length);
  });

export const visulaizePath = (nodesInOrder) =>
  new Promise((resolve) => {
    nodesInOrder.forEach((node, index) => {
      setTimeout(() => {
        document
          .getElementById(`node-${node.row}-${node.col}`)
          .classList.add("node-path");
      }, 70 * index);
    });
    setTimeout(() => {
      resolve();
    }, 70 * nodesInOrder.length);
  });
