const express=require('express');

const { roundRobinHandler }=require('./utils/handler');

const app=express();
const PORT=3000;

/* 

  Load Balancer implementation

*/

app.use("*",roundRobinHandler());

app.listen(PORT,()=>{
    console.log(`Load Balancer is running on port ${PORT}`);
});

// create servers
require('./utils/servers')