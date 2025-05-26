import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { useParams } from "react-router-dom";
import DbHeader from "../DbHeader";
import ProductForm from "../prodForm";
import Loading from "../../Components/loading";
import Accordion from 'react-bootstrap/Accordion';
import ProdDetailsForm from "../prodDetailsForm";
import ProdDelete from "../prodDelete";
import ProdModif from "../prodModif";
import { Product } from "../../Contexts/ProductsContext";
import { IoSettings } from "react-icons/io5";
import { GiSettingsKnobs } from "react-icons/gi";
import ProtectedRoute from "../ProtectedRoute";
import apiInstance from "../api";

export interface OptionType {
    label:string,
    value : number
}

let AllOptions : OptionType[] = [];

const connecter = apiInstance;

const ProductsManager : React.FC = () => {
    const {productType} = useParams<{productType:string}>();
    const [products, setProducts] = useState<Product[]>([]);

    const productSwitcher = (productType:string) => {
        let prod = ""; let prodDetail = ""; let prodManager = "";
        switch(productType){
            case('Shoe'):
                prod = 'db/shoes';prodDetail = "db/updateShoeDetails";prodManager = "db/shoes/manager/";break;
            case('Sandal'):
                prod = 'db/sandals';prodDetail = "db/updateSandalDetails";prodManager = "db/sandals/manager/";break;
            case('Shirt'):
                prod = 'db/shirts';prodDetail = "db/updateShirtDetails";prodManager = "db/shirts/manager/";break;
            case('Pant'):
                prod = 'db/pants';prodDetail = "db/updatePantDetails";prodManager = "db/pants/manager/";break;
        }
        return [prod, prodDetail, prodManager];
    }

    useEffect(()=>{
        const getProducts = async () => {
          if(productType){
            const response = await connecter.get(productSwitcher(productType)[0]);
            setProducts(response.data);
          }
        };
        getProducts();
    },[productType]);


    useEffect(()=>{
        if(products.length>0){
        AllOptions = products.map((pro)=>({label: String(pro.category + " " + pro.ref + " " + pro.name), value: pro.id}))
    }}, [products])

    return(<>
    <ProtectedRoute>
        <Sidebar/>
        <div className="db-home">
            <DbHeader/>
            <hr/>
            <div className="Prod-manage-title m-4 fw-bold">
              <IoSettings size={20}/> <span className="mx-3">Management of {productType} products</span>
            </div>
            {productType?<ProductsOperations productType={productType}/>:<Loading message="Loading"/>}
            <hr/>
            <div className="Prod-manage-title m-4 fw-bold">
              <GiSettingsKnobs  size={20}/> <span className="mx-3">Settings of {productType} products</span>
            </div>
        </div>
    </ProtectedRoute>

    </>)
};


const ProductsOperations : React.FC<{productType:string}> = ({productType}) => {

  return (

    <Accordion >
      <Accordion.Item eventKey="0" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold">Add a product</span> </Accordion.Header>
        <Accordion.Body>
        <ProductForm productType={productType} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold">Add products data</span> </Accordion.Header>
        <Accordion.Body>
          <ProdDetailsForm productType={productType} AllOptions={AllOptions} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold">Modify a product</span> </Accordion.Header>
        <Accordion.Body>
          <ProdModif productType={productType} AllOptions={AllOptions} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold">Delete a product</span> </Accordion.Header>
        <Accordion.Body>
          <ProdDelete productType={productType} AllOptions={AllOptions}/>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default ProductsManager

