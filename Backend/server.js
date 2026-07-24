require("dotenv").config();



const app = require("./src/app");
const connectDB = require("./src/config/db");
const redisConnect = require('./src/config/redis');
const PORT = process.env.PORT || 3000;

(async () => {
    await connectDB();
    // await redisConnect();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();