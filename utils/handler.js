const request=require('./request');
const {roundRobin,weightedRoundRobin}=require('./algorithms');

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
    performHealthCheck,
    weightedRoundRobinHandler,
    ipHash
}