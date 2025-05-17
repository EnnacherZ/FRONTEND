import React from "react";
import "../Styles/HomeProduct.css";
import sandals from "./products1images/sandals.png";
import shoe from"./products1images/shoes.png";
import casualshirts from "./products1images/casualshirts.png";
import tshirtssport from "./products1images/tshirstsport.png";
import pantssport from "./products1images/pantssport.png";
import pantsclass from "./products1images/pantsclass.jpg"
import { useNavigate } from 'react-router-dom';



const HomeProduct : React.FC = ()  => {
    const navigate = useNavigate()

    return(
        <div>
            <div className='HomeProduct1'>
                <div className='shoes-product'>
                    <img src={shoe} className='product-img'/>
                    <div className='text-overlay1'>
                        <p>COLLECTION CHAUSSURES !</p>
                    </div>
                    <div className='product-butt'><button onClick={()=>navigate("/shoes")} style={{position:"absolute",outline:'none',}}>See all products</button></div>
                </div>
                <div className='sandales-product'>
                    <img src={sandals} className='product-img'/>
                    <div className='product-butt'><button onClick={()=>navigate("/sandals")} style={{position:"absolute",outline:'none',}}>See all products</button></div>
                </div>
                <div className='pantsClass-product'>
                    <img src={pantsclass} className='product-img'/>
                    <div className='text-overlay1'>
                        <p>PANTALONS CLASSIQUES !</p>
                    </div>
                    <div className='product-butt'><button onClick={()=>navigate("/pants")} style={{position:"absolute",outline:'none',}}>See all products</button></div>
                </div>
                <div className='pantsSport-product'>
                    <img src={pantssport} className='product-img'/>
                    <div className='text-overlay1'>
                        <p>PANTALONS SPORT !</p>
                    </div>
                    <div className='product-butt'><button style={{position:"absolute",outline:'none',}}>See all products</button></div>
                </div>
                <div className='shirts-product'>
                    <img src={tshirtssport} className='product-img'/>
                    <div className='text-overlay1'>
                        <p>COLLECTION T-SHIRTS !</p>
                    </div>
                    <div className='product-butt'><button style={{position:"absolute",outline:'none',}}>See all products</button></div>
                </div>
                <div className='shirtsCasual-product'>
                    <img src = {casualshirts} className='product-img'/>
                    <div className='text-overlay1'>
                        <p>COLLECTION SHIRTS !</p>
                    </div>
                    <div className='product-butt'><button style={{position:"absolute",outline:'none',}}>See all products</button></div>
                </div>
            </div>
                
            
        </div>
        
    );
};
export default HomeProduct;