import React, {useState, useEffect, createContext, useContext, ReactNode, Dispatch} from "react";
import { useCart } from "./cartContext"; 
// import axios from "axios";
import {  PDFDocument, rgb, StandardFonts, PDFHexString, PDFName} from 'pdf-lib';
import invoiceEn from "./exempEn.pdf";
import { ProductDetail } from "./ProductsContext";
import QRCode from 'qrcode';


const origin = import.meta.env.VITE_ACTUAL_ORIGIN;

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

    useEffect(()=>{

const createInvoice = async () => {
  const invoiceFile = await fetch(invoiceEn).then(res => res.arrayBuffer());
  const invoicePdf = await PDFDocument.load(invoiceFile);
  const filePages = invoicePdf.getPages();
  const firstPage = filePages[0];

  // Générer le QR code
  const qrDataUrl = await QRCode.toDataURL(`${origin}${'MyOrder/'}${paymentResponse?.order_id}`, {
    color: { dark: '#545454' },
  });

  // Convertir en image utilisable par pdf-lib
  const qrImageBytes = await fetch(qrDataUrl).then(res => res.arrayBuffer());
  const qrImage = await invoicePdf.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(0.75);

  // Ajouter l’image QR sur le PDF
  firstPage.drawImage(qrImage, {
    x: 100,
    y: 100,
    width: qrDims.width,
    height: qrDims.height,
  });

  // Texte du lien
  const linkText = 'Click here! | Cliquer ici !';
  const fontSize = 11;
  const x = 380;
  const y = 120;

  const font = await invoicePdf.embedFont(StandardFonts.Helvetica);

  // Dessiner le texte
  firstPage.drawText(linkText, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 1),
  });

  // Créer l’annotation de lien
  const textWidth = font.widthOfTextAtSize(linkText, fontSize);
  const textHeight = font.heightAtSize(fontSize);
  const linkUrl = `${origin}${'MyOrder/'}${paymentResponse?.order_id}`;
  
const linkAnnotation = invoicePdf.context.obj({
  Type: PDFName.of('Annot'),
  Subtype: PDFName.of('Link'),
  Rect: [x, y, x + textWidth, y + textHeight],
  Border: [0, 0, 0],
  A: invoicePdf.context.obj({
    S: PDFName.of('URI'),
    URI: PDFHexString.fromText(linkUrl),
  }),
});

  const linkRef = invoicePdf.context.register(linkAnnotation);

  // Ajouter l’annotation à la page
  const annots = firstPage.node.get(PDFName.of('Annots'));
  if (annots) {
    (annots as any).push(linkRef);
  } else {
    firstPage.node.set(PDFName.of('Annots'), invoicePdf.context.obj([linkRef]));
  }

            firstPage.drawText(clientForm?.FirstName || '', {
                x: 115,
                y: 663,
                size: 11,
                color: rgb(0, 0, 0), // Noir
              });
              firstPage.drawText(clientForm?.LastName || '', {
                  x: 368,
                  y: 663,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.Address || '', {
                  x: 115,
                  y: 618,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.City || '', {
                  x: 115,
                  y: 578,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText('' , { //Zip code
                  x: 368,
                  y: 578,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.Phone || '', {
                  x: 115,
                  y: 535,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(clientForm?.Email || '', {
                  x: 346,
                  y: 535,
                  size: 9,
                  color: rgb(0, 0, 0), // Noir
                });

                // Transaction infos

                firstPage.drawText(paymentResponse?.code || '', {
                    x: 115,
                    y: 445,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                  });
                firstPage.drawText(String(paymentResponse?.amount|| NaN), {
                    x: 368,
                    y: 445,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(paymentResponse?.currency || '', {
                    x: 115,
                    y: 405,
                    size: 11,
                    color: rgb(0, 0, 0), // Noir
                });
                firstPage.drawText(paymentResponse?.date ||'',{
                  x: 368,
                  y: 405,
                  size: 11,
                  color: rgb(0, 0, 0), // Noir                  
                })
                firstPage.drawText(paymentResponse?.order_id || '', {
                    x: 115,
                    y: 358,
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
                const pdfUrl = URL.createObjectURL(new Blob([invoiceDoc.buffer as ArrayBuffer], {type : 'application/pdf'}));
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