import React from "react";
import "../Styles/DbHeader.css"
import { MdOutlineSmsFailed } from "react-icons/md";
import { GrOverview } from "react-icons/gr";
import getRemainingOrders from "../Server/dashboard/orders";


const DbHeader : React.FC = () => {
    const remainingOrders = getRemainingOrders();

return(<>
    <div className="db-header">
        <div className="db-home-overview m-1 fs-5 mb-3 fw-bold"><GrOverview className="me-2"/> General overview</div>
        <div className="db-notConfirmed fw-bold rounded d-flex flex-row p-1 align-items-center ">
                <div className="db-notConfirmed-lg rounded mx-2" ><MdOutlineSmsFailed className="p-1" size={50} color="red"/></div> 
                <div className="mx-1">Orders not confirmed :</div>
                <div className="mx-1">{remainingOrders.length}</div>
        </div>
    </div>
</>)
};
export default DbHeader;