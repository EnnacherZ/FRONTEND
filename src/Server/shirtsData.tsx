import { useState, useEffect } from "react";
import { Product, ProductDetail } from "../Contexts/ProductsContext";
import { connecter } from "./connecter";

const useShirtsData = () => {
    const [shirtsData, setShirtsData] = useState<Product[]>();
    const [shirtsDataDetails, setShirtsDataDetails] = useState<ProductDetail[]>([]);



    // useEffect(() => {
    //             const eventSourceProducts = new EventSource(`${apiUrl}events/shirts/`);
    //             const eventSourceProductsDetails = new EventSource(`${apiUrl}events/shirts_sizes/`);
    //             eventSourceProducts.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setShirtsData(data);          
    //             };
    //             eventSourceProductsDetails.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setShirtsDataDetails(data);
    //             };
    //             eventSourceProducts.onerror = (error) => {
    //                 console.log(error)
    //               setShirtsError1(error)
    //             };
    //             eventSourceProductsDetails.onerror = (error) => {
    //             console.log(error)
    //               setShirtsError2(error)
    //             };
    //             return () => {
    //               eventSourceProducts.close();
    //               eventSourceProductsDetails.close();
    //             };
    //           },[]);

    const getProducts = async () => {
      try{
        const res = connecter.get(`api/getProducts?productType=Shirt`);
        setShirtsData((await res).data.products);setShirtsDataDetails((await res).data.products_details || []);
      }
      catch(err){
      }
    }
    useEffect(()=>{
      getProducts();
    },[])
        return ({shirtsData, shirtsDataDetails} )
};
export default useShirtsData;