import React from "react";
import {CirclesWithBar}  from 'react-loader-spinner';


const Loading : React.FC<{message : string}> = ({message}) =>{
    return(<>
            <div className="my-5" >
                <CirclesWithBar
                        height="10em"
                        width="10em"
                        color="#0e92e4"
                        ariaLabel="loading"
                        wrapperStyle={{justifyContent:'center'}}
                        
                    />
                    <div className="loading-msg fs-3 fw-bold text-center mt-4">
                        {message}
                    </div>
            </div>
                    

    </>)
}
export default Loading;