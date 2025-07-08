import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Select from "react-select";
import { useParams } from "react-router-dom";
import DbHeader from "../DbHeader";
import ProductForm from "../prodForm";
import Loading from "../../Components/loading";
import Accordion from 'react-bootstrap/Accordion';
import ProdDetailsForm from "../prodDetailsForm";
import ProdDelete from "../prodDelete";
import ProdModif from "../prodModif";
import { IoSettings } from "react-icons/io5";
import apiInstance from "../api";
import { useLangContext } from "../../Contexts/languageContext";
import { ProductDetail } from "../../Contexts/ProductsContext";
import { selectedLang } from "../functions";
import { useTranslation } from "react-i18next";

export interface OptionType {
    label:string,
    value : number,
    picture : string
}


const connecter = apiInstance;

const ProductsManager : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const {productType} = useParams<{productType:string}>();
    const [products, setProducts] = useState<OptionType[]>([]);

    // const productSwitcher = (productType:string) => {
    //     let prod = ""; let prodDetail = ""; let prodManager = "";
    //     switch(productType){
    //         case('Shoe'):
    //             prod = 'db/shoes';prodDetail = "db/updateShoeDetails";prodManager = "db/shoes/manager/";break;
    //         case('Sandal'):
    //             prod = 'db/sandals';prodDetail = "db/updateSandalDetails";prodManager = "db/sandals/manager/";break;
    //         case('Shirt'):
    //             prod = 'db/shirts';prodDetail = "db/updateShirtDetails";prodManager = "db/shirts/manager/";break;
    //         case('Pant'):
    //             prod = 'db/pants';prodDetail = "db/updatePantDetails";prodManager = "db/pants/manager/";break;
    //     }
    //     return [prod, prodDetail, prodManager];
    // }

    useEffect(()=>{
        const getProducts = async () => {
          if(productType){
            const response = await connecter.get(`db/productsChoices?productType=${productType}`);
            setProducts(response.data.choices);
          }
        };
        getProducts();
    },[productType]);


    return(<>

        <Sidebar/>
        <div className={`db-home ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
            <DbHeader/>
            <hr/>
            <div className="Prod-manage-title m-4 fw-bold">
              <IoSettings size={20}/> <span className="mx-3">{t('productManagementOf')} : {t(productType?productType:'')} </span>
            </div>
            {productType?<ProductsOperations productType={productType} options={products}/>:<Loading message="Loading"/>}

        </div>


    </>)
};


const ProductsOperations : React.FC<{productType:string, options:OptionType[]}> = ({productType, options}) => {
  const {t} = useTranslation();
  return (

    <Accordion >
      <Accordion.Item eventKey="0" className="my-3 rounded card shadow ">
        <Accordion.Header><span className="fw-bold mx-2">{t('advancedSearch')} </span></Accordion.Header>
        <Accordion.Body>
          <div className="developement-issue d-flex justify-content-center fs-6 fw-bold">
            {t('notDevelopedYet')}
          </div>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1" className="my-3 rounded card shadow ">
        <Accordion.Header><span className="fw-bold mx-2">{t('productDetails')}</span></Accordion.Header>
        <Accordion.Body>
          <ProductDetails AllOptions={options} productType={productType} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold mx-2">{t('addProduct')}</span> </Accordion.Header>
        <Accordion.Body>
        <ProductForm productType={productType} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold mx-2">{t('addProductData')}</span> </Accordion.Header>
        <Accordion.Body>
          <ProdDetailsForm productType={productType} AllOptions={options} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold mx-2">{t('modifyProduct')}</span> </Accordion.Header>
        <Accordion.Body>
          <ProdModif productType={productType} AllOptions={options} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5" className="my-3 rounded card shadow ">
        <Accordion.Header> <span className="fw-bold mx-2">{t('deleteProduct')}</span> </Accordion.Header>
        <Accordion.Body>
          <ProdDelete productType={productType} AllOptions={options}/>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}



const ProductDetails : React.FC<{productType:string, AllOptions:OptionType[]}> = ({productType, AllOptions}) => {
  const {t} = useTranslation();
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [productDetails, setProductsDetails] = useState<ProductDetail[]>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const handleOption = async (option:OptionType | null) =>  {
      setSelectedOption(option);
      if(option?.value){
        setIsLoading(true);
        const res = connecter.get(`db/getProductDetails?productType=${productType}&productId=${option.value}`);
        setProductsDetails((await res).data.data);
        setIsLoading(false);
      }else{
        setProductsDetails(undefined)
      }
    };





  return(<>
  <div className="mb-3">
                    <label htmlFor="ref" className="form-label"> {t('product')} :</label>
                    <Select
                    options={AllOptions}
                    value={selectedOption}
                    onChange={handleOption}
                    placeholder={t('selectProduct')}
                    isClearable
                    />
  </div>
    <div className={`mb-2 ${selectedOption?"d-flex":'d-none'} justify-content-center`} >
      <img src={selectedOption?.picture} alt="" className="border border-dark shadow" style={{width:280}}/>
    </div>
    <div className="mb-3">

        {!productDetails?(<>
        {isLoading?<Loading message="loading"/>:<><span>{t('noProductChosen')}</span></>}
        </>)
        :<>{productDetails.length>0?
      <table className="table table-bordred table-hover mt-2 orders-table rounded shadow border border-dark">
        <thead>
          <tr className="text-muted">
          <th className="text-muted">{t('size')}</th>
          <th className="text-muted">{t('quantity')} </th>
          </tr>
        </thead>
        <tbody>
          {productDetails.map((pro, index)=>(
            <tr key={index}>
              <td>{pro.size}</td>
              <td>{pro.quantity}</td>
            </tr>
          ))}
        </tbody>
        </table>:
        <span>{t('noProductData')} </span>
        }
        </>}

    </div>
  </>)
}





export default ProductsManager;



 