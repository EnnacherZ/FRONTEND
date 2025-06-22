import React, { useState } from "react";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/deficiency.css";
import { FaSortAmountDown } from "react-icons/fa";
import getDeficiencies from "../../Server/dashboard/deficiencies";
import { hideInfos } from "./home";
import ProtectedRoute from "../ProtectedRoute";
import { selectedLang, useLangContext } from "../../Contexts/languageContext";
import NotFound from "../NotFound";


const ExceptionsPage : React.FC= () => {
    const {currentLang} = useLangContext();
    const deficiencies = getDeficiencies();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);


    const processDeficiency = (ord: any) => {
        

    }



return(<>
<ProtectedRoute>
<Sidebar/>
<div className={`db-deficiency ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
    <DbHeader/>
            <div className="fw-bold my-2"><FaSortAmountDown  className="me-3" size={20}/> Deficiencies</div>
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
                        <th className="text-muted">Action</th>
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
                            <td><button className="btn btn-primary" onClick={()=>{processDeficiency(ord)}}>Process</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
                <div className="orders-expansion text-center m-1 d-flex justify-content-center">
                    <button className="btn btn-outline-primary" onClick={()=>setIsExpanded(!isExpanded)}>
                        {!isExpanded?"Read more":"Read less"}
                    </button>
                </div>
            </>
            :<>
            <NotFound message="no deficiency found"/>
            </>}
</div>
</ProtectedRoute>


</>)

};
export default ExceptionsPage;