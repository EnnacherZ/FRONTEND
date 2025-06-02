import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Header, { goTo } from "./header";
import "../Styles/checkout.css"
import { clientData, usePayment } from '../Contexts/paymentContext';
import { useForm } from 'react-hook-form';
import { AiFillAlert } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import {FaCreditCard, FaMoneyBillTransfer, FaPhone } from 'react-icons/fa6';
import { BsGeoAltFill } from 'react-icons/bs';
import { FaCity,FaRegUserCircle, FaUserCircle} from 'react-icons/fa';
import { MdAlternateEmail, MdRemoveShoppingCart} from 'react-icons/md';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useLangContext, selectedLang } from "../Contexts/languageContext"; 
import {toast, ToastContainer, Zoom } from "react-toastify";
import { useCart } from "../Contexts/cartContext";
import Loading from "./loading";
import Footer from "./footer";
import { connecter } from "../Server/connecter";
import { HiOutlineCash } from "react-icons/hi";

type FormValues = {
  FirstName : string;
  LastName : string;
  Email : string;
  Tel: string;
  City: string;
  Address : string;
  customerId : string;

}

const Checkout :  React.FC = () => {
    const date = new Date();
    const {t} = useTranslation();
    const {total, cartChecker, clearCart, allItems, setSuccessTransItems} = useCart();
    const {currentLang} = useLangContext();
    const {setClientForm, clientForm, setPaymentResponse, setCurrentCurrency, currentCurrency,} = usePayment();
    const [isPhone, setIsPhone]= useState<boolean>()
    const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
    const [tokenId, setTokenId] = useState<string|null>(null);
    const [isModify, setIsModify] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orderId, setOrderId] =useState<string>();
    const [isOnlinePayment, setIsOnlinePayment] = useState<boolean>();
    const paymentForm = useRef<HTMLDivElement>(null);
    const Clientform = useForm<FormValues>({
      defaultValues:clientForm
    })
    const {register,
        handleSubmit,
        formState : {errors, isSubmitting},
        getValues,
  } = Clientform;

  const currencyRender = (l: string) => {
    let a = '';
    switch (l) {
      case 'MAD':
        a = 'MA';
        break;
      case 'EUR':
        a = 'EU';
        break;
      case 'USD':
        a = 'US';
        break;
    }
    return a;
  }
    //Check if client data exists
    const isClt = (data:clientData | undefined) =>{
      if(data == undefined){return false}
        for(const p of Object.keys(data)){
         if(data[p as keyof clientData] ==""){return false}
        }return true
    }

          
      const validateCommand = async () =>{
         if(isClt(clientForm)){
          }
         const clientCoord : clientData = {
           FirstName : getValues('FirstName'),
           LastName : getValues('LastName'),
           Email : getValues('Email'),
           Tel : getValues('Tel'),
           City : getValues('City'),
           Address : getValues('Address'),
           Amount : total,
           Currency : 'MAD',
         }
         setClientForm(clientCoord)
         setIsModify(true)
         await new Promise ((resolve)=>setTimeout(resolve, 1000))
       }

       useLayoutEffect(()=>{
        const phone = () => {
          if(window.innerWidth<=800){setIsPhone(true)}
          else(setIsPhone(false))
        };
        phone();
        addEventListener('resize', phone);
        return () =>{
          window.removeEventListener('resize', phone)
        }
       }, [window.innerWidth])

      useEffect(() => {
        // Download YCPay script dynamically
        if(!isScriptLoaded){
        const script = document.createElement('script');
        script.src = 'https://youcanpay.com/js/ycpay.js';
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
      }
      }, []);

      const handleYCPay = async () => {
        setOnlinePayment();
        if(clientForm&&!tokenId){
          try {
            
            console.log('waiting')
            const tokenParams = {
                amount: clientForm?.Amount, // Montant requis
                currency: 'MAD', // Devise requise
                customer_ip: '10.25.28.35', // IP du client requise
                success_url: 'https://google.com/', // URL de succès requise
                error_url: 'https://youtube.com/', // URL d'erreur optionnelle
            };
            console.log(tokenParams)
            const customer= {
              first_name: clientForm.FirstName,
              last_name: clientForm.LastName, 
              address: clientForm?.Address, 
              zip_code: '', 
              city: clientForm?.City, 
              state: '', 
              country_code: 'MA', 
              phone: clientForm?.Tel, 
              email: clientForm?.Email, 
          }
            const respo = await connecter.post(`api/getPaymentToken`,
             {tokenParams : tokenParams,
              customer : customer})
            const tokenRespo = respo.data.token
            console.log(respo);
            setOrderId(respo.data.order_id);
            setTokenId(tokenRespo);
            
            }catch(err){console.log(err)}  
        }else{return}      
      };

      useEffect(() => {
        if (isScriptLoaded && tokenId) {
          // Initialise YCPay
          const ycPay = new YCPay('pub_sandbox_1bfc0387-7aea-49ab-b51e-930e5', {
            locale: selectedLang(currentLang),
            isSandbox: true,
            errorContainer: '#error-container',
            formContainer: '#payment-container',
            token: tokenId,
          });
    
          // Render payment form
          ycPay.renderCreditCardForm('default');
          setIsScriptLoaded(false)
          // Add pay button listner
          const payButton = document.getElementById('pay');
          if (payButton) {
            if(isOnlinePayment){
              payButton.addEventListener('click', () => {
                ycPay.pay(tokenId)
                  .then(successCallback)
                  .catch(errorCallback);
              });             
            }
            
          }
        }
      }, [tokenId]);

      const successCallback = async (response: any) => {
          setTokenId(null)
          const res = response.response;
          setPaymentResponse({
            code : res.code,
            amount : clientForm?.Amount,
            currency : clientForm?.Currency,
            transaction_id : res.transaction_id,
            message : res.message,
            success : res.success,
            order_id :res.order_id,
            date : date.toUTCString()
          });
          await handlePayment(response.response.transaction_id,date.toUTCString());
          // window.location.reload()
      };

      const errorCallback = (response: any) => {
          console.error('Payment error:', response);
      };


      const handlePayment = async (trans:string, date:string) => {
        try {
            setIsLoading(true)
            window.scrollTo(0,0)
            let formData = {}
            if(isOnlinePayment){
              formData = {
              shoes_order : allItems.Shoes,
              sandals_order : allItems.Sandals,
              shirts_order : allItems.Shirts,
              pants_order : allItems.Pants,
              orderId: orderId,
              transaction_id : trans,
              date : date,
              onlinePayment : isOnlinePayment
            }
            }else{
              formData = {
              shoes_order : allItems.Shoes,
              sandals_order : allItems.Sandals,
              shirts_order : allItems.Shirts,
              pants_order : allItems.Pants,
              date : date,
              onlinePayment : isOnlinePayment,
              transaction_id : trans,
              client : clientForm,
              }
            }
            const response = await connecter.post(`api/handlepay/`,formData);
            setSuccessTransItems(response.data.ordered_products||[]);
            clearCart();
            goTo("/Trans");
            setIsLoading(false);
            console.log(response.data.ordered_products||[]);
        } catch (error) {
            console.error('Error during payment:', error);
        }
    };
    

    const setCOD = () =>{
      if(paymentForm.current){
        paymentForm.current.style.display = 'none';
        setIsOnlinePayment(false);
        setTokenId(null);
      }
    }
    const setOnlinePayment = () =>{
      if(paymentForm.current){
        paymentForm.current.style.display = 'block';
        setIsOnlinePayment(true);
        window.scrollBy({top:300, behavior:'smooth'})
      }
    };

    const OnClickPayment = () => {
          if(isOnlinePayment==false){
            handlePayment("COD", date.toUTCString())
          }
          else if(isOnlinePayment==undefined){
              toast.error(t('choosePM'), {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                });
            }
    }


    if(!cartChecker){;return(<>
    <Header/>
    <div
          className='shadow'
          style={{
            width:"100%",
            height:385,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexDirection:"column"
          }}
        >
          <MdRemoveShoppingCart size={50} style={{ marginBottom: "16px",  }} />
          
          <div className={`${selectedLang(currentLang)=='ar'?'rtl':''}`}>{t('nullCart')} </div>
          <button className={`btn btn-primary mt-4 ${selectedLang(currentLang)=='ar'?'rtl':''}`}
                  onClick={()=>goTo("/")}>
            <b >{t('shopNow')} !</b></button>
    
      </div>
      <Footer/>

    </>)}
    return(<>
      <Header/>
        {!isLoading?<>
          <div className="mt-1">
      <div className="checkoutBar shadow rounded d-flex justify-content-between ">
        <button className="btn btn-primary btn-back my-2 mx-1 p-0"
                style={{width:90}}
                onClick={()=>goTo("/YourCart")}>
            <IoArrowBackOutline style={{marginRight:-3}} /> {t('toCart')}
        </button>

        <div className="d-flex align-items-center "> 
        <strong style={{fontSize:14, color:'green'}}>
               {(total*1).toFixed(2)} {currentCurrency}</strong>
        </div>

        <div style={{width:130, height:"100%"}} className="d-flex align-items-center me-0  justify-content-end">
            <ReactCountryFlag
                        className="checkFlag"
                        countryCode={currencyRender(currentCurrency)}
                        svg
                        style={{
                            width: '20%',
                            height: 35,
                            marginRight:3,
                        }}
                        title={currencyRender(currentCurrency)}
                    />
            <select className="form-select  align-middle d-inline border-none"
                    style={{width:95, color:'green', fontWeight:500, backgroundColor:"#efecec"}}
                    onChange={(e)=>setCurrentCurrency(e.target.value)}
                    defaultValue={currentCurrency}>
                <option value={'MAD'} style={{fontWeight:500}}>MAD</option>
                <option style={{fontWeight:500}} value={'USD'}>USD $</option>
                <option style={{fontWeight:500}} value={'EUR'}>EUR €</option>
            </select>
        </div> 

    </div>

    <div className={`repay-alert rounded p-2 ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
      <AiFillAlert size={"1.3em"}  className="mx-2 alerticon"/> {t('checkoutAlert')}
    </div>

    <div className="clientFormAndPayment disabled">
    {!isPhone?<form className='form-floating card shadow-lg ClientInfosDiv pt-0 mt-2' onSubmit={handleSubmit(validateCommand)}>
          <div className='text-center my-2 fs-3'><b><FaUserCircle style={{marginTop:-3}}/> {t('clientInfos')}</b></div>
          <hr></hr>
    <div className="form-first-line d-flex mb-2">
                <div className="input-group flex-column px-1">
    
                  <div className={`form-label ${selectedLang(currentLang)=='ar'&&'rtl'}`}>{t('firstN')}:</div>
                  <div className="input-group">
                    <span className="input-group-text" ><FaRegUserCircle /></span> 
                    <input  {...register("FirstName",{
                            required:t('fnreq')+' !'
                            })}
                          type="text" 
                          className={(selectedLang(currentLang)=='ar')?
                          errors.FirstName?"form-control is-invalid rounded-0 rounded-start":
                          "form-control rounded-0 rounded-start":"form-control"
                } 
                placeholder={t('firstN')}
                readOnly={isModify}
                disabled={isModify}/>
                  </div>
                  
                    {errors.FirstName && (
                      <span style={{color:"red",fontSize:"1.25vw"}}
                            className={`${selectedLang(currentLang)=='ar'&&'rtl'} `}>
                        {`${errors.FirstName.message}`}</span>
                    )}
                  
                </div>
                <div className="input-group flex-column px-1">
                  <div className={`form-label ${selectedLang(currentLang)=='ar'&&'rtl'}`}>{t('lastN')}:</div>
                  <div className="input-group">
                    <span className="input-group-text"><FaRegUserCircle/></span> 
                    <input  {...register("LastName",{
                            required:t('lnreq')+' !'
                          })} 
                          type="text" 
                          className={errors.LastName?"form-control is-invalid":"form-control"}
                          placeholder={t('lastN')}
                          readOnly={isModify}
                          disabled={isModify}
                          />
                  </div>
                  {errors.LastName && (
                      <span style={{color:"red",fontSize:"1.25vw"}}
                            className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
                        {`${errors.LastName.message}`}</span>
                    )}
                </div>
                
            </div>
            <div className="form-second-line d-flex mb-2">
                <div className="input-group flex-column px-1">
    
                  <div className={`form-label ${selectedLang(currentLang)=='ar'&&'rtl'}`}>{t('email')}:</div>
                  <div className="input-group">
                    <span className="input-group-text" ><FaRegUserCircle /></span> 
                    <input  {...register("Email",{
                            required:t('emlreq')+' !'
                          })}
                          type="email" 
                          className={errors.Email?"form-control is-invalid":"form-control"} 
                          placeholder={t('email')}
                          readOnly={isModify}
                          disabled={isModify}/>
                  </div>
                    {errors.Email && (
                      <span style={{color:"red",fontSize:"1.25vw"}}
                            className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
                        {`${errors.Email.message}`}</span>
                    )}
                </div>
                <div className="input-group flex-column px-1">
                  <div className={`form-label ${selectedLang(currentLang)=='ar'&&'rtl'}`}>{t('phN')}:</div>
                  <div className="input-group">
                    <span className="input-group-text"><FaRegUserCircle/></span> 
                    <input  {...register("Tel",{
                            required:t('telreq')+' !',
                            minLength : {
                              value:10,
                              message:"You should enter 06.. or 07... or +212... form "
                            }
                          })} 
                          type="tel" 
                          className={errors.Tel?"form-control is-invalid":"form-control"}
                          placeholder={t('phN')}
                          readOnly={isModify}
                          disabled={isModify}
                          />
                  </div>
                  {errors.Tel && (
                      <span style={{color:"red",fontSize:"1.25vw"}}
                            className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
                        {`${errors.Tel.message}`}</span>
                    )}
                </div>
            </div>
            <div className="form-third-line d-flex mb-2">
              <div className="input-group flex-column px-1">
    
                  <div className={`form-label ${selectedLang(currentLang)=='ar'&&'rtl'}`}>{t('city')}:</div>
                  <div className="input-group">
                      <span className="input-group-text" ><FaRegUserCircle /></span> 
                      <input  {...register("City",{
                                  required:t('cityreq')+' !'
                              })}
                              type="text" 
                              className={errors.City?"form-control is-invalid":"form-control"} 
                              placeholder={t('city')}
                              readOnly={isModify}
                              disabled={isModify}/>
                  </div>
                    {errors.City && (
                      <span style={{color:"red",fontSize:"1.25vw"}}
                            className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
                        {`${errors.City.message}`}</span>
                    )}
              </div>
              <div className="input-group flex-column px-1">
                  <div className={`form-label ${selectedLang(currentLang)=='ar'&&'rtl'}`}>{t('address')}:</div>
                  <div className="input-group">
                    <span className="input-group-text"><FaRegUserCircle/></span> 
                    <input  {...register("Address",{
                            required:t('addressreq')+' !'
                          })} 
                          type="text" 
                          className={errors.Address?"form-control is-invalid":"form-control"}
                          placeholder={t('address')}
                          readOnly={isModify}
                          disabled={isModify}
                          />
                  </div>
                      {errors.Address && (
                          <span style={{color:"red",fontSize:"1.25vw"}}
                                className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
                            {`${errors.Address.message}`}</span>
                        )}
              </div>
            </div>

        <button type='submit' 
                disabled={isSubmitting}
                className={`btn btn-success  rounded ${isModify?"d-none":''}`}
                onClick={()=>{}}>
              {(isClt(clientForm) && isModify==false)?t('saveMod'):t('save')}
        </button>
        <button type='button' 
                className={`btn btn-danger rounded ${(isModify)?'':'d-none'}`}
                onClick={()=>{setIsModify(false)}}
                disabled={!isModify}>
            {t('modify')}
        </button>


        

    </form>:
      <form className={`form-floating card rounded shadow-lg p-2 pt-0 mt-2  
        ClientInfosDivSM `} 
      onSubmit={handleSubmit(validateCommand)}>
      <div className='text-center my-2 fs-3'><b><FaUserCircle style={{marginTop:-3}} className="mx-2"/>{t('clientInfos')}</b></div>
      <hr></hr>
      <span className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}><label className={`form-label`}>{t('firstN')} :</label></span>
      <div className={`input-group mb-2 ${selectedLang(currentLang)=="ar"&& 'rtl'} `}>
        <span className="input-group-text rounded-0" ><FaRegUserCircle /></span>
        <input  {...register("FirstName",{
                  required:t('fnreq')+' !'
                })}
                type="text" 
                className={(selectedLang(currentLang)=='ar')?
                          errors.FirstName?"form-control is-invalid rounded-0 rounded-start":
                          "form-control rounded-0 rounded-start":"form-control"
                } 
                placeholder={t('firstN')}
                readOnly={isModify}
                disabled={isModify}/>
    </div>
    {errors.FirstName && (
        <span style={{color:"red", fontSize:16}} className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}
        >{`${errors.FirstName.message}`}</span>
    )}
    <span className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}><label className="form-label ">{t('lastN')} :</label></span>
    <div className={`input-group mb-2 ${selectedLang(currentLang)=="ar"&& 'rtl'} `}>
        <span className="input-group-text rounded-0" ><FaRegUserCircle /></span> 
        <input  {...register("LastName",{
                  required:t('lnreq')+' !'
        })} 
                type="text" 
                className={(selectedLang(currentLang)=='ar')?
                  errors.LastName?"form-control is-invalid rounded-0 rounded-start":
                  "form-control rounded-0 rounded-start":"form-control"
        }
                placeholder={t('lastN')}
                readOnly={isModify}
                disabled={isModify}/>

    </div>
    {errors.LastName && (
      <span style={{color:"red", fontSize:16}} className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
        {`${errors.LastName.message}`}</span>
    )}

    <span className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}><label className="form-label">{t('email')} :</label></span>
    <div className={`input-group mb-2 ${selectedLang(currentLang)=="ar"&& 'rtl'} `}>
        <span className="input-group-text rounded-0" id="basic-addon2"><MdAlternateEmail /></span>
        <input  {...register("Email",{
                  required:t('emlreq')+' !'
        })} 
                type="email" 
                className={(selectedLang(currentLang)=='ar')?
                  errors.Email?"form-control is-invalid rounded-0 rounded-start":
                  "form-control rounded-0 rounded-start":"form-control"
        }
                placeholder={t('email')}
                readOnly={isModify}
                disabled={isModify}/>
      </div>          
      {errors.Email && (
            <span style={{color:"red",fontSize:16}} className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
              {`${errors.Email.message}`}</span>
          )}
    <span className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}><label className="form-label">{t('phN')} :</label></span>
      <div className={`input-group mb-2 ${selectedLang(currentLang)=="ar"&& 'rtl'} `}>
      <span className="input-group-text rounded-0" id="basic-addon3"><FaPhone /></span>
      <input  {...register("Tel",{
                  required:t('telreq')+' !',
                  minLength : {
                    value:10,
                    message:"You should enter 06.. or 07... or +212... form "
                  }
                  
        })} 
              type="tel" 
              className={(selectedLang(currentLang)=='ar')?
                errors.Tel?"form-control is-invalid rounded-0 rounded-start text-end":
                "form-control rounded-0 rounded-start text-end":"form-control"
      } 
              placeholder={t('phN')}
              readOnly={isModify}
              disabled={isModify}/>


    </div>
    {errors.Tel && (
        <span style={{color:"red", fontSize:16}} className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
          {`${errors.Tel.message}`}</span>
    )}

    <span className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}><label className="form-label">{t('city')} :</label></span>
    <div className={`input-group mb-2 ${selectedLang(currentLang)=="ar"&& 'rtl'} `}>
      <span className="input-group-text rounded-0"><FaCity /></span>
      <input  {...register("City",{
                  required:t('cityreq')+' !'
        })} 
              type="text" 
              className={(selectedLang(currentLang)=='ar')?
                errors.City?"form-control is-invalid rounded-0 rounded-start":
                "form-control rounded-0 rounded-start ":"form-control"}
              placeholder={t('city')}
              readOnly={isModify}
              disabled={isModify}/>
      </div>
      {errors.City && (
      <span style={{color:"red",fontSize:16}} className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
        {`${errors.City.message}`}</span>
    )}

      <span className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}><label className="form-label">{t('address')} :</label></span>
      <div className={`input-group mb-2 ${selectedLang(currentLang)=="ar"&& 'rtl'} `}>
              <span className="input-group-text rounded-0"><BsGeoAltFill /></span>
      <input  {...register("Address",{
                  required:t('addressreq')+' !'
        })} 
              type="text" 
              className={(selectedLang(currentLang)=='ar')?
                errors.Address?"form-control is-invalid rounded-0 rounded-start":
                "form-control rounded-0 rounded-start":"form-control"
      }
              placeholder={t('address')}
              readOnly={isModify}
              disabled={isModify}/>
    </div>
    {errors.Address && (
      <span style={{color:"red", fontSize:16}} className={`${selectedLang(currentLang)=='ar'&&'rtl'}`}>
        {`${errors.Address.message}`}</span>
    )}

      <button type='submit' 
              disabled={isSubmitting}
              className={`btn btn-success my-2 rounded ${isModify?"d-none":''}`}
              onClick={()=>{}}>
            {(isClt(clientForm) && isModify==false)?t('saveMod'):t('save')}
      </button>
      <button type='button' 
              className={`btn btn-danger my-2 rounded ${(isModify)?'':'d-none'}`}
              onClick={()=>{setIsModify(false)}}
              disabled={!isModify}>
          {t('modify')}
      </button>
    </form>}

    <div className="d-flex flex-column paymentDiv mb-5">
    <div className={`paymentGateway ${isClt(clientForm)&&isModify?'':'is-disabled'} card shadow p-2 mt-2 `}
          id="paymentGateway">
      <div className="paymentGatewayTitle fs-3" id="paymentGatewayTitle">
        <FaMoneyBillTransfer className="mx-3"/> {t('paymentPortal')}
      </div>
      <hr></hr>
      <button className={`cod ${isOnlinePayment==false&&"choosed"} rounded my-3 ${selectedLang(currentLang)=='ar'&&'rtl'}`} onClick={setCOD}>
        <HiOutlineCash className="mx-2"/> {t('cod')}
      </button>
      <button className={`creditCard ${isOnlinePayment==true&&"choosed"} rounded my-3 ${selectedLang(currentLang)=='ar'&&'rtl'}`} onClick={handleYCPay} >
        <FaCreditCard className="mx-3"/> {t('creditCard')}
      </button>
      <div className={`mb-2 `} id="payment-container" ref={paymentForm}>
      </div>
      <div className="gateway-brand d-flex justify-content-end  p-2" >
          <span className="text-muted"><i>by</i></span>
          <div className="gateway-brand-img">
              <img src="https://youcanpay.com/images/ycpay-logo.svg" alt="" />
          </div>
      </div>
      <div className={`paymentMethoidChoice fw-bold fs-6 ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
        {t("choicePM")} : {isOnlinePayment==undefined? t("noChoicePM"):(isOnlinePayment?t('creditCard'):t('cod'))}
      </div>
    </div>
    <button id="pay" className={`rounded mt-2 pay-button ${isClt(clientForm)&&isModify?'':'is-disabled'}`} onClick={OnClickPayment}
    >{t('pay')}</button>
    </div>

    

    </div>
    </div>
    <ToastContainer />
        </>:<><Loading message="Your command is being treated"/>
        <Footer/>
        </>}
    </>)



};
export default Checkout;

