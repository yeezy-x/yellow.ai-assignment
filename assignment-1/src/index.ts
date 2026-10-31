import express from "express"
import cors from "cors"

const app=express();

app.listen(3000,()=>{
    console.log("Weather API is running on port 3000");
});

console.log("Weather Manager started.")