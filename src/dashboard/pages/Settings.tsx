import React, { useEffect, useState } from "react";
import ProtectedRoute from "../ProtectedRoute";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/settings.css";
import Accordion from "react-bootstrap/esm/Accordion";
import apiInstance from "../api";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../../Contexts/languageContext";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { GiSettingsKnobs } from "react-icons/gi";
import { selectedLang } from "../functions";


const connecter = apiInstance;



const Settings : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const [productTypes, setProductTypes] = useState<string[]>();

    useEffect(()=>{
      const getTypes = async () => {
        const response = await connecter.get('db/products/getTypes');
        setProductTypes(response.data.types || [""]);
      };
      getTypes();
    },[])


return(<>
    <ProtectedRoute>
        <Sidebar/>
        <div className={`db-settings ${selectedLang(currentLang)=='ar'&&'rtl'}`} >
            <DbHeader/>
            <hr/>
            <div className="Prod-manage-title m-4 fw-bold">
              <GiSettingsKnobs  size={20}/> <span className="mx-3">{t('productSettings')} </span>
            </div>           
            <Accordion>
              <Accordion.Item eventKey="0" className="my-3 rounded card shadow ">
                <ProductTypes />
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="my-3 rounded card shadow ">
                <ProductParameters productType={productTypes?productTypes:[""]} param="categories"/>
              </Accordion.Item>
              <Accordion.Item eventKey="2" className="my-3 rounded card shadow ">
                <Accordion.Header></Accordion.Header>
                <Accordion.Body></Accordion.Body>
              </Accordion.Item>
            </Accordion>
            
            
        </div>
        
    </ProtectedRoute>

</>)

}







const ProductParameters : React.FC<{productType:string[], param:string}> = ({productType, param}) => {
  const {t} = useTranslation();
  const capitalize = (str:string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const [valuesText, setValuesText] = useState("");
  const [selectedType, setSelectedType] = useState<string>();
  //const [productsCategories, setProductsCategories] = useState<string[]>([]);
  const handlePostParameters = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = valuesText
      .split(",")
      .map((v) => capitalize(v.trim()))
      .filter((v) => v.length > 0);

    try {
      if(!selectedType){
            toast.error('Please select a product type',{
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
      const response = await connecter.post("db/products/parameters", 
        {
          productType: selectedType, param: param, values : values
        }
      )

      if (response.status ==201) {
        window.location.reload()
      }
    } }catch (error) {
    }
  };


return(<>
      <Accordion.Header> <span className="fw-bold">Add product categories</span> </Accordion.Header>
        <Accordion.Body>
          <form onSubmit={handlePostParameters}>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label">{t('productType')}:</label>
            {productType.length>0?(<>
            <select name="" id="" className="form-select" aria-placeholder="Choose a product type" onChange={(e)=>{setSelectedType(e.target.value)}}>
            <option value={undefined}>Open this select menu</option>
            {productType.map((type,index)=>(
                <option value={type} key={index}>{type}</option>
            ))}
            </select>
            </>)
            :(<>
            <input
              type="text"
              className="form-control"
              id="category"
              value={"There is no product type in database"}
              disabled
            />
            </>)}
          </div>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label">Category:</label>
            <input
              className="form-control"
              id="category"
              type="text"
              value={valuesText}
              onChange={(e) => setValuesText(e.target.value)}
              placeholder="ex: val1, val2, val3"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </Accordion.Body>
<ToastContainer/>
</>)

};


const ProductTypes : React.FC = () => {
  
  const [productTypes, setProductTypes] = useState("");
  //const [productsCategories, setProductsCategories] = useState<string[]>([]);
  const handlePostParameters = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = productTypes
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    try {
      const response = await connecter.post("db/products/setTypes", 
        {
          values : values
        }
      )

      if (response.status ==201) {
        window.location.reload()
      }
    } catch (error) {
    }
  };


return(<>
      <Accordion.Header> <span className="fw-bold">Add product types</span> </Accordion.Header>
        <Accordion.Body>
          <form onSubmit={handlePostParameters}>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label">Product type:</label>
            <input
              className="form-control"
              id="category"
              type="text"
              value={productTypes}
              onChange={(e) => setProductTypes(e.target.value)}
              placeholder="ex: val1, val2, val3"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </Accordion.Body>
</>)

};



















export default Settings



