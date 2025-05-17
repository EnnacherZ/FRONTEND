import React, {useEffect, useState } from "react";
import { usePayment } from "../Contexts/paymentContext";
import icon from "../assets/FIRDAOUS STORE.png";
import "../Styles/successTrans.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { GrTransaction } from "react-icons/gr";
import { GiTicket } from "react-icons/gi";
import Footer from "./footer";
import { AllItems, useCart } from "../Contexts/cartContext";
import { BsBagCheckFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";
import { selectedLang } from "../Contexts/languageContext";
import Header from "./header";

const SuccessTrans: React.FC = () => {
  const {currentLang} = useLangContext();
  const {successTransItems} = useCart();
  const {paymentResponse, invoiceUrl, clientForm } = usePayment();
  const {t} = useTranslation();
  const [fileName, setFileName] = useState<string>(clientForm?.FirstName+"_"+clientForm?.LastName)
  const [isExpanded, setIsExpanded] = useState<{Shoes:boolean,Sandals:boolean,Shirts:boolean, Pants:boolean}>(
    {Shoes:false, Sandals:false, Shirts:false, Pants:false}
  ); // État pour gérer l'extension

  useEffect(()=>{
    if(clientForm){
      setFileName(clientForm?.FirstName+"_"+clientForm?.LastName)
    }
  }, [clientForm])

  const toggleExpand = (product:string) => {
    setIsExpanded((prev)=>({...prev, [product]:!prev[product as keyof {Shoes:boolean,Sandals:boolean,Shirts:boolean, Pants:boolean}]}));
  };

  const NotEmptyItemsKeys = () =>{
    const list =Object.keys(successTransItems);
    let keys = []
    for(const p of list){
      if(successTransItems[p as keyof AllItems].length>0){keys.push(p)}
    }return keys;
  } 
    return (
    <>
    <Header/>
    <Link to='/Home'>
      <div className="transHeader d-flex justify-content-center">
        <div className="transIconDiv mt-3" >
          <img src={icon} alt="" />
        </div>
      </div>
    </Link>
      

      <div className="transSuccMsg mt-3">
        {t('successMsg')}
      </div>
      <div className="transSuccMsg mt-1">
        {t('thank')}
      </div>

      <div className="d-flex justify-content-center my-4">
        <FontAwesomeIcon
          icon={faCircleCheck}
          size="2xl"
          className="succIcon"
          beat
          style={{ color:"#38d400"}}
        />
      </div>

      <div className="trans-ticket d-flex justify-content-center">
        <a href={invoiceUrl || ''} download={fileName}>
        <button className="ticket-generator btn btn-warning fw-bold" >
          <GiTicket size={25} /> {t('downloadTicket')}
        </button>
        </a>
      </div>

      <div className="d-flex trans-resume-body">
        {/* Transaction Info */}
        <div className={`transDetailsTable card shadow mt-3 ${selectedLang(currentLang)=='ar'&& 'rtl'}`}>
          <div className="fw-bold text-center fs-3 my-1">
            <GrTransaction size={25} className="mx-1" /> {t('transactionInfos')}
          </div>
          <hr className="my-2" />
          <ul className="px-1">
            <li className="d-flex justify-content-between align-items-center px-1 my-2 " key={1}>
              <span className="fw-bold text-muted">{t('code')} :</span>
              <span className="fw-bold" style={{ color: "#0e92e4" }}>
                {paymentResponse?.code}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center px-1  my-2" key={3}>
              <span className="fw-bold text-muted">{t('currency')} :</span>
              <span className="fw-bold" style={{ color: "#0e92e4" }}>
                {paymentResponse?.currency}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center px-1  my-2" key={5}>
              <span className="fw-bold text-muted">{t('amount')} :</span>
              <span className="fw-bold" style={{ color: "#0e92e4" }}>
                {paymentResponse?.amount}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center px-1  my-2" key={7}>
              <span className="fw-bold text-muted">{t('orderId')} :</span>
              <span className="fw-bold" style={{ color: "#0e92e4" }}>
                {paymentResponse?.order_id}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center px-1  my-2" key={9}>
              <span className="fw-bold text-muted">{t('transactionId')} :</span>
              <span className="fw-bold" style={{ color: "#0e92e4" }}>
                {paymentResponse?.transaction_id}
              </span>
            </li>
          </ul>
          <div className="trans-ticket d-flex justify-content-center mb-1">
            <button className="ticket-generator btn btn-warning fw-bold">
                <GiTicket size={25} /> {t('downloadTicket')}
            </button>
      </div>
        </div>

        <div className={`trans-command-resume mt-3 card shadow ${selectedLang(currentLang)=='ar'&& 'rtl'}`}>
          <div className="fw-bold text-center fs-3 p-1" style={{ backgroundColor: "white", height: 56 }} key={"tla3tifrass"}>
            <BsBagCheckFill size={25} className="mx-2" /> {t('yourOrder')}
          </div>
          <hr className="m-0" key={"tla3tifrass2"}/>
          {NotEmptyItemsKeys().map((keyy)=>{
            if(successTransItems[keyy as keyof AllItems].length>0){
              let product = keyy as keyof AllItems;
              return(
                <div key={keyy}>
                <div  className={`trans-items-productType fw-bold text-start px-2 fs-3 mt-1 
                  ${(successTransItems?.[keyy as keyof AllItems].length==0)&&'d-none'}
                  ${selectedLang(currentLang)=='ar'&& 'text-end'}`} 
                  >
                      {t(keyy)}:
                </div>
            
            {successTransItems?.[keyy as keyof AllItems].slice(0, isExpanded[product] ? successTransItems?.[keyy as keyof AllItems].length : 2).map((it) => (
            <div className="trans-item-info d-flex flex-row justify-content-between my-2 mx-1"  key={it.id+it.size}>
              <div className="trans-item-img m-1 card p-1 rounded">
                <img src={`${it.image}`} className="rounded" alt="" />
              </div>
              <div className="trans-item-name flex-column d-flex align-items-center justify-content-around">
                <div className="fw-bold">{it.category} {it.ref}</div>
                <div className="fw-bold">{it.name}</div>
                <div className="text-muted">{t('size')}: {it.size}</div>
              </div>
              <div className="trans-item-pr d-flex flex-column justify-content-around align-items-center mx-1">
                <div className="fw-bold" style={{ color: "green" }}>
                  {(it.price * (1 - it.promo * 0.01)*it.quantity).toFixed(2)} {t('mad')}
                </div>
                <div className="text-muted">{t('quantity')}: {it.quantity}</div>
              </div>
            </div>
          ))}
          {successTransItems?.[keyy as keyof AllItems]?.length && successTransItems[keyy as keyof AllItems].length > 2 && (
            <div className="text-center my-3">
              <button className="btn btn-outline-primary border border-2 border-primary fw-bold" onClick={() => toggleExpand(keyy)}>
                {isExpanded[product] ? t('readLess') : t('readMore')}
              </button>
            </div>
          )}
            </div>
              )
            }
          })
          }
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SuccessTrans;
