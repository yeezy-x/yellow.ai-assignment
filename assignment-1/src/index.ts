import { generateApology, getOrders, saveOrders, updateOrders } from "./services/order.service.js";
import { getWeatherForOrders } from "./services/weather.service.js";

async function main(){
    try{
        const orders=await getOrders()
        if(orders.length===0){
            console.log("No orders found");
            return
        }
        const weatherResults = await getWeatherForOrders(orders);
        const updatedOrders = updateOrders(weatherResults);
        for(const order of updatedOrders){
            if (order.status === "Delayed" && order.delayReason) {
              console.log(generateApology(order.customer, order.city, order.delayReason));
            }
        }
        await saveOrders(updatedOrders);
        console.log("\nFinal Order Status:\n")
        console.table(
            updatedOrders.map(({ order_id, customer, city, status, delayReason }) => ({
              order_id,
              customer,
              city,
              status,
              delayReason: delayReason ?? "—",
            }))
        );
    }catch(error){
        console.error("Application failed:", error);
    }
}

main()