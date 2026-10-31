import fs from "node:fs/promises"
import type { Order, OrderWeatherResult } from "../types/order.types.js";
import { WeatherResponse } from "../types/weather.types.js";

export function shouldDelayDelivery(weather: WeatherResponse["weather"][number]):boolean{
    const {id,main}=weather
    if (typeof id === "number" && !Number.isNaN(id)) {
        if (id === 800 || (id >= 801 && id <= 804)) return false;
        return true;
    }
    return main !== "Clear" && main !== "Clouds";
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
    const entry=weather.weather[0]
    if(!entry || !shouldDelayDelivery(entry)) return order
    return { ...order, status: "Delayed", delayReason: entry.description };
   })
}

export async function saveOrders(orders:Order[]):Promise<void>{
    try{
        const data=JSON.stringify(orders,null,2)
        await fs.writeFile("updated_orders.json",data,"utf-8")
        console.log("\nUpdated orders saved to updated_orders.json")
    }catch(error){
        console.error("Error saving orders:",error);
        throw error
    }
}

export function generateApology(
    name: string,
    city: string,
    weatherDescription: string): string {
    return `Hi ${name}, your request to deliver to ${city} is delayed due to ${weatherDescription}.`;
}