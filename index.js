const app =require("./app");
const connectWithDb = require("./config/db");
const dotenv = require("dotenv").config();

connectWithDb();

app.listen(process.env.PORT,()=>{
    console.log(`server is running at last port ${process.env.PORT}`)
});