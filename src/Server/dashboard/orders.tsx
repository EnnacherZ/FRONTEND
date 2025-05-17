import { useEffect, useState } from "react";
import { connecter } from "../connecter";


const getRemainingOrders = () => {
    const [remainingOrders, setRemainingOrders] = useState<Array<any>>([]);

    useEffect(()=>{
        const getRemainingOrdersFunction = async () =>{
            try{
                const response = await connecter.get('db/remaining_orders');
                setRemainingOrders(response.data.orders || []);
            }
            catch{}
        }
        getRemainingOrdersFunction();
    },[])

    return remainingOrders;


};
export default getRemainingOrders;