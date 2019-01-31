const express = require('express');
const axios = require('axios');
// Create the server
const app = express();

const appID = '{APP_ID}';;
const apiKey = '{API_KEY}';
const agentUID = '{AGENT_UID}';

const url = 'https://api.cometchat.com/v1/';

const headers = {
  'Content-Type': 'application/json',
  appid: appID,
  apikey: apiKey,
};

app.get('/api/create', (req, res) => {
  let data = {
    uid: new Date().getTime(),
    name: 'customer',
  };
  axios
    .post(url + 'users', JSON.stringify(data), {
      headers: headers,
    })
    .then(response => {
      requestAuth(response.data.data.uid)
        .then(response => {
          console.log('Success:' + JSON.stringify(response));
          res.json(response);
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
});

app.get('/api/auth', (req, res) => {
  const uid = req.query.uid;
  requestAuth(uid)
    .then(response => {
      console.log('Success:' + JSON.stringify(response));
      res.json(response);
    })
    .catch(error => console.error('Error:', error));
});

const requestAuth = uid => {
  return new Promise(function(resolve, reject) {
    axios
      .post(url + 'users/' + uid + '/auth_tokens', null, {
        headers: headers,
      })
      .then(response => {
        console.log('New Auth Token:', response.data);
        resolve(response.data.data);
      })
      .catch(error => reject(error));
  });
};

app.get('/api/users', (req, res) => {
  axios
    .get(url + 'users', {
      headers: headers,
    })
    .then(response => {
      const {data} = response.data;
      var filteredData = data.filter(function(data) {
        return data.uid != agentUID;
      });
      res.json(filteredData);
    })
    .catch(error => console.error('Error:', error));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
