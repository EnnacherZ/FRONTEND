import React from "react";
import { FaRegCopyright } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import iconStoreWhite from "../assets/WHITE FIRDAOUS STORE.png";
import '../Styles/footer.css'


const Footer : React.FC = () => {



    return(<>
        <div className="footerX d-flex flex-column pt-2 mt-2 shadow">
            <div className="iconStoreWDiv mb-4">
                <img src={iconStoreWhite}  />
            </div>
            <div className="d-flex flex-wrap justify-content-around ">
            <div className="p-3">
              <div className="fw-bold mb-2 text-center">About us</div>
              <div className=""
                    style={{fontSize:14}}>
                  We are moroccan a web store that specilise in<br/>
                   selling men clothes products as Shoes, Sandals<br/> 
                    Shirts and pants.<br/>
                    You are welcome!
              </div>
            </div>
            <div className="p-3">
              <div className="fw-bold text-center ">Contact us</div>
              <div className=" text-center mt-2" style={{fontSize:14}}>
                <p>Tel    : +212600000000</p>
                <p>E-mail : ennacherstore@gmail.com</p>
              </div>
            </div>
            <div className=" p-3">
              <div className="fw-bold text-start">Follow us</div>
              <p><a className="socialLinks mt-2" href="#"><FontAwesomeIcon icon={faFacebook} beat style={{}} /> Facebook</a></p>
              <p><a className="socialLinks" href="#"><FontAwesomeIcon icon={faInstagram} beat style={{}} /> Instagram</a></p>
              <p><a className="socialLinks" href="#"><FontAwesomeIcon icon={faTwitter} beat style={{}} /> Twitter</a></p>
                
            </div>
            <div className="p-3">
              <div className="fw-bold text-center">Policies and privacy</div>
            </div>

            </div>
            <div className="copyrightTitle fw-bold mt-1 d-flex justify-content-center">
              ENNACHER STORE <FaRegCopyright style={{margin:5}}/> 2024
            </div>



        </div>

    </>)
}
export default Footer;