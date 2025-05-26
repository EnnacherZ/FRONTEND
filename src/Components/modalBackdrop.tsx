import React, { ReactNode } from "react";
import {motion} from "framer-motion";
import "../Styles/modals.css"


const ModalBackDrop : React.FC<{children:ReactNode, onClose:()=>void | undefined, onOpen:boolean}> = ({children, onClose, onOpen }) =>{

    return(<>
        <motion.div
            className={`BackDrop ${onOpen?'':'d-none'}`}
            onClick = {onClose}
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
        >
            {children}
        </motion.div>
    
    </>)
}
export default ModalBackDrop