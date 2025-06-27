import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { connecter } from "../Server/connecter";
import Header from "./header";
// import icon from "../assets/FIRDAOUS STORE.png";
import "../Styles/orderTracking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faFlagCheckered, faGear, faSearch, faShippingFast, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";


const RESET_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

const OrderTracker :React.FC = () => {
    const {t} = useTranslation();
    const {orderID} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>()
    const [orderFound, setOrderFound] = useState<boolean>();
    const [orderState, setOrderState] = useState<boolean>();
    const [client, setClient] = useState<any>();
    const [attempt, setAttempts] = useState<number>(() => {
      const att = localStorage.getItem('AlFirdaousStoreOrderTrackingLimitAttempts');
      const lastReset = localStorage.getItem('AlFirdaousStoreOrderTrackingAttemptsLastReset5');

      const now = Date.now();

      if (lastReset) {
        const lastResetTime = parseInt(lastReset, 10);

        // Si le délai est dépassé, on réinitialise
        if (now - lastResetTime > RESET_DURATION) {
          localStorage.setItem('AlFirdaousStoreOrderTrackingLimitAttempts', JSON.stringify(0));
          localStorage.setItem('AlFirdaousStoreOrderTrackingLimitAttemptsLastReset', now.toString());
          return 0;
        }
      } else {
        // Si c'est la première fois, on initialise la date de reset
        localStorage.setItem('AlFirdaousStoreOrderTrackingLimitAttemptsLastReset', now.toString());
      }

      return att ? JSON.parse(att) : 0;
    });

    useEffect(() => {
      localStorage.setItem('AlFirdaousStoreOrderTrackingLimitAttempts', JSON.stringify(attempt));

      // Si c’est la première tentative (reset), on met aussi à jour la date
      if (attempt === 0) {
        localStorage.setItem('AlFirdaousStoreOrderTrackingLimitAttemptsLastReset', Date.now().toString());
      }
    }, [attempt]);

    const hasFetched = useRef(false);
    useEffect(()=>{
        const checkOrder = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
         if(attempt<=2){
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
            }else{
              setIsLoading(false);
            }
            
          setAttempts((prev)=>prev+1);
        }
        checkOrder()
    }, [orderID])



return(<>
    <Header/>
    {/* <Link to='/Home'>
      <div className="d-flex justify-content-center">
        <div className="order-tracking-icon mb-5 mt-4" >
          <img src={icon} alt="" />
        </div>
      </div>
    </Link> */}

    <div className="d-flex justify-content-center fs-2 fw-bold mt-2" style={{color:'#0e92e4'}}>{t('orderStateTracker')}</div>

    <div className="d-flex justify-content-center my-5">
        {attempt>3?
            <FontAwesomeIcon
              icon={faFlagCheckered}
              size="6x"
              beatFade
              style={{ color:"red"}}
            />:       
        isLoading?
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

    <div className="d-flex align-items-center flex-column fw-bold">
        {attempt>3?
        <p>{t('orderTrackingLimit')}</p>
        :
        isLoading?
            <p>{t('searchingOrder')} ...</p>:
            error?
            <p>{orderID} {t('noValidOrderId')}</p>:
            orderFound?
            orderState?
            <>            
                <h4 className="my-3 fw-bold"> {t('welcome')} {client.first_name + ' ' + client.last_name} !</h4>
                <h4 className="my-3"> {t('orderValidated')} ! </h4>
            </>
:
            <>            
                <h4 className="my-3 fw-bold"> {t('welcome')} {client.first_name + ' ' + client.last_name} !</h4>
                <h4 className="my-3"> {t('orderNotValidatedYet')} ! </h4>
            </>:
            <>
            <p>{t('noOrderAssiciatedOrderId')}</p>
            <p>{`${t('orderIdProvided')}` } </p>
            <p>{orderID}</p>
            </>
    
    }
    <div className=""> {t('searchingAttempts')} : {`${attempt}/3`}</div>
    </div>    

</>)
}




export default OrderTracker;