const axios = require('axios');

async function tiktok(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set('url', query);
      encodedParams.set('hd', '1');

      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });
      const video = response.data.data;
      resolve(video); 
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { tiktok };