import { env } from "../config/env.js";
import { Order, OrderWeatherResult } from "../types/order.types.js";
import type { WeatherResponse } from "../types/weather.types.js";

export async function getWeather(city:string):Promise<WeatherResponse>{
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${env.OPENWEATHER_API_KEY}&units=metric`
    const response=await fetch(url)
    if(!response.ok){
        throw new Error(`Failed to fetch weather data for ${city}`)
    }
    return (await response.json()) as WeatherResponse;
}

export async function getWeatherForOrders(orders: Order[]): Promise<OrderWeatherResult[]> {
  const results=await Promise.allSettled(orders.map(order=>getWeather(order.city)))
  return results.map((result, index) => {
    const order = orders[index]!;
    if (result.status === "fulfilled") {
        return {
            order,
            weather: result.value,
            error: null
        };
    }
    console.error(`Failed to fetch weather for ${order.city}:`,result.reason)
    return {
      order,
      weather: null,
      error: result.reason instanceof Error ? result.reason.message : String(result.reason)
    }
  })
}