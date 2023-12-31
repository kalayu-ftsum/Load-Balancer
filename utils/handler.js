const request=require('./request');
const {roundRobin,weightedRoundRobin,weightedResponseTime,weightedLeastConnections}=require('./algorithms');

const getHealthyServers=()=>{
    let healthyServers=global.servers.filter(server=>server.isHealthy);
    return healthyServers;
}
const roundRobinHandler = () =>{
    let current = 0;
    return async (req, res)=>{
       const {server,currentIndex} = roundRobin(getHealthyServers().map(server=>server.url),current);
        current=currentIndex;
        try{
            const response = await request.makeRequest(server,req);
            res.send(response.data);
        }
        catch(err){
            res.status(500).send("Server error!") ;
        }
   } 
}

const weightedRoundRobinHandler= async (req, res)=>{
     const server = weightedRoundRobin(getHealthyServers());
      try{
          const response = await request.makeRequest(server.url,req);
          res.send(response.data);
      }
      catch(err){
          res.status(500).send("Server error!") ;
      }
 } 

 const hashCode=(ip)=>{
  let hash = 0;
  if (ip.length === 0) return hash;

  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
}
const ipHash= async (req, res)=>{
  const clientIp = req.ip;

  const hash = hashCode(clientIp);
  const servers=getHealthyServers()
  const index = hash % servers.length;
  const server=servers[index];

   try{
       const response = await request.makeRequest(server.url,req);
       res.send(response.data);
   }
   catch(err){
       res.status(500).send("Server error!") ;
   }
} 

const weightedResponseTimeHandler=async (req, res)=>{
  const server = weightedResponseTime(getHealthyServers());
   try{
       if(!server) return  res.status(500).send("Server error!") ;
       const response = await request.makeRequest(server.url,req);
       res.send(response.data);
   }
   catch(err){
       res.status(500).send("Server error!") ;
   }
} 

const weightedLeastConnectionsHandler=async (req, res)=>{
  const server = weightedLeastConnections(getHealthyServers());
   try{
       if(!server) return  res.status(500).send("Server error!") ;
       const response = await request.makeRequest(server.url,req);
       res.send(response.data);
   }
   catch(err){
       res.status(500).send("Server error!") ;
   }
} 
const performHealthCheck =async()=> {
    for (const server of global.servers) {
      try {
        const startTime = Date.now();
        const response = await request.get(`${server.url}/health`);
        const endTime = Date.now();
        if(response.data.loadAvg > 60){
          server.isHealthy=false;
          server.responseTime = Infinity;
          continue;
        }
        
        if (response.status >= 200 && response.status < 300) {
          server.isHealthy = true;
          server.responseTime = endTime - startTime;
        } else {
          server.isHealthy = false;
          server.responseTime = Infinity;
        }
      } catch (error) {
        server.isHealthy = false;
        server.responseTime = Infinity;
      }
    }
  };

module.exports={
    roundRobinHandler,
    performHealthCheck,
    weightedRoundRobinHandler,
    ipHash,
    weightedResponseTimeHandler,
    weightedLeastConnectionsHandler
}