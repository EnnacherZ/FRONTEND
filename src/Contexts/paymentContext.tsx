import React, {useState, useEffect, createContext, useContext, ReactNode, Dispatch} from "react";
import { useCart } from "./cartContext"; 
// import axios from "axios";
import { ProductDetail } from "./ProductsContext";


export interface Order {
  orderId : string;
  transactionId : string;
  date : string;
  amount : number;
  status : boolean;
  client : number;
}

export interface clientData{
    FirstName : string;
    LastName : string;
    Email : string;
    Phone: string;
    City: string;
    Address : string;
    Amount : number;
    Currency : string;

}
export interface PaymentResponse {
    code: string;                        
    message: string;             
    order_id: string;             
    success: boolean;            
    transaction_id: string;  
    amount : number | undefined;
    currency : string | undefined;
    date : string | undefined;
    isOnlinePayment : boolean | undefined;
}
export interface paymentContextProps { 
    clientForm : clientData | undefined;
    setClientForm : (data:clientData) => void;
    paymentResponse : PaymentResponse | undefined;
    setPaymentResponse : Dispatch<React.SetStateAction<PaymentResponse | undefined>>;
    shoesOrder : ProductDetail[];
    sandalsOrder : ProductDetail[];
    currentCurrency : string;
    setCurrentCurrency : Dispatch<React.SetStateAction<string>>;
    // currencyRate : number;
    currencyIsAvailable: boolean
}

const paymentContext = createContext<paymentContextProps|undefined>(undefined)

export const PaymentProvider : React.FC<{children:ReactNode}> =({children}) => {
    const currencyIsAvailable : boolean = import.meta.env.VITE_CURRENCY_AVAILABLITY === "true";
    const {shoesItems, sandalsItems, } = useCart();
    const [shoesOrder, setShoesOrder] = useState<ProductDetail[]>([]);
    const [sandalsOrder, setSandalsOrder] = useState<ProductDetail[]>([])
    const [currentCurrency, setCurrentCurrency] = useState<string>('MAD');
    // const [currencyRate, setCurrencyRate] = useState<number>(1);
    // const [ratesList, setRatesList] = useState<{[key: string]: number}>({'MAD':1})
    const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | undefined>(()=>{
      try{
        const response  = sessionStorage.getItem('AlFirdaousStorePaymentResponse')
        if(response){return JSON.parse(response)}else{return {}}
      }catch(err){
        return {}
      }
    });
    

    useEffect(()=>{
      try{sessionStorage.setItem('AlFirdaousStorePaymentResponse', JSON.stringify(paymentResponse))}catch(err){}
    },[paymentResponse]);

    const [clientForm, setClientForm] = useState<clientData | undefined>(() => {
        try {
            const savedClientData = sessionStorage.getItem("ClientData");
            if (savedClientData === null || savedClientData==undefined) { // Vérifie si c'est null
                return undefined;
            }
            return JSON.parse(savedClientData);
        } catch{
            return undefined; 
        }
    });

    useEffect(()=>{
        try{
            sessionStorage.setItem('ClientData', JSON.stringify(clientForm))
        }catch(error){
            console.error('Error saving clientData to sessionStorage:', error);
        }
    },[clientForm])

    useEffect(()=>{
        const order :ProductDetail[] = [];
        for(const p of shoesItems){
            order.push({productId : p.id,
                        size : p.size,
                        quantity : p.quantity
            })
        }
        setShoesOrder(order)
    },[shoesItems])
    useEffect(()=>{
        const order :ProductDetail[] = [];
        for(const p of sandalsItems){
            order.push({productId : p.id,
                        size : p.size,
                        quantity : p.quantity
            })
        }
        setSandalsOrder(order)
    },[sandalsItems])

    useEffect(()=> {
        const CurrencyConverter = async () => {
          // const apiKey = import.meta.env.VITE_CURRENCY_API;
            try {
              // const response = await axios.get(
              //   `https://v6.exchangerate-api.com/v6/${apiKey}/latest/MAD`
              // );
              // const conversionRate = response.data.conversion_rates;
              // setRatesList();
            } catch (error) {
              // console.error('Erreur lors de la récupération des taux:', error);
            }
        };
        CurrencyConverter();
      }, [])
    useEffect(()=>{
        // setCurrencyRate(ratesList[currentCurrency])
    },[currentCurrency])

   


    return(
        <paymentContext.Provider value={{clientForm,
                                        setClientForm,
                                        paymentResponse,
                                        setPaymentResponse,
                                        // currencyRate,
                                        currentCurrency,
                                        setCurrentCurrency,
                                        shoesOrder,
                                        sandalsOrder,
                                        currencyIsAvailable
                                        }}>
            {children}
        </paymentContext.Provider>
    )
} 
export const usePayment = (): paymentContextProps => {
    const context = useContext(paymentContext);
    if (context === undefined) {
      throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
  };