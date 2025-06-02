import { useState, useEffect } from "react";
import { Product, ProductDetail } from "../Contexts/ProductsContext";
import { connecter } from "./connecter";

const useSandalsData = () => {
    const [sandalsData, setSandalsData] = useState<Product[]>();
    const [sandalsDataDetails, setSandalsDataDetails] = useState<ProductDetail[]>([]);


    // useEffect(() => {
    //             const eventSourceProducts = new EventSource(`${apiUrl}events/sandals/`);
    //             const eventSourceProductsDetails = new EventSource(`${apiUrl}events/sandals_sizes/`);           
    //             eventSourceProducts.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setSandalsData(data);          
    //             };
    //             eventSourceProductsDetails.onmessage = (event) => {
    //               const { data } = JSON.parse(event.data);
    //               setSandalsDataDetails(data);
    //             };
    //             eventSourceProducts.onerror = (error) => {
    //                 console.log(error)
    //               setSandalsError1(error)
    //             };
    //             eventSourceProductsDetails.onerror = (error) => {
    //             console.log(error)
    //               setSandalsError2(error)
    //             };
            
    //             return () => {
    //               eventSourceProducts.close();
    //               eventSourceProductsDetails.close();
    //             };
    //           },[]);

        const getProducts = async () => {
          try{
            const res = connecter.get(`api/getProducts?productType=Sandal`);
            setSandalsData((await res).data.products);setSandalsDataDetails((await res).data.products_details || []);
          }
          catch(err){
          }
        }
        useEffect(()=>{
          getProducts();
        },[])

        return ({sandalsData, sandalsDataDetails} )
};
export default useSandalsData;