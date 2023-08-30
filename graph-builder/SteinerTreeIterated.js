const Store = require('../models/store.model');
const { addPoint } = require('./graphBuilder');

// Function to find the Minimum Spanning Tree using Kruskal's algorithm
function findMST(vertices, graph) {
  // Helper function to find the root of a vertex in the union-find data structure
  function findRoot(vertex, parent) {
    if (parent[vertex] !== vertex) {
      parent[vertex] = findRoot(parent[vertex], parent);
    }
    return parent[vertex];
  }

  // Helper function to union two sets of vertices in the union-find data structure
  function union(x, y, parent, rank) {
    const rootX = findRoot(x, parent);
    const rootY = findRoot(y, parent);

    if (rootX !== rootY) {
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
    }
  }

  // Sort the edges in non-decreasing order of their weights
  const edges = [];
  for (const vertex of vertices) {
    const distances = graph.find(node => node.storeId === vertex).distances;
    for (const neighborId in distances) {
      edges.push({
        source: vertex,
        target: neighborId,
        weight: distances[neighborId]
      });
    }
  }
  edges.sort((a, b) => a.weight - b.weight);

  const parent = {};
  const rank = {};

  for (const vertex of vertices) {
    parent[vertex] = vertex;
    rank[vertex] = 0;
  }

  const mstEdges = [];
  let mstWeight = 0;

  for (const edge of edges) {
    if (findRoot(edge.source, parent) !== findRoot(edge.target, parent)) {
      mstEdges.push(edge);
      mstWeight += edge.weight;
      union(edge.source, edge.target, parent, rank);
    }
  }

  return mstEdges;
}

// Find Shortest Path using Dijkstra's algorithm with a simple priority queue
function findShortestPath(start, end, graph) {
  // Helper function to get the minimum vertex from the queue based on distances
  function getMinVertex(queue, distances) {
    let minDist = Infinity;
    let minVertex = null;
    for (const vertex of queue) {
      if (distances[vertex] < minDist) {
        minDist = distances[vertex];
        minVertex = vertex;
      }
    }
    return minVertex;
  }

  const queue = new Set();
  const distances = {};
  const previous = {};

  // Initialize distances with Infinity, except for the start vertex
  for (const vertex of graph) {
    distances[vertex.storeId] = Infinity;
    previous[vertex.storeId] = null;
    queue.add(vertex.storeId);
  }
  distances[start] = 0;

  while (queue.size > 0) {
    const minVertex = getMinVertex(queue, distances);

    if (minVertex === end) {
      break; // Reached the end vertex
    }

    queue.delete(minVertex);

    // Check if the current node exists in the graph
    const currentNode = graph.find((node) => node.storeId === minVertex);
    if (!currentNode || !currentNode.distances) {
      continue;
    }

    // Update distances and previous vertices
    for (const neighborId in currentNode.distances) {
      const alt = distances[minVertex] + currentNode.distances[neighborId];
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = minVertex;
      }
    }
  }

  // Reconstruct the path
  const shortestPath = [];
  let current = end;
  while (current !== null) {
    shortestPath.unshift(current);
    current = previous[current];
  }

  return { path: shortestPath, distance: distances[end] };
}


// Function to check if T spans all terminals
function spansAllTerminals(T, terminals) {
  for (const terminal of terminals) {
    if (!T.has(terminal)) {
      return false;
    }
  }
  return true;
}

// Function to create the terminal nodes for the Steiner tree
const createTerminalNode = async (items) => {
  try {
    const stores = await Store.find({ items: { $in: items } }).select('_id').exec();
    const storeIds = stores.map(store => store._id.toString());
    return storeIds;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Find Iterated 1.5-Approximation Steiner Tree
async function findIteratedSteinerTree(graph, terminals, startingPoint) {
  // Initialize the tree T with one given terminal vertex
  graph = await addPoint(graph, startingPoint);
  console.log(graph);
  let T = new Set();
  T.add(startingPoint.storeId);

  // Loop until T spans all terminals
  while (!spansAllTerminals(T, terminals)) {
    let closestTerminal = null;
    let shortestPath = null;
    let shortestDistance = Infinity;

    // Find the closest terminal not in T
    for (const terminal of terminals) {
      if (!T.has(terminal)) {
        const { path, distance } = findShortestPath(terminals[0], terminal, graph);

        if (distance < shortestDistance) {
          closestTerminal = terminal;
          shortestPath = path;
          shortestDistance = distance;
        }
      }
    }

    // Find MST between T and the closest terminal
    console.log("finding mst..");
    const MST = findMST([...T, closestTerminal], graph);

    // Add the edges of the MST to T
    for (const edge of MST) {
      T.add(edge.source);
      T.add(edge.target);
    }
  }

  return Array.from(T); // Convert the Set back to an array and return the Steiner Tree as store IDs
}

module.exports = { createTerminalNode, findIteratedSteinerTree };
