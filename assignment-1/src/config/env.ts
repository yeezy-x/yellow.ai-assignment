import dotenv from "dotenv"
dotenv.config()

const API_KEY=process.env.OPENWEATHER_API_KEY

if(!API_KEY){
    throw new Error("OPENWEATHER_API_KEY is not set")
}

export const env={
    OPENWEATHER_API_KEY:API_KEY
}