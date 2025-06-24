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
import ProtectedRoute from "../ProtectedRoute";
import { useLangContext } from "../../Contexts/languageContext";
import NotFound from "../NotFound";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { goTo, hideInfos, selectedLang } from "../functions";



const orderExceptions = [<IoWarning color="red" size={25}/>, <MdOutlineFileDownloadDone color="green" size={25}/>]
const orderStatus = [<p style={{fontSize:"1em", fontWeight:"bold",color:"rgb(234 179 8)"}}>Waiting</p>, <p style={{fontSize:"1em", fontWeight:"bold",color:"green"}}>Done</p>]



const DBHome : React.FC = () => {
    const {currentLang } = useLangContext();
    const {remainingOrders} = getRemainingOrders();
    const deficiencies = getDeficiencies();
    const [isExpanded, setIsExpanded] = useState<{orders:boolean, deficiencies:boolean}>({orders:false, deficiencies:false});
    const [isOrdModal, setIsOrdModal] = useState<boolean>(false);
    const [targetedItem, setTargetedItem] = useState<any>();

    const orderOnClick = (ord:any) => {
        setTargetedItem(ord);
        setIsOrdModal(true);
    }

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
            orderOnClick(ord);
        }
    }


  const toggleExpand = (product:string) => {
    setIsExpanded((prev)=>({...prev, [product]:!prev[product as keyof {orders:boolean, deficiencies:boolean}]}));
  };
    
    return(<>
<ProtectedRoute>


        <Sidebar/>
        <div className={`db-home ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
            <DbHeader/>
            <div className="fw-bold d-flex justify-content-between me-2 my-3">
                <span><FaWpforms className="m-3" size={20}/>Remaining Orders</span>
                <a href="Orders" onClick={()=>goTo("Orders")}>Show all orders</a>
            </div>
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
                            {remainingOrders.slice(0, isExpanded.orders? remainingOrders.length: 3).map((ord, index)=>(
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
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("orders")}>
                                {!isExpanded.orders?`Read more ${ remainingOrders.length>=3?`(+ ${remainingOrders.length - 3})`:''}`:"Read less"}
                            </button>
                        </div>
                    </>
                    :<>
                    <NotFound message="No remaining orders found !"/>
                    </>} 

            <div className="fw-bold me-2 my-3 d-flex justify-content-between">
                <span><FaSortAmountDown  className="me-3" size={20}/> Deficiencies</span>
                <a href="Deficiency">Show all deficiencies</a>
            </div>
            {deficiencies.length>0?<>
            <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                <thead>
                    <tr className="text-muted">
                        <th className="text-muted">Order ID</th>
                        <th className="text-muted">Product Type</th>
                        <th className="text-muted">Product Category</th>
                        <th className="text-muted">Product Ref</th>
                        <th className="text-muted">Product Name</th>
                        <th className="text-muted">Size</th>
                        <th className="text-muted">Quantity</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
                <div className="orders-expansion text-center m-1 d-flex justify-content-center">
                    <button className="btn btn-outline-primary" onClick={()=>toggleExpand("deficiencies")}>
                        {!isExpanded.deficiencies?`Read more ${ deficiencies.length>=3?`(+ ${deficiencies.length - 3})`:''}`:"Read less"}
                    </button>
                </div>
            </>
            :<>
            <NotFound message="no deficiency found"/>
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
  </>
    )
}
export default DBHome;