import React, { useState } from "react";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/deficiency.css";
import { FaSortAmountDown } from "react-icons/fa";
import {getDeficiencies} from "../../Server/dashboard/deficiencies";
import ProtectedRoute from "../ProtectedRoute";
import { useLangContext } from "../../Contexts/languageContext";
import NotFound from "../NotFound";
import { hideInfos, selectedLang } from "../functions";
import { AnimatePresence } from "framer-motion";
import Modals from "../modals";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/loading";
import { ToastContainer } from "react-toastify";

const ExceptionsPage : React.FC= () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const deficiencies = getDeficiencies();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [targetedItem, setTargetedItem] = useState<any>();
    const [isDeficiencyModal, setIsDeficiencyModal] = useState<boolean>()

    const processDeficiency = (ord: any) => {
        setTargetedItem(ord);
        setIsDeficiencyModal(true);
    }



return(<>
<ProtectedRoute>
<Sidebar/>
<div className={`db-deficiency ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
    <DbHeader/>
            <div className="fw-bold my-2"><FaSortAmountDown  className="me-3" size={20}/>{t('deficiencies')} </div>
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
                        <th className="text-muted">{t('action')} </th>
                    </tr>
                </thead>
                <tbody>
                    {deficiencies.slice(0, isExpanded? deficiencies.length: 3).map((ord, index)=>(
                        <tr key={index}>
                            <td>{hideInfos(ord.order.order_id, 30)}</td>
                            <td>{ord.product_type}</td>
                            <td>{ord.product_category}</td>
                            <td>{ord.product_ref}</td>
                            <td>{ord.product_name}</td>
                            <td>{ord.product_size}</td>
                            <td>{ord.delta_quantity}</td>
                            <td><button className="btn btn-primary" onClick={()=>{processDeficiency(ord)}}>{t('processDeficiency')} </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
                <div className={deficiencies.length>3?'orders-expansion text-center m-1 d-flex justify-content-center':'d-none'}>
                    <button className="btn btn-outline-primary" onClick={()=>setIsExpanded(!isExpanded)}>
                        {!isExpanded?t('readMore'):t('readLess')}
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
            {isDeficiencyModal&&<Modals
                message={undefined}
                onDelete={undefined}
                cible="deficiencies"
                onBack={()=>{setIsDeficiencyModal(false)}}
                item={targetedItem}
            />}         
        </AnimatePresence>

<ToastContainer/>
</ProtectedRoute>


</>)

};
export default ExceptionsPage;