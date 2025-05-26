import React, {useState, useEffect, createContext, useContext, ReactNode, Dispatch} from "react";
import { useCart } from "./cartContext"; 
// import axios from "axios";
import { PDFDocument, rgb } from 'pdf-lib';
import invoiceEn from "./exempEn.pdf";
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
    Tel: string;
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
    date : string | undefined
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
    invoiceUrl : string | undefined;
}

const paymentContext = createContext<paymentContextProps|undefined>(undefined)

export const PaymentProvider : React.FC<{children:ReactNode}> =({children}) => {
    const {shoesItems, sandalsItems, } = useCart();
    const [shoesOrder, setShoesOrder] = useState<ProductDetail[]>([]);
    const [sandalsOrder, setSandalsOrder] = useState<ProductDetail[]>([])
    const [currentCurrency, setCurrentCurrency] = useState<string>('MAD');
    // const [currencyRate, setCurrencyRate] = useState<number>(1);
    // const [ratesList, setRatesList] = useState<{[key: string]: number}>({'MAD':1})
    const [invoiceUrl, setInvoiceUrl] = useState<string|undefined>()
    const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | undefined>(()=>{
      try{
        const response  = localStorage.getItem('AlFirdaousStorePaymentResponse')
        if(response){return JSON.parse(response)}else{return {}}
      }catch(err){
        return {}
      }
    });

    useEffect(()=>{
      try{localStorage.setItem('AlFirdaousStorePaymentResponse', JSON.stringify(paymentResponse))}catch(err){}
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

    useEffect(()=>{
        const createInvoice = async () =>{
            const invoiceFile = await fetch(invoiceEn).then(res => res.arrayBuffer());
            const invoicePdf = await PDFDocument.load(invoiceFile);
            const filePages = invoicePdf.getPages();
            const firstPage = filePages[0];
            // Client infos
            firstPage.drawText(clientForm?.FirstName || '', {
                x: 115,
                y: 659,
                size: 11,
                color: rgb(0, 0, 0), // Noir
              });
              firstPage.drawText(clientForm?.LastName || '', {
                  x: 368,
                  y: 659,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.Address || '', {
                  x: 115,
                  y: 613,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.City || '', {
                  x: 115,
                  y: 575,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText('' , { //Zip code
                  x: 368,
                  y: 575,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.Tel || '', {
                  x: 115,
                  y: 533,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.Email || '', {
                  x: 346,
                  y: 533,
                  size: 9,
                  color: rgb(0, 0, 0), // Noir
                });

                // Transaction infos

                firstPage.drawText(paymentResponse?.code || '', {
                    x: 115,
                    y: 442,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                  });
                firstPage.drawText(String(paymentResponse?.amount|| NaN), {
                    x: 368,
                    y: 442,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(paymentResponse?.currency || '', {
                    x: 115,
                    y: 402,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(paymentResponse?.date ||'',{
                  x: 368,
                  y: 402,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir                  
                })
                firstPage.drawText(paymentResponse?.order_id || '', {
                    x: 115,
                    y: 355,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(paymentResponse?.transaction_id || '', {
                    x: 115,
                    y: 312,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                });

                const invoiceDoc = await invoicePdf.save();
                const pdfUrl = URL.createObjectURL(new Blob([invoiceDoc], {type : 'application/pdf'}));
                setInvoiceUrl(pdfUrl);
        }   
        createInvoice()
    }, [clientForm, paymentResponse])




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
                                        invoiceUrl}}>
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