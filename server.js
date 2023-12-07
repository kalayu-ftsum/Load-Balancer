const express=require('express');

const config=require('./config/config');
const { roundRobinHandler,performHealthCheck, weightedRoundRobinHandler, ipHash, weightedResponseTimeHandler, weightedLeastConnectionsHandler }=require('./utils/handler');

const app=express();
const PORT=3000;

/* 

  Load Balancer implementation

*/

global.servers=config.servers

/*
 Servers health check
*/

// Perform initial health check
performHealthCheck();

// Schedule periodic health checks (every 10 seconds in this example)
const healthCheckInterval = setInterval(performHealthCheck, 10 * 1000);

app.use('/weightedLeastConnections',weightedLeastConnectionsHandler)
app.use('/weightedResponseTime',weightedResponseTimeHandler)
app.use('/iphash',ipHash);
app.use("/weightedRoundRobin",weightedRoundRobinHandler);
app.use("*",roundRobinHandler());

app.listen(PORT,()=>{
    console.log(`Load Balancer is running on port ${PORT}`);
});

// create servers
require('./utils/servers')