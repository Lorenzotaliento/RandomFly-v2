const { getToken } = require('./services/amadeus');

async function test() {
  try {
    const token = await getToken();
    console.log('Token ottenuto:', token);
  } catch (error) {
    console.log('Errore:', error);
  }
}

test();