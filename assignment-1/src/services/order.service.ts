import fs from "node:fs/promises"
import type { Order, OrderWeatherResult } from "../types/order.types.js";
import { DELAY_WEATHER_CONDITIONS } from "./weather.service.js";

function shouldDelayDelivery(weatherCondition: string): boolean {
    return DELAY_WEATHER_CONDITIONS.includes(weatherCondition as (typeof DELAY_WEATHER_CONDITIONS)[number]);
}

export async function getOrders():Promise<Order[]>{
    try{
        const data=await fs.readFile("orders.json","utf-8");
        const orders:Order[]=JSON.parse(data);
        return orders
    }catch(error){
        console.error("Error reading orders file:",error);
        throw error
    }
}

export function updateOrders(results:OrderWeatherResult[]):Order[]{
   return results.map((result)=>{
    const {order,weather}=result
    if(!weather) return order
    const weatherCondition=weather.weather[0]?.main
    if(!weatherCondition) return order
    const isDelayed=shouldDelayDelivery(weatherCondition)
    return {
        ...order,
        status:isDelayed?"Delayed":order.status
    }
   })
}