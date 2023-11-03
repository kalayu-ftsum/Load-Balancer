module.exports = {
    servers: [
        {
            url: "http://localhost:3001",
            weight: 1,
            currentWeight:0,
            isHealthy: true
        },
        {
            url: "http://localhost:3002",
            weight: 2,
            currentWeight:0,
            isHealthy: true
        },
    ]
}