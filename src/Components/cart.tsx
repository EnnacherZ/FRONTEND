import React, {useLayoutEffect, useState } from 'react';
import { CartItem, useCart } from '../Contexts/cartContext.tsx';
import {Zoom, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Header from './header.tsx';
import '../Styles/cart.css';
import Modals from './modals.tsx';
import { AnimatePresence } from 'framer-motion';
import { FaMoneyCheckAlt, FaRegTrashAlt, FaShoppingCart } from "react-icons/fa";
import { MdRemoveShoppingCart } from 'react-icons/md';
import { TbCreditCardPay } from 'react-icons/tb';
import ReactCountryFlag from 'react-country-flag';
import Footer from './footer.tsx';
import { useTranslation } from 'react-i18next';
import { useLangContext } from "../Contexts/languageContext.tsx";
import { usePayment } from '../Contexts/paymentContext.tsx';
import { goTo, selectedLang } from './functions.tsx';


const toCheckout = () => {window.location.href="/Checkout"}

const undefinedItem : CartItem ={
  product:"",
  id:0,
  name:"",
  ref:"",
  category:"",
  price:0,
  promo:0,
  image:"",
  quantity:0,
  size:"0"
}


const Cart: React.FC = () => {
  const {t} = useTranslation();
  const {setCurrentCurrency, currentCurrency, currencyIsAvailable} = usePayment()
  const {total, cartChecker, sandalsItems, shirtsItems, pantsItems} = useCart();
  const {currentLang} = useLangContext();
  const [isPhoneScreen, setIsPhoneScreen] = useState<boolean>(false);
  const { shoesItems, removeItem, clearCart, handleMinusQuantity, handlePlusQuantity } = useCart();
  const [isRemoveConfirm, setIsRemoveConfirm] = useState<boolean>(false);
  const [deletedItem, setDeletedItem] = useState<CartItem>(undefinedItem);
  const [deleteCible, setDeleteCible] = useState<string>("");

  useLayoutEffect(()=>{
    const phoneScreen = ()=>{
      if(window.innerWidth<540){
          setIsPhoneScreen(true)
      }else{setIsPhoneScreen(false)}
    }
    phoneScreen();
    addEventListener('resize', phoneScreen);
    return()=>{
      window.removeEventListener('resize', phoneScreen)
    }
  },[window.innerWidth])

  const handleRemoveClick = (item: CartItem) => {
    setDeletedItem(item);
    setDeleteCible("remove");
    setIsRemoveConfirm(true);
  }

  const handleClearAllClick = () => {
    setDeleteCible("clearAll");
    setIsRemoveConfirm(true);
  }

  const ConfirmRemove = (item: CartItem) => {
    removeItem(item);
    setIsRemoveConfirm(false);
    toast.error(t('itemRemoved'), {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  }

  const CancelRemove = () => {
    setDeletedItem(undefinedItem);
    setDeleteCible("");
    setIsRemoveConfirm(false);
  }

  const handleClearCart = () => {
    clearCart();
    setIsRemoveConfirm(false);
    toast.error(t('cartCleared'), {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };

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

  return(
    <>
    <Header/>
      <div className="cartBody">


<div className="cartSummary d-flex" >
<div className="checkoutBar1 shadow d-flex justify-content-between rounded border border-secondary">
  <div style={{width:130, height:"100%", marginLeft:2}} className="d-flex align-items-center  justify-content-start">
  <select className="form-select shadow-none align-middle d-inline border-none"
              style={{width:95, color:'green', backgroundColor:"#efecec", fontWeight:500}}
              onChange={(e)=>setCurrentCurrency(e.target.value)}
              defaultValue={currentCurrency}>
          <option value={'MAD'} style={{fontWeight:500}}>MAD</option>
                {currencyIsAvailable&& <>
                 <option style={{fontWeight:500}} value={'USD'}>USD $</option>
                <option style={{fontWeight:500}} value={'EUR'}>EUR €</option>               
                </>}
      </select>
      <ReactCountryFlag
                  className="checkFlag"
                  countryCode= {currencyRender(currentCurrency)}
                  svg
                  style={{
                      width: '20%',
                      height: 35,
                      marginLeft:2,
                  }}
                  title={currencyRender(currentCurrency)}
              />
  </div> 
  <div className="d-flex align-items-center me-1"> 
      <strong style={{fontSize:13}}> 
        {t('total')} : <span style={{color:'green'}}> {(total*1).toFixed(2)}</span> 
      </strong>
  </div>

</div>

<div  className="card orderSummary d-flex shadow"
      style={{backgroundColor:"#efeded"}}>
  <div className="text-center align-middle fs-4 fw-bold my-3"
        style={{}}> <FaMoneyCheckAlt style={{marginTop:-3}}/> {t('orderSummary')}
  </div>
  <hr className="m-2"></hr>
  <div >
  <ul  className="list-group px-1"
        style={{}} >
    <li className={`py-3 px-2 border-0 d-flex justify-content-between
                  ${selectedLang(currentLang)=='ar'?'rtl ':''}`}
        style={{backgroundColor:"#efeded", fontWeight:600, fontSize:17}}>
        {t('totalAmount')}: 
        <b style={{color:'green'}} >
          {total} {t('mad')}
        </b>
    </li>
    <li className={`py-3 px-2 border-0 d-flex justify-content-between
                   ${selectedLang(currentLang)=='ar'?'rtl text-end':''}`}
        style={{backgroundColor:"#efeded", fontWeight:600, fontSize:17}}>
        {t('shipping')}: 
        <b style={{color:'green'}} >
          0 {t('mad')}
        </b>
    </li>
  </ul>
  </div>
  <hr className="m-2"></hr>
      <div className={`px-3 d-flex justify-content-between ${selectedLang(currentLang)=='ar'?'rtl text-end':''}`}
            style={{fontWeight:700, fontSize:18}}>
            {t('total')}: 
            <b style={{color:'green'}} >
              {total} {t('mad')}
            </b>
      </div>
      <button className='btn btn-dark mx-1 mt-3' style={{height:50}}
              disabled={!cartChecker}
              onClick={toCheckout}>
            <TbCreditCardPay  style={{marginTop:-3, }} className='me-2'/> {t('directCmd')}
      </button>
              
      <div className="container d-flex justify-content-center">
      <div className="row payment-cards-summary ">
              
      <div className="col p-0"
            style={{width:"25%"}}>
          <img src="https://static4.youcan.shop/store-front/images/visa.png" alt="visa"/>
      </div> 
      <div className="col p-0"
          style={{width:"25%"}}>
          <img src="https://static4.youcan.shop/store-front/images/master-card.png" alt="master-card"/>
      </div> 
      <div className="col p-0"
          style={{width:"25%"}}>
          <img src="https://static4.youcan.shop/store-front/images/american-express.png" alt="visa"/>
      </div>
      <div className="col p-0"
                              style={{width:"25%"}}>
        <img src="https://static4.youcan.shop/store-front/images/discover.png" alt="visa"/>
      </div>
    </div>
    </div>
  </div>

</div>


<div className={`cart-div card shadow ${isPhoneScreen?"mt-3":""}`} >
  <div  className='text-center card cardEX' >
    <div className='text-center my-2 fs-3'><b><FaShoppingCart style={{marginTop:-3, }}/> {t('YourCart')}</b></div>
    {!cartChecker ? (
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
              onClick={()=>{goTo("/")}}>
        <b >{t('shopNow')} !</b></button>

    </div>
    ) : (
      <>
          <hr></hr>
          {!isPhoneScreen&&(<>
            <table className='table table-hover table-bordred ' style={{backgroundColor:"#efeded"}}>
            <thead>
              <tr>
                <th className='text-muted'>{t('productInfos')}</th>
                  <th className='text-muted' >{t('quantitAction')}</th>
                  <th className='text-muted'>{t('total')}</th>
              </tr>
            </thead>
            <tbody>
              {shoesItems.map((item, index) => (
                <tr key={index} style={{ cursor: 'pointer', height: 120, }} className=''>
                  <td style={{fontSize:12, width:300}} 
                      className='p-0'
                      >
                      <div className='imgCart py-2 pe-2'>
                        <img src={`${item.image}`} className='imgCartImg rounded' />
                      </div>  
                      <div className='cart-price text-start'>
                        <div className='vertical-align-top' style={{wordSpacing:5}}>
                          <strong style={{fontWeight:500}}>{item.category} {item.ref} </strong> 
                        </div>
                        <div>{item.name}</div>
                        <div  className='vertical-align-top'>
                          <span className="present-price me-1"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                          <span className="deleted-price-cart  mt-1" 
                                style={item.promo===0?{display:'none'}:{}}>
                            <strong style={{fontSize:10, 
                                            fontWeight:500,
                                            textDecoration:'line-through', 
                                            textDecorationColor:'red'}}>
                                      {((item.price).toFixed(2))} {t('mad')}
                            </strong>  
                          </span>                                
                        </div>
                        <div className='text-muted'>
                          <span style={{fontSize:14}}>{t('size')} :</span>
                          <span style={{fontSize:14}}>{item.size}</span>
                        </div>
                      </div>   
                  </td>
                    <td className='align-middle ' style={{width:"24%", aspectRatio:1}}>
                      <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0"
                            style={{height:30, width:25}}
                            onClick={()=>handleMinusQuantity(item)}>-</button>
                      <input
                        type="text"
                        className="text-center align-middle  border border-secondary rounded-0"
                        value={item.quantity}
                        readOnly
                        style={{
                          outline:'none'
                        }}
                      />
                      <button className="btn rounded-0 btn-outline-success btn-sm  "
                              style={{height:30, width:25}}
                              onClick={()=>handlePlusQuantity(item)}
                              >+</button>
                    </div>
                    <button className="btnCart btn btn-light align-middle  border-red mt-3  p-2" 
                            style={{ outline: 0, fontSize:15, width:35,}} 
                            onClick={() => handleRemoveClick(item)}>
                      <FaRegTrashAlt  /> 
                      
                    </button>
                  </td>
                  <td className='align-middle p-0' style={{width:"18%",  
                                                      fontWeight:600,
                                                      fontSize:14}}>
                      <div style={{color:'green',}}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</div>
                      <span className="" 
                                style={item.promo===0?{display:'none',}:{textDecoration:'line-through', textDecorationColor:'red'}}>
                            <strong style={{fontSize:12, fontWeight:500,}}>{((item.price* item.quantity).toFixed(2))} {t('mad')}</strong>  
                      </span>
                  </td>
                </tr>
              ))}
              <>
              {sandalsItems.map((item, index) => (
                <tr key={index} style={{ cursor: 'pointer', height: 120, }} className=''>
                  <td style={{fontSize:12, width:300}} 
                      className='p-0'
                      >
                      <div className='imgCart py-2 pe-2'>
                        <img src={`${item.image}`} className='imgCartImg rounded' />
                      </div>  
                      <div className='cart-price text-start'>
                        <div className='vertical-align-top' style={{wordSpacing:5}}>
                          <strong style={{fontWeight:500}}>{item.category} {item.ref} </strong> 
                        </div>
                        <div>{item.name}</div>
                        <div  className='vertical-align-top'>
                          <span className="present-price me-1"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                          <span className="deleted-price-cart  mt-1" 
                                style={item.promo===0?{display:'none'}:{}}>
                            <strong style={{fontSize:10, 
                                            fontWeight:500,
                                            textDecoration:'line-through', 
                                            textDecorationColor:'red'}}>
                                      {((item.price).toFixed(2))} {t('mad')}
                            </strong>  
                          </span>                                
                        </div>
                        <div className='text-muted'>
                          <span style={{fontSize:14}}>{t('size')} :</span>
                          <span style={{fontSize:14}}>{item.size}</span>
                        </div>
                      </div>   
                  </td>
                    <td className='align-middle ' style={{width:"24%", aspectRatio:1}}>
                      <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0"
                            style={{height:30, width:25}}
                            onClick={()=>handleMinusQuantity(item)}>-</button>
                      <input
                        type="text"
                        className="text-center align-middle  border border-secondary rounded-0"
                        value={item.quantity}
                        readOnly
                        style={{
                          outline:'none'
                        }}
                      />
                      <button className="btn rounded-0 btn-outline-success btn-sm  "
                              style={{height:30, width:25}}
                              onClick={()=>handlePlusQuantity(item)}
                              >+</button>
                    </div>
                    <button className="btnCart btn btn-light align-middle  border-red mt-3  p-2" 
                            style={{ outline: 0, fontSize:15, width:35,}} 
                            onClick={() => handleRemoveClick(item)}>
                      <FaRegTrashAlt  /> 
                      
                    </button>
                  </td>
                  <td className='align-middle p-0' style={{width:"18%",  
                                                      fontWeight:600,
                                                      fontSize:14}}>
                      <div style={{color:'green',}}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</div>
                      <span className="" 
                                style={item.promo===0?{display:'none',}:{textDecoration:'line-through', textDecorationColor:'red'}}>
                            <strong style={{fontSize:12, fontWeight:500,}}>{((item.price* item.quantity).toFixed(2))} {t('mad')}</strong>  
                      </span>
                  </td>
                </tr>
              ))}</>
              {shirtsItems.map((item, index) => (
                <tr key={index} style={{ cursor: 'pointer', height: 120, }} className=''>
                  <td style={{fontSize:12, width:300}} 
                      className='p-0'
                      >
                      <div className='imgCart py-2 pe-2'>
                        <img src={`${item.image}`} className='imgCartImg rounded' />
                      </div>  
                      <div className='cart-price text-start'>
                        <div className='vertical-align-top' style={{wordSpacing:5}}>
                          <strong style={{fontWeight:500}}>{item.category} {item.ref} </strong> 
                        </div>
                        <div>{item.name}</div>
                        <div  className='vertical-align-top'>
                          <span className="present-price me-1"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                          <span className="deleted-price-cart  mt-1" 
                                style={item.promo===0?{display:'none'}:{}}>
                            <strong style={{fontSize:10, 
                                            fontWeight:500,
                                            textDecoration:'line-through', 
                                            textDecorationColor:'red'}}>
                                      {((item.price).toFixed(2))} {t('mad')}
                            </strong>  
                          </span>                                
                        </div>
                        <div className='text-muted'>
                          <span style={{fontSize:14}}>{t('size')} :</span>
                          <span style={{fontSize:14}}>{item.size}</span>
                        </div>
                      </div>   
                  </td>
                    <td className='align-middle ' style={{width:"24%", aspectRatio:1}}>
                      <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0"
                            style={{height:30, width:25}}
                            onClick={()=>handleMinusQuantity(item)}>-</button>
                      <input
                        type="text"
                        className="text-center align-middle  border border-secondary rounded-0"
                        value={item.quantity}
                        readOnly
                        style={{
                          outline:'none'
                        }}
                      />
                      <button className="btn rounded-0 btn-outline-success btn-sm  "
                              style={{height:30, width:25}}
                              onClick={()=>handlePlusQuantity(item)}
                              >+</button>
                    </div>
                    <button className="btnCart btn btn-light align-middle  border-red mt-3  p-2" 
                            style={{ outline: 0, fontSize:15, width:35,}} 
                            onClick={() => handleRemoveClick(item)}>
                      <FaRegTrashAlt  /> 
                      
                    </button>
                  </td>
                  <td className='align-middle p-0' style={{width:"18%",  
                                                      fontWeight:600,
                                                      fontSize:14}}>
                      <div style={{color:'green',}}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</div>
                      <span className="" 
                                style={item.promo===0?{display:'none',}:{textDecoration:'line-through', textDecorationColor:'red'}}>
                            <strong style={{fontSize:12, fontWeight:500,}}>{((item.price* item.quantity).toFixed(2))} {t('mad')}</strong>  
                      </span>
                  </td>
                </tr>
              ))}
              {pantsItems.map((item, index) => (
                <tr key={index} style={{ cursor: 'pointer', height: 120, }} className=''>
                  <td style={{fontSize:12, width:300}} 
                      className='p-0'
                      >
                      <div className='imgCart py-2 pe-2'>
                        <img src={`${item.image}`} className='imgCartImg rounded' />
                      </div>  
                      <div className='cart-price text-start'>
                        <div className='vertical-align-top' style={{wordSpacing:5}}>
                          <strong style={{fontWeight:500}}>{item.category} {item.ref} </strong> 
                        </div>
                        <div>{item.name}</div>
                        <div  className='vertical-align-top'>
                          <span className="present-price me-1"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                          <span className="deleted-price-cart  mt-1" 
                                style={item.promo===0?{display:'none'}:{}}>
                            <strong style={{fontSize:10, 
                                            fontWeight:500,
                                            textDecoration:'line-through', 
                                            textDecorationColor:'red'}}>
                                      {((item.price).toFixed(2))} {t('mad')}
                            </strong>  
                          </span>                                
                        </div>
                        <div className='text-muted'>
                          <span style={{fontSize:14}}>{t('size')} :</span>
                          <span style={{fontSize:14}}>{item.size}</span>
                        </div>
                      </div>   
                  </td>
                    <td className='align-middle ' style={{width:"24%", aspectRatio:1}}>
                      <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0"
                            style={{height:30, width:25}}
                            onClick={()=>handleMinusQuantity(item)}>-</button>
                      <input
                        type="text"
                        className="text-center align-middle  border border-secondary rounded-0"
                        value={item.quantity}
                        readOnly
                        style={{
                          outline:'none'
                        }}
                      />
                      <button className="btn rounded-0 btn-outline-success btn-sm  "
                              style={{height:30, width:25}}
                              onClick={()=>handlePlusQuantity(item)}
                              >+</button>
                    </div>
                    <button className="btnCart btn btn-light align-middle  border-red mt-3  p-2" 
                            style={{ outline: 0, fontSize:15, width:35,}} 
                            onClick={() => handleRemoveClick(item)}>
                      <FaRegTrashAlt  /> 
                      
                    </button>
                  </td>
                  <td className='align-middle p-0' style={{width:"18%",  
                                                      fontWeight:600,
                                                      fontSize:14}}>
                      <div style={{color:'green',}}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</div>
                      <span className="" 
                                style={item.promo===0?{display:'none',}:{textDecoration:'line-through', textDecorationColor:'red'}}>
                            <strong style={{fontSize:12, fontWeight:500,}}>{((item.price* item.quantity).toFixed(2))} {t('mad')}</strong>  
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>   
          </table>
          </>)}
          {isPhoneScreen && (<>
            {shoesItems.map((item, index)=>(
            <div  style={{fontSize:13, width:"100%", height:130}} className='py-1 ' key={index}>
            <div className='imgCart py-2 pe-2'>
              <img src={`${item.image}`} className='imgCartImg rounded' />
            </div>
            <div className="d-flex flex-column justify-content-between cartPriceSM">
              <div className='text-center' style={{wordSpacing:3, textTransform: 'capitalize'}}>
                <b>{item.category.toLowerCase()}</b> {item.name.toLowerCase()} ({item.size})
              </div>
              <div className='d-flex flex-row justify-content-between '
                  style={{height:98}}>
              <div className='priceDetailsSM'>
                <span className="present-price me-2"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                <div className={item.promo==0?'d-none':''}>
                    <b style={{color:'red'}}>{item.promo}%off </b>
                </div>
                <div style={{fontSize:12}}>
                    TOTAL : <b style={{color:'green', }}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</b>
                </div>                              
              </div>                               
              <div className='d-flex justify-content-around align-items-center'
                    style={{marginRight:2}}>
                <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0 p-0"
                            style={{height:25, width:40}}
                            onClick={()=>handleMinusQuantity(item)}> - 
                    </button>
                    <input
                      type="text"
                      className="text-center align-middle  border border-secondary rounded-0"
                      value={item.quantity}
                      readOnly
                      style={{
                        outline:'none'
                      }}
                    />
                    <button className="btn btn-outline-success btn-sm rounded-0 p-0 "
                            style={{height:25, width:40}}
                            onClick={()=>handlePlusQuantity(item)}>+
                    </button>
                </div>
                <div>
                <button className="btnCart btn btn-light  border-red p-0" 
                  style={{ outline: 0, fontSize:15, width:35, display:'inline', height:30}} 
                  onClick={() => handleRemoveClick(item)}>
                <FaRegTrashAlt  /> 
                </button>                                
                </div>
              </div>                               
              </div>
            </div>                            
        </div>
          ))}
        {sandalsItems.map((item, index)=>(
            <div  style={{fontSize:13, width:"100%", height:130}} className='py-1 ' key={index}>
            <div className='imgCart py-2 pe-2'>
              <img src={`${item.image}`} className='imgCartImg rounded' />
            </div>
            <div className="d-flex flex-column justify-content-between cartPriceSM">
              <div className='text-center' style={{wordSpacing:3, textTransform: 'capitalize'}}>
                <b>{item.category.toLowerCase()}</b> {item.name.toLowerCase()} ({item.size})
              </div>
              <div className='d-flex flex-row justify-content-between '
                  style={{height:98}}>
              <div className='priceDetailsSM'>
                <span className="present-price me-2"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                <div className={item.promo==0?'d-none':''}>
                    <b style={{color:'red'}}>{item.promo}%off </b>
                </div>
                <div style={{fontSize:12}}>
                    TOTAL : <b style={{color:'green', }}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</b>
                </div>                              
              </div>                               
              <div className='d-flex justify-content-around align-items-center'
                    style={{marginRight:2}}>
                <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0 p-0"
                            style={{height:25, width:40}}
                            onClick={()=>handleMinusQuantity(item)}> - 
                    </button>
                    <input
                      type="text"
                      className="text-center align-middle  border border-secondary rounded-0"
                      value={item.quantity}
                      readOnly
                      style={{
                        outline:'none'
                      }}
                    />
                    <button className="btn btn-outline-success btn-sm rounded-0 p-0 "
                            style={{height:25, width:40}}
                            onClick={()=>handlePlusQuantity(item)}>+
                    </button>
                </div>
                <div>
                <button className="btnCart btn btn-light  border-red p-0" 
                  style={{ outline: 0, fontSize:15, width:35, display:'inline', height:30}} 
                  onClick={() => handleRemoveClick(item)}>
                <FaRegTrashAlt  /> 
                </button>                                
                </div>
              </div>                               
              </div>
            </div>                            
        </div>
          ))}
        {shirtsItems.map((item, index)=>(
            <div  style={{fontSize:13, width:"100%", height:130}} className='py-1 ' key={index}>
            <div className='imgCart py-2 pe-2'>
              <img src={`${item.image}`} className='imgCartImg rounded' />
            </div>
            <div className="d-flex flex-column justify-content-between cartPriceSM">
              <div className='text-center' style={{wordSpacing:3, textTransform: 'capitalize'}}>
                <b>{item.category.toLowerCase()}</b> {item.name.toLowerCase()} ({item.size})
              </div>
              <div className='d-flex flex-row justify-content-between '
                  style={{height:98}}>
              <div className='priceDetailsSM'>
                <span className="present-price me-2"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                <div className={item.promo==0?'d-none':''}>
                    <b style={{color:'red'}}>{item.promo}%off </b>
                </div>
                <div style={{fontSize:12}}>
                    TOTAL : <b style={{color:'green', }}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</b>
                </div>                              
              </div>                               
              <div className='d-flex justify-content-around align-items-center'
                    style={{marginRight:2}}>
                <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0 p-0"
                            style={{height:25, width:40}}
                            onClick={()=>handleMinusQuantity(item)}> - 
                    </button>
                    <input
                      type="text"
                      className="text-center align-middle  border border-secondary rounded-0"
                      value={item.quantity}
                      readOnly
                      style={{
                        outline:'none'
                      }}
                    />
                    <button className="btn btn-outline-success btn-sm rounded-0 p-0 "
                            style={{height:25, width:40}}
                            onClick={()=>handlePlusQuantity(item)}>+
                    </button>
                </div>
                <div>
                <button className="btnCart btn btn-light  border-red p-0" 
                  style={{ outline: 0, fontSize:15, width:35, display:'inline', height:30}} 
                  onClick={() => handleRemoveClick(item)}>
                <FaRegTrashAlt  /> 
                </button>                                
                </div>
              </div>                               
              </div>
            </div>                            
        </div>
          ))}
        {pantsItems.map((item, index)=>(
            <div  style={{fontSize:13, width:"100%", height:130}} className='py-1 ' key={index}>
            <div className='imgCart py-2 pe-2'>
              <img src={`${item.image}`} className='imgCartImg rounded' />
            </div>
            <div className="d-flex flex-column justify-content-between cartPriceSM">
              <div className='text-center' style={{wordSpacing:3, textTransform: 'capitalize'}}>
                <b>{item.category.toLowerCase()}</b> {item.name.toLowerCase()} ({item.size})
              </div>
              <div className='d-flex flex-row justify-content-between '
                  style={{height:98}}>
              <div className='priceDetailsSM'>
                <span className="present-price me-2"><strong style={{fontSize:14}}>{(item.price*(1-item.promo*0.01)).toFixed(2)} {t('mad')}</strong></span>
                <div className={item.promo==0?'d-none':''}>
                    <b style={{color:'red'}}>{item.promo}%off </b>
                </div>
                <div style={{fontSize:12}}>
                    TOTAL : <b style={{color:'green', }}>{(item.price*(1-0.01*item.promo) * item.quantity).toFixed(2)} {t('mad')}</b>
                </div>                              
              </div>                               
              <div className='d-flex justify-content-around align-items-center'
                    style={{marginRight:2}}>
                <div className="input-group  cart-quantity ">
                    <button className="btn btn-outline-primary btn-sm rounded-0 p-0"
                            style={{height:25, width:40}}
                            onClick={()=>handleMinusQuantity(item)}> - 
                    </button>
                    <input
                      type="text"
                      className="text-center align-middle  border border-secondary rounded-0"
                      value={item.quantity}
                      readOnly
                      style={{
                        outline:'none'
                      }}
                    />
                    <button className="btn btn-outline-success btn-sm rounded-0 p-0 "
                            style={{height:25, width:40}}
                            onClick={()=>handlePlusQuantity(item)}>+
                    </button>
                </div>
                <div>
                <button className="btnCart btn btn-light  border-red p-0" 
                  style={{ outline: 0, fontSize:15, width:35, display:'inline', height:30}} 
                  onClick={() => handleRemoveClick(item)}>
                <FaRegTrashAlt  /> 
                </button>                                
                </div>
              </div>                               
              </div>
            </div>                            
        </div>
          ))}
          
          </>)}
          
          
          
          <div  className='d-flex justify-content-center mb-2'> 
                <button  className="btnCart btn btn-light border-red " 
                          style={{fontSize:17}} 
                          onClick={handleClearAllClick}><FaRegTrashAlt /> {t("clearCart")}</button>
          </div>

    </>)}
  </div>
</div>
</div>

<AnimatePresence
  mode='wait'>
  {isRemoveConfirm && (<Modals
                      rev_productId={undefined}
                      rev_productType={undefined}
                      item={deletedItem}
                      cible={deleteCible}
                      onBack={CancelRemove}
                      onRemove={()=>ConfirmRemove(deletedItem)}
                      onClearAll={handleClearCart}
                      
/>)}
</AnimatePresence>



<Footer/>
    
      
    </>
  );
};

export default Cart;