const midPoint = {
    latitude: 51.498733,
    longitude: -0.179461,
};

const getHandoff = async () => {

  var axios = require('axios');

  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${midPoint.latitude}%2C${midPoint.longitude}&rankby=distance&type=gas_station&key=AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY`,
    headers: { }
  };

  axios(config)
  .then(function (response) {
    console.log(response.data["results"][0]["geometry"]["location"]);
  })
  .catch(function (error) {
    console.log(error);
  });
};

getHandoff();