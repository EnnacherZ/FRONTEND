import React from "react";
import { MdDoNotDisturbAlt } from "react-icons/md";



const NotFound: React.FC<{onReset :() => void}> = ({onReset}) => {


  return (
    <>
    <div  className="d-flex flex-column align-items-center pt-5 rounded" 
          style={{marginBlock:20, height:200, margin:'auto'}}>
      <div><MdDoNotDisturbAlt size={50}/></div>
      <div className="fw-bold">
        The element is not found ! 
      </div>
      <button className="reset-button btn btn-primary mt-4" onClick={onReset}>
        Show all
      </button>
    </div>
    </>
  );
};

export default NotFound;
