import React, { useState } from "react";
// import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/DbHome.css";
import { FaSortAmountDown, FaWpforms } from "react-icons/fa";
import {getRemainingOrders} from "../../Server/dashboard/orders";
import { IoWarning } from "react-icons/io5";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import Modals from "../modals";
import { AnimatePresence } from "framer-motion";
import {getDeficiencies} from "../../Server/dashboard/deficiencies";
import { useLangContext } from "../../Contexts/languageContext";
import NotFound from "../NotFound";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { goTo, hideInfos, selectedLang } from "../functions";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/loading";






const DBHome : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang } = useLangContext();
    const {remainingOrders} = getRemainingOrders();
    const deficiencies = getDeficiencies();
    const [isExpanded, setIsExpanded] = useState<{orders:boolean, deficiencies:boolean}>({orders:false, deficiencies:false});
    const [isOrdModal, setIsOrdModal] = useState<boolean>(false);
    const [targetedOrder, setTargetedOrder] = useState<any>();
    const [targetedDeficiency, setTargetedDeficiency] = useState<any>();
    const [isDeficiencyModal, setIsDeficiencyModal] = useState<boolean>();


    const deficiencyOnClick = (ord: any) => {
        setTargetedDeficiency(ord);
        setIsDeficiencyModal(true);
    }

    const orderExceptions = [<IoWarning color="red" size={25}/>, <MdOutlineFileDownloadDone color="green" size={25}/>]
    const orderStatus = [<p style={{fontSize:"1em", fontWeight:"bold",color:"rgb(234 179 8)"}}>{t('waiting')}</p>, <p style={{fontSize:"1em", fontWeight:"bold", color:"green"}} >{t('done')}</p>]

    const orderOnClick = (ord:any) => {
        setTargetedOrder(ord);
        setIsOrdModal(true);
    }

        const processOrder = (ord:any) => {
        
        if(ord.exception){
            toast.error(t('deficienciesMessage'),{
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false, 
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                })
        }else{
            orderOnClick(ord);
        }
    }


  const toggleExpand = (product:string) => {
    setIsExpanded((prev)=>({...prev, [product]:!prev[product as keyof {orders:boolean, deficiencies:boolean}]}));
  };

    

    return(<>



        <Sidebar/>
        <div className={`db-home ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
            <DbHeader/>
            <div className="fw-bold d-flex justify-content-between me-2 my-3">
                <span><FaWpforms className="m-3" size={20}/>{t('remainingOrders')} </span>
                <a href="Orders" onClick={()=>goTo("Orders")}>{t('showAllOrders')} </a>
            </div>
            
            
                    {remainingOrders?remainingOrders.length>0?
                    <>
                    <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                        <thead>
                            <tr className="text-muted">
                                <th className="text-muted">{t('orderId')}</th>
                                <th className="text-muted">{t('transactionId')}</th>
                                <th className="text-muted">{t('date')}</th>
                                <th className="text-muted">{t('amount')}</th>
                                <th className="text-muted">{t('status')}</th>
                                <th className="text-muted">{t('deficiencies')}</th>
                                <th className="text-muted">{t('action')} </th>
                            </tr>
                        </thead>
                        <tbody>
                            {remainingOrders.slice(0, isExpanded.orders? remainingOrders.length: 3).map((ord, index)=>(
                                <tr key={index}>
                                    <td className="fw-bold">{hideInfos(ord.order_id, 30)}</td>
                                    <td className="fw-bold">{hideInfos(ord.transaction_id, 30)}</td>
                                    <td>{ord.date}</td>
                                    <td>{ord.amount}</td>
                                    <td className="order-status">{ord.status?orderStatus[1]:orderStatus[0]}</td>
                                    <td className="text-center">{ord.exception?orderExceptions[0]:orderExceptions[1]}</td>
                                    <td><button className="btn btn-primary" onClick={()=>{processOrder(ord)}}>{t('process')} </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className={remainingOrders.length>3?"orders-expansion text-center m-1 d-flex justify-content-center":'d-none'} >
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("orders")}>
                                {!isExpanded.orders?`${t('readMore')} ${ remainingOrders.length>=3?`(+ ${remainingOrders.length - 3})`:''}`:t('readLess')}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message={t('noRemainingOrder')}/>
                    </>
                    :
                    <Loading message={t('loading')}/>} 

            <div className="fw-bold me-2 my-3 d-flex justify-content-between">
                <span><FaSortAmountDown  className="m-3" size={20}/>{t('deficiencies')} </span>
                <a href="Deficiency">{t('showAllDeficiencies')}</a>
            </div>
            {deficiencies?deficiencies.length>0?<>
            <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                <thead>
                    <tr className="text-muted">
                        <th className="text-muted">{t('orderId')} </th>
                        <th className="text-muted">{t('productType')}</th>
                        <th className="text-muted">{t('category')}</th>
                        <th className="text-muted">{t('ref')}</th>
                        <th className="text-muted">{t('name')}</th>
                        <th className="text-muted">{t('size')}</th>
                        <th className="text-muted">{t('quantity')}</th>
                        <th className="text-muted">{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {deficiencies.slice(0, isExpanded.deficiencies? deficiencies.length: 3).map((ord, index)=>(
                        <tr key={index}>
                            <td>{hideInfos(ord.order.order_id, 30)}</td>
                            <td>{ord.product_type}</td>
                            <td>{ord.product_category}</td>
                            <td>{ord.product_ref}</td>
                            <td>{ord.product_name}</td>
                            <td>{ord.product_size}</td>
                            <td>{ord.delta_quantity}</td>
                            <td><button className="btn btn-primary" onClick={()=>{deficiencyOnClick(ord)}}>{t('processDeficiency')} </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
                <div className={deficiencies.length>3?'orders-expansion text-center m-1 d-flex justify-content-center':'d-none'}>
                    <button className="btn btn-outline-primary" onClick={()=>toggleExpand("deficiencies")}>
                        {!isExpanded.deficiencies?`${t('readMore')} ${ deficiencies.length>=3?`(+ ${deficiencies.length - 3})`:''}`:t('readLess')}
                    </button>
                </div>
            </>
            :<>
            <NotFound message={t('noDeficiencyFound')}/>
            </>
            :
            <Loading message={t('loading')}/>}
        </div>

        <AnimatePresence mode="wait">
            {isOrdModal&&<Modals
                message={undefined}
                onDelete={undefined}
                cible="orders"
                onBack={()=>setIsOrdModal(false)}
                item={targetedOrder}
            />}         
        </AnimatePresence>

        <AnimatePresence mode="wait">
            {isDeficiencyModal&&<Modals
                message={undefined}
                onDelete={undefined}
                cible="deficiencies"
                onBack={()=>setIsDeficiencyModal(false)}
                item={targetedDeficiency}
            />}         
        </AnimatePresence>


  
<ToastContainer/>

  </>
    )
}
export default DBHome;