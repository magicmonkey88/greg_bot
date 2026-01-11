const axios = require("axios");
const baseURL = "http://localhost:8080";

const character = async (characterId) => {
  const { data } = await axios.get(
    `${baseURL}/character/${characterId}?data=CJ`
  );

  return data;
};

const characterSearch = async (name, server) => {
  const { data } = await axios.get(
    `${baseURL}/character/search?name=${name}&server=${server}`
  );

  return data;
};

const freeCompany = async (fcId) => {
  const { data } = await axios.get(`${baseURL}/freecompany/${fcId}?data=FCM`);

  return data;
};

const freeCompanySearch = async (name, server) => {
  const { data } = await axios.get(
    `${baseURL}/freecompany/search?name=${name}&server=${server}`
  );

  return data;
};

module.exports = {
  character,
  characterSearch,
  freeCompany,
  freeCompanySearch,
};
