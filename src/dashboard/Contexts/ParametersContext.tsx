import React, {useContext, createContext, ReactNode, useEffect, useState} from "react";
import { connecter } from "../../Server/connecter";



interface ParametersProps {
    categories : any;
}


const ParametersContext = createContext<ParametersProps | undefined>(undefined);


export const ParametersContextProvider : React.FC<{children:ReactNode}> = ({children}) => {

    const [categories, setCategories] = useState<any>({});

    useEffect(()=>{
        const getCategories = async () => {
            const response = await connecter.get('db/products/getParameters?param=categories');
            setCategories(response.data.categories || undefined);
        }
        getCategories();
    },[]);


    return(
        <ParametersContext.Provider
        value={{categories}}
        
        >
        {children}
        </ParametersContext.Provider>
    )

}


export const useParametersContext = (): ParametersProps => {
    const context = useContext(ParametersContext);
    if (context === undefined) {
      throw new Error('useProductsContext must be used within a ProductsProvider');
    }
    return context;
  };