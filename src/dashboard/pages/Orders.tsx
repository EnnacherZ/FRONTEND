import React, {useState } from "react";
import Sidebar from "../sidebar";
import { useLangContext } from "../../Contexts/languageContext";
import DbHeader from "../DbHeader";
import { FaWpforms } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import {getRemainingOrders} from "../../Server/dashboard/orders";
import { IoWarning } from "react-icons/io5";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import {ToastContainer } from "react-toastify";
import NotFound from "../NotFound";
import { AnimatePresence } from "framer-motion";
import Modals from "../modals";
import { hideInfos, selectedLang } from "../functions";
import Loading from "../../Components/loading";






const Orders : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const {remainingOrders, allOrders, deliveredOrders, waitingDeliveryOrders} = getRemainingOrders();
    const [isExpanded, setIsExpanded] = useState<{remaining:boolean, delivered:boolean, all:boolean, waitingDelivery:boolean}>({waitingDelivery:false, remaining:false, delivered:false, all:false});
    const [isOrdModal, setIsOrdModal] = useState<boolean>(false);
    const [targetedItem, setTargetedItem] = useState<any>();



    const orderExceptions = [<IoWarning color="red" size={25}/>, <MdOutlineFileDownloadDone color="green" size={25}/>]
    const orderStatus = [<p style={{fontSize:"1em", fontWeight:"bold",color:"rgb(234 179 8)"}}>{t('waiting')}</p>, <p style={{fontSize:"1em", fontWeight:"bold", color:"green"}} >{t('done')}</p>]


  const toggleExpand = (product:string) => {
    setIsExpanded((prev)=>({...prev, [product]:!prev[product as keyof {remaining:boolean, delivered:boolean, all:boolean}]}));
  };

    const processOrder = (ord:any) => {
        setTargetedItem(ord);
        setIsOrdModal(true);
        
    }

