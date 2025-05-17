import React from "react";
import Sidebar from "../sidebar";
import { useParams } from "react-router-dom";
import DbHeader from "../DbHeader";
import ProductForm from "../../prodForm";
import Loading from "../../Components/loading";


const AddShoes : React.FC = () => {
    const {productType} = useParams<{productType:string}>();


    return(<>
        <Sidebar/>
        <div className="db-home">
            <DbHeader/>
            {productType?<ProductForm productType={productType}/>:<Loading message="Loading"/>}
        </div>

    </>)
};
export default AddShoes