import axios from 'axios';

class apiRes {
  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:4000/api/',
      timeout: 10000, 
      headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin':'*',
      }
    });
    // this.http.interceptors.request.use(function(config){
    //   return config;
    // },function(error){
    //   return Promise.reject(error);
    // });
    // this.http.interceptors.response.use(function(config){
    //   if(this.http.interceptors.response.status==200){
    //     return this.http.interceptors.response.data;
    //   }
    //   else{
    //     console.error(this.http.interceptors.response);
    //   }
    //   return this.http.interceptors.response;
    // },function(error){
    //   return Promise.reject(error);
    // });
  }

  get(url, config) {
    return this.http.get(url, config)
      .then(response => response.data)
      .catch(error => {
        console.error(error);
        throw error;
      });
  }

  post(url, data, config) {
    return this.http.post(url, data, config)
      .then(response => response.data)
      .catch(error => {
        console.error(error);
        throw error;
      });
  }

  put(url, data, config) {
    return this.http.put(url, data, config)
      .then(response => response.data)
      .catch(error => {
        console.error(error);
        throw error;
      });
  }

  delete(url, config) {
    return this.http.delete(url, config)
      .then(response => response.data)
      .catch(error => {
        console.error(error);
        throw error;
      });
  }
}


export default new apiRes();