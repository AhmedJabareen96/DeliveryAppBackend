require('dotenv').config();
const axios = require('axios');

// Get distance between two points
async function getDistance(point1, point2) {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${point1.lat},${point1.lng}&destination=${point2.lat},${point2.lng}&key=${process.env.API_KEY}`;
    // console.log('Fetching distance from:', url);
    const response = await axios.get(url);
    // console.log('Response:', response.data);
    const { routes } = response.data;
    if (routes.length > 0) {
      const { legs } = routes[0];
      if (legs.length > 0) {
        const { distance } = legs[0];
        return distance.value / 1000; // Distance in kilometers
      }
    }
    throw new Error('Unable to calculate distance');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Builds a graph
// given N points
// build a graph G = <V, E>
// s.t |V|=N. The weigth on 
// edges equals the distance found by getDistance
// method above, s.t for each e, w(e)>0.
// Return and array of objects that represent the graph
async function buildGraph(points) {
  const graph = {};

  for (let i = 0; i < points.length; i++) {
    const currentPoint = points[i];
    const distances = {};

    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        const otherPoint = points[j];
        const distance = await getDistance(currentPoint, otherPoint);
        distances[otherPoint.storeId] = distance;
      }
    }

    graph[currentPoint.storeId] = {
      ...currentPoint,
      distances,
    };
  }

  return Object.values(graph); 
}


// Add a point to the graph.
// mainly used to add driver's location to
// calculate routes
async function addPoint(graph, driverLocation) {
  const distances = {};

  // Calculate distances from the driver's location to all existing points in the graph
  for (const existingPoint of graph) {
    const distance = await getDistance(driverLocation, existingPoint);
    distances[existingPoint.storeId] = distance;
  }

  // Add the driver's location to the graph
  graph.push({
    ...driverLocation,
    distances,
  });

  // Update the distances of existing points to the driver's location
  for (const existingPoint of graph) {
    const distance = await getDistance(existingPoint, driverLocation);
    existingPoint.distances[driverLocation.storeId] = distance;
  }

  return graph;
}



module.exports = {buildGraph, addPoint, getDistance};
