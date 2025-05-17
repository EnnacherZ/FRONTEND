import React, { useEffect, useState } from "react";
import Header from "./header";
import Test from "./test.tsx";
import Footer from "./footer.tsx";
import "../Styles/HomePage.css";
import { Product} from "../Contexts/ProductsContext.tsx";
import HomeShoes from "./HomeShoes.tsx";
import HomeSandals from "./HomeSandals.tsx";
import HomeShirts from "./HomeShirts.tsx";
import HomePants from "./HomePants.tsx";
import axios from "axios";
export interface HomePageData{
    promo : Product[];
    noPromo : Product[]
}

export const undefinedHomePageData:HomePageData = {promo:[], noPromo:[]}
const HomePage: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [shoes, setShoes] = useState([])
    const [sandals, setSandals] = useState([])
    const [shirts, setShirts] = useState([])
    const [pants, setPants] = useState([])
    useEffect(()=>{
      const getData = async () =>{
            const allProducts = await axios.get(`${apiUrl}api/getAllProducts`)
            setShoes(allProducts.data.list_shoes || []);
            setSandals(allProducts.data.list_sandals || []);
            setShirts(allProducts.data.list_shirts || []);
            setPants(allProducts.data.list_pants || []);
     };
      getData();
    },[])
    return (<>
        <Header />        
        <Test/>
        <HomeShoes data={shoes}/>
        <HomeSandals data={sandals}/>
        <HomeShirts data={shirts}/>
        <HomePants data={pants}/>
        <Footer/>    
    </>
    );
};

export default HomePage;
