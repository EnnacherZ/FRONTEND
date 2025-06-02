import React, { useEffect, useState } from "react";
import Header from "./header";
import "../Styles/Shoes.css";
import { DataToFilter } from "./FilterSection";
import Products from "./products";
import Footer from "./footer.tsx";
import { LiaShoePrintsSolid } from "react-icons/lia";
import Marquee from "react-fast-marquee"
import { FaCircleDot } from "react-icons/fa6";
import useShirtsData from "../Server/shirtsData.tsx";
import { Product } from "../Contexts/ProductsContext.tsx";
import shirts from "../assets/shirts.png";

const Sandals: React.FC = () => {
  const {shirtsData, shirtsDataDetails} = useShirtsData();
  const [filteredProduct, setFilteredProduct] = useState<Product[]>();
  const [selectedCriteria, setSelectedCriteria] = useState<DataToFilter>(
    {product : '',
    category : '',
    ref : '',
    name : ''}
  )
  

  useEffect(() => {
    const show = () =>{
        const filtredStreamedShoes = filterData(shirtsData, selectedCriteria);
        setFilteredProduct(filtredStreamedShoes); 
      };
      show();
  }, [selectedCriteria, shirtsData]);

  const filterData = (data: Product[] | undefined, criterias: DataToFilter) => {
    if(!data){return undefined}
    return data.filter((item) => {
      if(criterias.category===""&& criterias.name===""&& criterias.ref===""){return true}
      const categoryMatch = criterias.category
      ? item.category.replace(/\s/g, "").toLowerCase().includes(criterias.category.replace(/\s/g, "").toLowerCase())
      : false;

    const refMatch = criterias.ref
      ? item.ref.replace(/\s/g, "").toLowerCase().includes(criterias.ref.replace(/\s/g, "").toLowerCase())
      : false;

    const nameMatch = criterias.name
      ? item.name.replace(/\s/g, "").toLowerCase().includes(criterias.name.replace(/\s/g, "").toLowerCase())
      : false;

    return categoryMatch || refMatch || nameMatch;
    });
  };

  const handleProductSearch = (criterias: DataToFilter) => {
    setSelectedCriteria(criterias);
    const filteredShoes = filterData(shirtsData, criterias);
    setFilteredProduct(filteredShoes);
  };
  const handleReset = ()=>{
    setSelectedCriteria(
      {product : '',
        category : '',
        ref : '',
        name : ''}
    )
  }

  return (<>

    <Header/>
    <div className="" style={{width:'100%', height:"15rem"}}>
      <img src={shirts} alt="" style={{width:'100%', height:'100%'}}/>
    </div>
    <div className="ShoesTitle fw-bold rounded">
      <LiaShoePrintsSolid className="ShoesTitleIcon" /> 
      Shirts models 
      <LiaShoePrintsSolid className="ShoesTitleIcon" /> 
    </div>
    <div className="ShoesAnnouncement ">
      <Marquee speed={50} gradient={false} >
        <span>
        <FaCircleDot /> Mocassins 
        </span>
        <span>
        <FaCircleDot /> Classics
        </span>
        <span>
        <FaCircleDot /> Baskets
        </span>
        <span>
        <FaCircleDot /> Medical
        </span>

      </Marquee>
    </div>
    <Products pData={filteredProduct} 
              pDataDetails={shirtsDataDetails} 
              productShowed="Shirt" 
              handleFilter={handleProductSearch}
              handleReset={handleReset}/>
   

    <Footer/>

 

    </>
  );
};

export default Sandals;
