const express=require('express');

const config=require('./config/config');
const { roundRobinHandler,performHealthCheck }=require('./utils/handler');

const app=express();
const PORT=3000;

/* 

  Load Balancer implementation

*/

global.servers=config.servers.map(server=>({url:server,isHealthy:true}))

/*
 Servers health check
*/

// Perform initial health check
performHealthCheck();

// Schedule periodic health checks (every 5 minutes in this example)
const healthCheckInterval = setInterval(performHealthCheck, 10 * 1000);

app.use("*",roundRobinHandler());

app.listen(PORT,()=>{
    console.log(`Load Balancer is running on port ${PORT}`);
});

// create servers
require('./utils/servers')