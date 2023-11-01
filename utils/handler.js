const request=require('./request');
const {roundRobin}=require('./algorithms');
const config=require('../config/config');

const roundRobinHandler = () =>{
    let current = 0;
    return async (req, res)=>{
        const {server,currentIndex} = roundRobin(config.servers,current);
        current=currentIndex;
        try{
            const response = await request(server,req)
            res.send(response.data);
        }
        catch(err){
            res.status(500).send("Server error!") ;
        }
   } 
}


module.exports={
    roundRobinHandler
}