import axios from 'axios';

const instance = axios.create({baseURL: "http://192.168.1.102:6001", responseType: "json"});

const Get = async () =>
{
    return instance.get('/api/hello');
}

// const Start = () => {
//         console.log('requst');
//         axios.get("http://localhost:6001").then(r=>console.log(r));
//         //console.log(response);
//     }


module.exports = {
    Get
}