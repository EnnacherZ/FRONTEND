import React from "react";
import "./Styles/DbHeader.css"
import { GrOverview } from "react-icons/gr";
import {getRemainingOrders} from "../Server/dashboard/orders";
import { FaWpforms } from "react-icons/fa6";
import { FaSortAmountDown } from "react-icons/fa";
import {getDeficiencies} from "../Server/dashboard/deficiencies";
import { useTranslation } from "react-i18next";


const DbHeader : React.FC = () => {
    const {t} = useTranslation();
    const {remainingOrders} = getRemainingOrders();
    const deficiencies = getDeficiencies();

return(<>
    <div className="db-header d-flex flex-column">
        <div className="db-home-overview m-1 fs-5 mb-3 fw-bold"><GrOverview className="mx-2"/>{t('generalOverview')} </div>
        <div className="d-flex flex-wrap">
        <div className={`m-1 border db-notConfirmed ${!remainingOrders || remainingOrders.length==0?'null border-warning':'border-danger'} fw-bold rounded d-flex flex-row p-1 align-items-center`}>
                <div className={`db-notConfirmed-lg ${!remainingOrders || remainingOrders.length==0?'null':''} rounded mx-2`} ><FaWpforms className="p-1" size={50} color={!remainingOrders || remainingOrders.length==0?'#ffc107':'red'}/></div> 
                <div className="mx-1 text-muted">{t('ordersNotConfirmed')} :</div>
                <div className="mx-1" style={{color:!remainingOrders || remainingOrders.length==0?'#ffc107':'red'}}>{remainingOrders?.length}</div>
        </div>
        <div className={`m-1 border db-notConfirmed ${!deficiencies || deficiencies.length==0?'null border-warning':'border-danger'} fw-bold rounded d-flex flex-row p-1 align-items-center`}>
                <div className={`db-notConfirmed-lg ${!deficiencies || deficiencies.length==0?'null':''} rounded mx-2`} ><FaSortAmountDown className="p-1" size={50} color={!deficiencies || deficiencies.length==0?'#ffc107':'red'}/></div> 
                <div className="mx-1 text-muted">{t('currentDeficiencies')} :</div>
                <div className="mx-1" style={{color:!deficiencies || deficiencies?.length == 0  ?'#ffc107':'red'}}>{deficiencies?.length}</div>
        </div>
        </div>

    </div>
</>)
};
export default DbHeader;