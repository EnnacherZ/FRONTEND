import React, { useState } from "react";
// import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/DbHome.css";
import { FaSortAmountDown, FaWpforms } from "react-icons/fa";
import getRemainingOrders from "../../Server/dashboard/orders";
import { IoWarning } from "react-icons/io5";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import Modals from "../modals";
import { AnimatePresence } from "framer-motion";
import getDeficiencies from "../../Server/dashboard/deficiencies";
import ProtectedRoute from "../ProtectedRoute";



const orderExceptions = [<IoWarning color="red" size={25}/>, <MdOutlineFileDownloadDone color="green" size={25}/>]
const orderStatus = [<p style={{fontSize:"1em", fontWeight:"bold",color:"rgb(234 179 8)"}}>Waiting</p>, <p style={{fontSize:"1em", fontWeight:"bold"}} color="green">Done</p>]

export const hideInfos = (infos:string, range:number) => {
    const showedLength = infos.length - range 
    return infos.slice(0, showedLength) + "*".repeat(10)
}

const DBHome : React.FC = () => {
    const remainingOrders = getRemainingOrders();
    const deficiencies = getDeficiencies();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isOrdModal, setIsOrdModal] = useState<boolean>(false);
    const [targetedItem, setTargetedItem] = useState<any>();

    const orderOnClick = (ord:any) => {
        setTargetedItem(ord);
        setIsOrdModal(true);
    }

    return(<>
<ProtectedRoute>


        <Sidebar/>
        <div className="db-home">
            <DbHeader/>
            <div className="fw-bold"><FaWpforms className="me-3" size={20}/>Remaining Orders</div>
            <table className="table table-bordred table-hover mt-2 orders-table rounded shadow-sm">
                <thead>
                    <tr className="text-muted">
                        <th className="text-muted">Order ID</th>
                        <th className="text-muted">Transaction ID</th>
                        <th className="text-muted">Date</th>
                        <th className="text-muted">Amount</th>
                        <th className="text-muted">Status</th>
                        <th className="text-muted">Exceptions</th>
                        <th className="text-muted">Action</th>
                    </tr>
                </thead>
                <tbody>

                    {remainingOrders.slice(0, isExpanded?remainingOrders.length:3).map((ord, index)=>(
                        <tr key={index} onClick={()=>orderOnClick(ord)}>
                            <td>{hideInfos(ord.order_id, 30)}</td>
                            <td>{hideInfos(ord.transaction_id, 30)}</td>
                            <td>{ord.date}</td>
                            <td>{ord.amount}</td>
                            <td className="order-status">{ord.status?orderStatus[1]:orderStatus[0]}</td>
                            <td className="text-center">{ord.exception?orderExceptions[0]:orderExceptions[1]}</td>
                            <td><button className="btn btn-primary">Process</button></td>
                        </tr>
                    ))}

                </tbody>
            </table>
                <div className="orders-expansion text-center m-1 d-flex justify-content-center">
                    <button className="btn btn-outline-primary" onClick={()=>setIsExpanded(!isExpanded)}>
                        {!isExpanded?"Read more":"Read less"}
                    </button>
                </div>

            <div className="fw-bold"><FaSortAmountDown  className="me-3" size={20}/> Deficiencies</div>
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
                    {deficiencies.slice(0, isExpanded? deficiencies.length: 3).map((ord, index)=>(
                        <tr key={index}>
                            <td>{hideInfos(ord.order, 30)}</td>
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
                    <button className="btn btn-outline-primary" onClick={()=>setIsExpanded(!isExpanded)}>
                        {!isExpanded?"Read more":"Read less"}
                    </button>
                </div>
        </div>

        <AnimatePresence mode="wait">
            {isOrdModal&&<Modals
                onDelete={undefined}
                cible="orders"
                onBack={()=>setIsOrdModal(false)}
                item={targetedItem}
            />}         
        </AnimatePresence>


  

</ProtectedRoute>
  </>
    )
}
export default DBHome;