
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
  
    let server = null;
    let maxWeight = 0;
  
    for (const server of servers) {
      server.currentWeight += server.weight;
      if (server.currentWeight > maxWeight) {
        maxWeight = server.currentWeight;
        server = server;
      }
    }
    servers.forEach(server => (server.currentWeight = server.currentWeight % totalWeight));

    return server;
  };

module.exports={
    roundRobin,
    weightedRoundRobin
}