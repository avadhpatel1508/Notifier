const IORedis = require("ioredis");

const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: "default",
    password: process.env.REDIS_PASS,
    maxRetriesPerRequest: null,
});

connection.on("connect", ()=>{
    console.log("Redis connected");
})
connection.on("error", (err) => {
    console.log("Redis Error:", err.message);
});

module.exports = connection;