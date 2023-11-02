const axios=require('axios');

const makeRequest=async(server,req)=>{
    const { method, url, headers, body } = req;
    return await axios({
        url: `${server}${url}`,
        method: method,
        headers: headers,
        data: body
    });
}

module.exports={
    makeRequest,
    get:axios.get,
    post:axios.post,
    put:axios.put,
    delete:axios.delete,
    head:axios.head
}