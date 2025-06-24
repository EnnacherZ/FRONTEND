import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { connecter } from "../Server/connecter";
import Header from "./header";
import icon from "../assets/FIRDAOUS STORE.png";
import "../Styles/orderTracking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faGear, faSearch, faShippingFast, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";




const OrderTracker :React.FC = () => {
    const {orderID} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>()
    const [orderFound, setOrderFound] = useState<boolean>();
    const [orderState, setOrderState] = useState<boolean>();
    const [client, setClient] = useState<any>()

    useEffect(()=>{
        const checkOrder = async () => {
            setIsLoading(true);
            try{
            const response = await connecter.get(`api/checkOrder?orderID=${orderID}`);
            const data = await response.data
            
            if(data.error){
                setError(true)
            }
            else{
                setOrderFound(data.found);
                setOrderState(data.state);
                setClient(data.client)

            }                
            }catch(err){
            }finally{
                setIsLoading(false);
            }
        }
        checkOrder()
    }, [orderID])





return(<>
    <Header/>
    <Link to='/Home'>
      <div className="d-flex justify-content-center">
        <div className="order-tracking-icon mb-5 mt-4" >
          <img src={icon} alt="" />
        </div>
      </div>
    </Link>

    <div className="d-flex justify-content-center fs-2 fw-bold" style={{color:'#0e92e4'}}>Order state tracker</div>

    <div className="d-flex justify-content-center my-5">
        {isLoading?
            <FontAwesomeIcon
              icon={faSearch}
              size="6x"
              spin
              style={{ color:"#0e92e4"}}
            />:
            error?
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              size="10x"
              shake
              style={{ color:"#ff0000"}}
            />:
            orderFound?
            orderState?
            <FontAwesomeIcon
              icon={faShippingFast}
              size="5x"
              bounce
              style={{ color:"#0e92e4"}}
            />:
            <FontAwesomeIcon
              icon={faGear}
              size="5x"
              spin
              style={{ color:"#0e92e4"}}
            />:
            <FontAwesomeIcon
              icon={faBan}
              size="10x"
              shake
              style={{ color:"#ff0000"}}
            />           
    
    }

    </div>

    <div className="d-flex align-items-center flex-column">
        {isLoading?
            <p>Searching the order ...</p>:
            error?
            <p>{orderID} is not a valid order ID</p>:
            orderFound?
            orderState?
            <>            
                <h4 className="my-3 fw-bold"> Welcome {client.first_name + ' ' + client.last_name} !</h4>
                <h4 className="my-3"> Your order is validated and it is on the way to you ! </h4>
            </>
:
            <>            
                <h4 className="my-3 fw-bold"> Welcome {client.first_name + ' ' + client.last_name} !</h4>
                <h4 className="my-3"> Your order is on the way to be validated ! </h4>
            </>:
            <>
            <p>There is no order associated with the order ID provided</p>
            <p>Order ID provided : {orderID}</p>
            </>
    
    }
    </div>    

</>)
}




export default OrderTracker;