//     useEffect(()=>{
//         const getUrl = async () =>{
//             setDeliveryForm(await DeliveryForm(Array.from({ length: 75 }, (_, i) => ({
//   productType: "Type" + i,
//   category: "Cat" + (i % 5),
//   ref: "REF" + i,
//   name: "Product " + i,
//   quantity: (i % 3) + 1,
//   price: 10 + i,
// })),{
//   amount: 1000,
//   discount: -50,
//   shipping: 30,
//   paymentMethod: "Credit Card",
//   shippingMethod: "Colissimo",
//   shippingDate: "2025-06-10",
//   date: "2025-06-07",
//   order_id: "ORD123456",
// },{
//   firstname: "Jean",
//   lastname: "Dupont",
//   tel: "0601020304",
//   address: "123 rue de Paris",
//   email: "jean.dupont@example.com",
//   city: "Paris",
// }))
//         }
//         getUrl();
//     },[])

    return(<>

        <Sidebar/>
        <div className={`db-deficiency ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
            <DbHeader/>
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>{t('remainingOrders')}</div>
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
                            {remainingOrders.slice(0, isExpanded.remaining? remainingOrders.length: 3).map((ord, index)=>(
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
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("remaining")}>
                                {!isExpanded.remaining?`${t('readMore')} ${ remainingOrders.length>=3?`(+ ${remainingOrders.length - 3})`:''}`:t('readLess')}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message={t('noRemainingOrder')}/>
                    </>
                    :
                    <Loading message={t('loading')}/>}
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>{t('deliveredOrders')} </div>
                    {waitingDeliveryOrders?waitingDeliveryOrders.length>0?
                    <>
                    <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                        <thead>
                            <tr className="text-muted">
                                <th className="text-muted">{t('orderId')}</th>
                                <th className="text-muted">{t('deliveryMan')}</th>
                                <th className="text-muted">{t('date')}</th>
                                <th className="text-muted">{t('amount')}</th>
                                <th className="text-muted">{t('status')}</th>
                                <th className="text-muted">{t('deficiencies')}</th>
                                <th className="text-muted">{t('action')} </th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitingDeliveryOrders.slice(0, isExpanded.waitingDelivery? waitingDeliveryOrders.length: 3).map((ord, index)=>(
                                <tr key={index}>
                                    <td className="fw-bold">{hideInfos(ord.order_id, 30)}</td>
                                    <td className="fw-bold">{ord.delivery_man}</td>
                                    <td>{ord.date}</td>
                                    <td>{ord.amount}</td>
                                    <td className="order-status">{ord.status?orderStatus[1]:orderStatus[0]}</td>
                                    <td className="text-center">{ord.exception?orderExceptions[0]:orderExceptions[1]}</td>
                                    <td><button className="btn btn-info fw-bold" onClick={()=>{processOrder(ord)}}>{t('details')}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className={waitingDeliveryOrders.length>3?"orders-expansion text-center m-1 d-flex justify-content-center":'d-none'}>
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("waitingDelivery")}>
                                {!isExpanded.waitingDelivery?`${t('readMore')} ${ waitingDeliveryOrders.length>=3?`(+ ${waitingDeliveryOrders.length - 3})`:''}`:t('readLess')}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message={t('noDeliveredOrderFound')}/>
                    </>
                    :
                    <Loading message={t('loading')}/>}
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>{t('deliveredOrders')} </div>
                    {deliveredOrders?deliveredOrders.length>0?
                    <>
                    <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                        <thead>
                            <tr className="text-muted">
                                <th className="text-muted">{t('orderId')}</th>
                                <th className="text-muted">{t('deliveryMan')}</th>
                                <th className="text-muted">{t('date')}</th>
                                <th className="text-muted">{t('amount')}</th>
                                <th className="text-muted">{t('status')}</th>
                                <th className="text-muted">{t('deficiencies')}</th>
                                <th className="text-muted">{t('action')} </th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredOrders.slice(0, isExpanded.delivered? deliveredOrders.length: 3).map((ord, index)=>(
                                <tr key={index}>
                                    <td className="fw-bold">{hideInfos(ord.order_id, 30)}</td>
                                    <td className="fw-bold">{ord.delivery_man}</td>
                                    <td>{ord.date}</td>
                                    <td>{ord.amount}</td>
                                    <td className="order-status">{ord.status?orderStatus[1]:orderStatus[0]}</td>
                                    <td className="text-center">{ord.exception?orderExceptions[0]:orderExceptions[1]}</td>
                                    <td><button className="btn btn-info fw-bold" onClick={()=>{processOrder(ord)}}>{t('details')}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className={deliveredOrders.length>3?"orders-expansion text-center m-1 d-flex justify-content-center":'d-none'}>
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("delivered")}>
                                {!isExpanded.delivered?`${t('readMore')} ${ deliveredOrders.length>=3?`(+ ${deliveredOrders.length - 3})`:''}`:t('readLess')}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message={t('noDeliveredOrderFound')}/>
                    </>
                    :
                    <Loading message={t('loading')}/>}
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>{t('allOrders')}</div>
                    {allOrders?allOrders.length>0?
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
                            {allOrders.slice(0, isExpanded.all? allOrders.length: 3).map((ord, index)=>(
                                <tr key={index}>
                                    <td className="fw-bold">{hideInfos(ord.order_id, 30)}</td>
                                    <td className="fw-bold">{hideInfos(ord.transaction_id, 30)}</td>
                                    <td>{ord.date}</td>
                                    <td>{ord.amount}</td>
                                    <td className="order-status">{ord.status?orderStatus[1]:orderStatus[0]}</td>
                                    <td className="text-center">{ord.exception?orderExceptions[0]:orderExceptions[1]}</td>
                                    <td><button className="btn btn-info fw-bold" onClick={()=>{processOrder(ord)}}>{t('details')} </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className={allOrders.length>3?"orders-expansion text-center m-1 d-flex justify-content-center":'d-none'}>
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("all")}>
                                {!isExpanded.all?`${t('readMore')} ${ allOrders.length>=3?`(+ ${allOrders.length - 3})`:''}`:t('readLess')}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message={t('noOrderFound')}/>
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
                item={targetedItem}
            />}         
        </AnimatePresence>
        <ToastContainer/>


</>)


};

export default Orders;