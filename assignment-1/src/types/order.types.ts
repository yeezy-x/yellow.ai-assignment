import { WeatherResponse } from "./weather.types.js";

export interface Order{
    order_id:string;
    customer:string;
    city:string
    status:"Pending"|"Delayed"
}

export interface OrderWeatherResult{
    order:Order
    weather:WeatherResponse | null
    error:string | null
}