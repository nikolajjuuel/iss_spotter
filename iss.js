const request = require('request');
ip_url = 'https://api.ipify.org?format=json';
coords_by_ip = 'https://freegeoip.app/json/';

const fetchMyIP = function (callback) {
    request(ip_url, (error, response, body) => {
        if (error) return callback(error, null);
        if (response.statusCode !== 200){
            callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
            return;
        }
        const ip = JSON.parse(body).ip;
       // console.log(ip);
        callback(null, ip);
    });
}


const fetchCoordsByIP = function (ip, callback){
    request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
        if (error) return callback(error, null);
        if (response.statusCode !== 200){
            callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
            return;
        }
        const data = JSON.parse(body);
        const latitude = data.latitude;
        const longitude = data.longitude;
        const coordinates = {
            latitude,
            longitude,
        }
       // console.log(coordinates);
        callback(null, coordinates);
    });
}

const fetchISSFlyOverTimes = function(coords, callback) {
    const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  
    request(url, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
        return;
      }
  
      const passes = JSON.parse(body).response;
      callback(null, passes);
    });
  };


  const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIP(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };




  module.exports = { fetchMyIP , fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };