import { useState, useEffect } from "react";
import { Product, ProductDetail } from "../Contexts/ProductsContext";
import { connecter } from "./connecter";

const useShoesData = () => {
    const [shoesData, setShoesData] = useState<Product[]>([]);
    const [shoesDataDetails, setShoesDataDetails] = useState<ProductDetail[]>([]);

    // useEffect(() => {
    //             const eventSourceProducts = new EventSource(`${apiUrl}events/shoes/`);
    //             const eventSourceProductsDetails = new EventSource(`${apiUrl}events/shoes_sizes/`);  
    //             eventSourceProducts.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setShoesData(data);          
    //             };
    //             eventSourceProductsDetails.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setShoesDataDetails(data);
    //             };
    //             eventSourceProducts.onerror = (error) => {
    //                 console.log(error)
    //               setShoesError1(error)
    //             };
    //             eventSourceProductsDetails.onerror = (error) => {
    //             console.log(error)
    //               setShoesError2(error)
    //             };
    //             return () => {
    //               eventSourceProducts.close();
    //               eventSourceProductsDetails.close();
    //             };
    //           },[]);
    const getProducts = async () => {
      try{
        const res = connecter.get(`api/getProducts?productType=Shoe`);
        setShoesData((await res).data.products || []);setShoesDataDetails((await res).data.products_details || []);
      }
      catch(err){
        console.log(err)
      }
    }
    useEffect(()=>{
      getProducts();
    },[])
        return ({shoesData, shoesDataDetails})
};
export default useShoesData;