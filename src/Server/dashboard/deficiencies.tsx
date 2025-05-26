import { useEffect, useState } from "react";
import { connecter } from "../connecter";



const getDeficiencies = () => {
    const [deficiencies, setDeficiencies] = useState<Array<any>>([]);

    useEffect(()=>{
        const getDeficienciesData = async () => {
           try{ 
            const response = await connecter.get("db/getDeficiencies");
            setDeficiencies(response.data.deficiencies || []);
        }catch{}
        }
        getDeficienciesData();
    },[])
    return deficiencies;
}
export default getDeficiencies;