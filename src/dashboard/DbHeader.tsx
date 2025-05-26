import React from "react";
import "./Styles/DbHeader.css"
import { GrOverview } from "react-icons/gr";
import getRemainingOrders from "../Server/dashboard/orders";
import { FaWpforms } from "react-icons/fa6";
import { FaSortAmountDown } from "react-icons/fa";
import getDeficiencies from "../Server/dashboard/deficiencies";


const DbHeader : React.FC = () => {
    const remainingOrders = getRemainingOrders();
    const deficiencies = getDeficiencies();

return(<>
    <div className="db-header d-flex flex-column">
        <div className="db-home-overview m-1 fs-5 mb-3 fw-bold"><GrOverview className="me-2"/> General overview</div>
        <div className="d-flex flex-wrap">
        <div className={`m-1 border db-notConfirmed ${remainingOrders.length==0?'null border-warning':'border-danger'} fw-bold rounded d-flex flex-row p-1 align-items-center`}>
                <div className={`db-notConfirmed-lg ${remainingOrders.length==0?'null':''} rounded mx-2`} ><FaWpforms className="p-1" size={50} color={remainingOrders.length>0?"red":"#ffc107"}/></div> 
                <div className="mx-1 text-muted">Orders not confirmed :</div>
                <div className="mx-1" style={{color:remainingOrders.length>0?'red':'#ffc107'}}>{remainingOrders.length}</div>
        </div>
        <div className={`m-1 border db-notConfirmed ${deficiencies.length==0?'null border-warning':'border-danger'} fw-bold rounded d-flex flex-row p-1 align-items-center`}>
                <div className={`db-notConfirmed-lg ${deficiencies.length==0?'null':''} rounded mx-2`} ><FaSortAmountDown className="p-1" size={50} color={deficiencies.length>0?"red":"#ffc107"}/></div> 
                <div className="mx-1 text-muted">Current deficiencies :</div>
                <div className="mx-1" style={{color:deficiencies.length>0?'red':'#ffc107'}}>{deficiencies.length}</div>
        </div>
        </div>

    </div>
</>)
};
export default DbHeader;