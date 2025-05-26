import { useState, useEffect } from "react";
import { Product, ProductDetail } from "../Contexts/ProductsContext";
import { connecter } from "./connecter";

const usePantsData = () => {
    const [pantsData, setPantsData] = useState<Product[]>([]);
    const [pantsDataDetails, setPantsDataDetails] = useState<ProductDetail[]>([]);


    // useEffect(() => {
    //             const eventSourceProducts = new EventSource(`${apiUrl}events/pants/`);
    //             const eventSourceProductsDetails = new EventSource(`${apiUrl}events/pants_sizes/`);
    //             eventSourceProducts.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setPantsData(data);          
    //             };
    //             eventSourceProductsDetails.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setPantsDataDetails(data);
    //             };
    //             eventSourceProducts.onerror = (error) => {
    //                 console.log(error)
    //               setPantsError1(error)
    //             };
    //             eventSourceProductsDetails.onerror = (error) => {
    //             console.log(error)
    //               setPantsError2(error)
    //             };
            
    //             return () => {
    //               eventSourceProducts.close();
    //               eventSourceProductsDetails.close();
    //             };
    //           },[]);

    const getProducts = async () => {
      try{
        const res = connecter.get(`api/getProducts?productType=Pant`);
        setPantsData((await res).data.products || []);setPantsDataDetails((await res).data.products_details || []);
      }
      catch(err){
      }
    }
    useEffect(()=>{
      getProducts();
    },[])

        return ({pantsData,pantsDataDetails} )
};
export default usePantsData;