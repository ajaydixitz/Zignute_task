const { createClient } = require('@redis/client');

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
