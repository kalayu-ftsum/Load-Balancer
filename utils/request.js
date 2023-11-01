const axios=require('axios');

module.exports=async(server,req)=>{
    const { method, url, headers, body } = req;
    return await axios({
        url: `${server}${url}`,
        method: method,
        headers: headers,
        data: body
    });
}