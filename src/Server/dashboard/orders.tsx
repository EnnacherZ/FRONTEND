import { useEffect, useState } from "react";
import apiInstance from "../../dashboard/api";


const connecter = apiInstance;

const getRemainingOrders = () => {
    const [allOrders, setAllOrders] = useState<Array<any>>([]);
    const [remainingOrders, setRemainingOrders] = useState<Array<any>>([]);
    const [deliveredOrders, setDeliveredOrders] = useState<Array<any>>([]);

    useEffect(()=>{
        const getRemainingOrdersFunction = async () =>{
            try{
                const response = await connecter.get('db/orders/getOrders');
                setAllOrders(response.data.allOrders || []);
                setRemainingOrders(response.data.remainingOrders || []);
                setDeliveredOrders(response.data.deliveredOrders || []);

            }
            catch{}
        }
        getRemainingOrdersFunction();
    },[])

    return {remainingOrders, allOrders, deliveredOrders};


};
export default getRemainingOrders;

