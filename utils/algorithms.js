
const roundRobin = (servers,currentIndex) => {
    const server = servers[currentIndex];
    currentIndex = (currentIndex + 1) % servers.length;
    return {
        server,
        currentIndex
    };
}

module.exports={
    roundRobin
}