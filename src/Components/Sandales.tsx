import React, { useEffect, useState } from "react";
import Header from "./header";
import sandals from "../assets/sandals.png"
import { DataToFilter } from "./FilterSection";
import Products from "./products";
import Footer from "./footer.tsx";
import { LiaShoePrintsSolid } from "react-icons/lia";
import Marquee from "react-fast-marquee"
import { FaCircleDot } from "react-icons/fa6";
import useSandalsData from "../Server/sandalsData.tsx";
import { Product } from "../Contexts/ProductsContext.tsx";
import Loading from "./loading.tsx";


const Sandals: React.FC = () => {
  const {sandalsData, sandalsDataDetails} = useSandalsData();
  const [filteredProduct, setFilteredProduct] = useState<Product[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<DataToFilter>(
    {product : '',
    category : '',
    ref : '',
    name : ''}
  )
  

  useEffect(() => {
    const show = () =>{
        const filtredStreamedShoes = filterData(sandalsData, selectedCriteria);
        setFilteredProduct(filtredStreamedShoes); 
      };
      show();
  }, [selectedCriteria, sandalsData]);

  const filterData = (data: Product[], criterias: DataToFilter) => {
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
    const filteredShoes = filterData(sandalsData, criterias);
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
      <img src={sandals} alt="" style={{width:'100%', height:'100%'}}/>
    </div>
    <div className="ShoesTitle fw-bold rounded">
      <LiaShoePrintsSolid className="ShoesTitleIcon" /> 
      Sandals models 
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
    {sandalsData.length>0?<Products pData={filteredProduct} 
              pDataDetails={sandalsDataDetails} 
              productShowed="Sandal" 
              handleFilter={handleProductSearch}
              handleReset={handleReset}/>
            :<Loading message="Loading ..."/>}

    <Footer/>

 

    </>
  );
};

export default Sandals;
