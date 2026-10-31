import { getOrders, updateOrders } from "./services/order.service.js";
import { getWeatherForOrders } from "./services/weather.service.js";

async function main(){
    try{
        const orders=await getOrders()
        const weatherResults = await getWeatherForOrders(orders);
        const updatedOrders = updateOrders(weatherResults);
        for(const order of updatedOrders){
            console.log({
                order_id: order.order_id,
                customer: order.customer,
                city: order.city,
                status: order.status
            });
        }
    }catch(error){
        console.error("Application failed:", error);
    }
}

main()