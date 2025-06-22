import React, {useState } from "react";
import ProtectedRoute from "../ProtectedRoute";
import Sidebar from "../sidebar";
import { selectedLang, useLangContext } from "../../Contexts/languageContext";
import DbHeader from "../DbHeader";
import { FaWpforms } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import getRemainingOrders from "../../Server/dashboard/orders";
import { hideInfos } from "./home";
import { IoWarning } from "react-icons/io5";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { toast, ToastContainer, Zoom } from "react-toastify";
import NotFound from "../NotFound";
import { AnimatePresence } from "framer-motion";
import Modals from "../modals";




const orderExceptions = [<IoWarning color="red" size={25}/>, <MdOutlineFileDownloadDone color="green" size={25}/>]
const orderStatus = [<p style={{fontSize:"1em", fontWeight:"bold",color:"rgb(234 179 8)"}}>Waiting</p>, <p style={{fontSize:"1em", fontWeight:"bold", color:"green"}} >Done</p>]

const Orders : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const {remainingOrders, allOrders, deliveredOrders} = getRemainingOrders();
    const [isExpanded, setIsExpanded] = useState<{remaining:boolean, delivered:boolean, all:boolean}>({remaining:false, delivered:false, all:false});
    const [isOrdModal, setIsOrdModal] = useState<boolean>(false);
    const [targetedItem, setTargetedItem] = useState<any>();


  const toggleExpand = (product:string) => {
    setIsExpanded((prev)=>({...prev, [product]:!prev[product as keyof {remaining:boolean, delivered:boolean, all:boolean}]}));
  };

    const processOrder = (ord:any) => {
        if(ord.exception){
            toast.error('Please process the deficiencies, then process the order !',{
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false, 
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                })
        }else{
        setTargetedItem(ord);
        setIsOrdModal(true);
        }
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
        <ProtectedRoute>
        <Sidebar/>
        <div className={`db-deficiency ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
            <DbHeader/>
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>{t('remainingOrders')}</div>
                    {remainingOrders.length>0?
                    <>
                    <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                        <thead>
                            <tr className="text-muted">
                                <th className="text-muted">Order ID</th>
                                <th className="text-muted">Transaction ID</th>
                                <th className="text-muted">Date</th>
                                <th className="text-muted">Amount</th>
                                <th className="text-muted">Status</th>
                                <th className="text-muted">Deficiencies</th>
                                <th className="text-muted">Action</th>
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
                                    <td><button className="btn btn-primary" onClick={()=>{processOrder(ord)}}>Process</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className="orders-expansion text-center m-1 d-flex justify-content-center">
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("remaining")}>
                                {!isExpanded.remaining?`Read more ${ remainingOrders.length>=3?`(+ ${remainingOrders.length - 3})`:''}`:"Read less"}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message="No remaining orders found !"/>
                    </>} 
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>Delivered Orders</div>
                    {deliveredOrders.length>0?
                    <>
                    <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                        <thead>
                            <tr className="text-muted">
                                <th className="text-muted">Order ID</th>
                                <th className="text-muted">Transaction ID</th>
                                <th className="text-muted">Date</th>
                                <th className="text-muted">Amount</th>
                                <th className="text-muted">Status</th>
                                <th className="text-muted">Deficiencies</th>
                                <th className="text-muted">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredOrders.slice(0, isExpanded.delivered? deliveredOrders.length: 3).map((ord, index)=>(
                                <tr key={index}>
                                    <td className="fw-bold">{hideInfos(ord.order_id, 30)}</td>
                                    <td className="fw-bold">{hideInfos(ord.transaction_id, 30)}</td>
                                    <td>{ord.date}</td>
                                    <td>{ord.amount}</td>
                                    <td className="order-status">{ord.status?orderStatus[1]:orderStatus[0]}</td>
                                    <td className="text-center">{ord.exception?orderExceptions[0]:orderExceptions[1]}</td>
                                    <td><button className="btn btn-primary" onClick={()=>{processOrder(ord)}}>Process</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className="orders-expansion text-center m-1 d-flex justify-content-center">
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("delivered")}>
                                {!isExpanded.delivered?`Read more ${ deliveredOrders.length>=3?`(+ ${deliveredOrders.length - 3})`:''}`:"Read less"}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message="No delivered orders found !"/>
                    </>}
                    <div className="fw-bold my-3"><FaWpforms  className="me-3" size={20}/>All Orders</div>
                    {allOrders.length>0?
                    <>
                    <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                        <thead>
                            <tr className="text-muted">
                                <th className="text-muted">Order ID</th>
                                <th className="text-muted">Transaction ID</th>
                                <th className="text-muted">Date</th>
                                <th className="text-muted">Amount</th>
                                <th className="text-muted">Status</th>
                                <th className="text-muted">Deficiencies</th>
                                <th className="text-muted">Action</th>
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
                                    <td><button className="btn btn-primary" onClick={()=>{processOrder(ord)}}>Process</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        <div className="orders-expansion text-center m-1 d-flex justify-content-center">
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("all")}>
                                {!isExpanded.all?`Read more ${ allOrders.length>=3?`(+ ${allOrders.length - 3})`:''}`:"Read less"}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message={'No order found !'}/>
                    </>}


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
        </ProtectedRoute>

</>)


};

export default Orders;