
const roundRobin = (servers,currentIndex) => {
    const server = servers[currentIndex];
    currentIndex = (currentIndex + 1) % servers.length;
    return {
        server,
        currentIndex
    };
}

const weightedRoundRobin= (servers) => {

    const totalWeight = servers.reduce((sum, server) => sum + server.weight, 0);
  
    let selectedServer = null;
    let maxWeight = 0;
  
    for (const server of servers) {
      server.currentWeight += server.weight;
      if (server.currentWeight > maxWeight) {
        maxWeight = server.currentWeight;
        selectedServer = server;
      }
    }
    servers.forEach(server => (server.currentWeight = server.currentWeight % totalWeight));
    return selectedServer;
  };

  const weightedResponseTime = (servers) => {
    let selectedServer = servers[0];
    let lowestWeightedResponseTime = Infinity;
  
    for (const server of servers) {
        const weightedResponseTime = server.responseTime * server.weight;
  
        if (weightedResponseTime < lowestWeightedResponseTime) {
          lowestWeightedResponseTime = weightedResponseTime;
          selectedServer = server;
        }
    }
  
    return selectedServer;
  };

  const weightedLeastConnections = (servers) => {
    if(!servers) return null;
    let selectedServer = servers[0];
    let lowestWeightedConnections = Infinity;
  
    for (const server of servers) {
        const weightedConnections = server.connections / server.weight;
  
        if (weightedConnections < lowestWeightedConnections) {
          lowestWeightedConnections = weightedConnections;
          selectedServer = server;
        }
    }
    return selectedServer;
  };
  
module.exports={
    roundRobin,
    weightedRoundRobin,
    weightedResponseTime,
    weightedLeastConnections
}