// redisClient.js
const redis = require('redis');
const client = redis.createClient({
  socket: {
    port: 6379,     // Redis default port
    host: '127.0.0.1'  // or 'localhost'
  }
});

client.on('error', (err) => console.error('Redis error:', err));
client.connect();

module.exports = client;
