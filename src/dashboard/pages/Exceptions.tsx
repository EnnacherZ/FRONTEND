import React, { useState } from "react";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/deficiency.css";
import { FaSortAmountDown } from "react-icons/fa";
import getDeficiencies from "../../Server/dashboard/deficiencies";
import { hideInfos } from "./home";
import ProtectedRoute from "../ProtectedRoute";
import { selectedLang, useLangContext } from "../../Contexts/languageContext";


const ExceptionsPage : React.FC= () => {
    const {currentLang} = useLangContext();
    const deficiencies = getDeficiencies();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

return(<>
<ProtectedRoute>
<Sidebar/>
<div className={`db-deficiency ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
    <DbHeader/>
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
</ProtectedRoute>


</>)

};
export default ExceptionsPage;