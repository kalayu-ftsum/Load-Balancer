const request=require('./request');
const {roundRobin}=require('./algorithms');

const roundRobinHandler = () =>{
    let current = 0;
    return async (req, res)=>{
        let healthyServers=global.servers.filter(server=>server.isHealthy).values()
        const {server,currentIndex} = roundRobin(healthyServers,current);
        current=currentIndex;
        try{
            const response = await request.makeRequest(server,req)
            res.send(response.data);
        }
        catch(err){
            res.status(500).send("Server error!") ;
        }
   } 
}

const performHealthCheck =async()=> {
    console.log('check health')
    for (const server of global.servers) {
      try {
        const response = await request.get(`${server.url}/health`);
        
        if (response.status >= 200 && response.status < 300) {
          server.isHealthy = true;
        } else {
          server.isHealthy = false;
        }
      } catch (error) {
        server.isHealthy = false;
      }
    }
  };


module.exports={
    roundRobinHandler,
    performHealthCheck
}