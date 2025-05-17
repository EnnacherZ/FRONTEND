import React from "react";
// import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "./sidebar";
import DbHeader from "./DbHeader";
import "../Styles/DbHome.css";
import { FaWpforms } from "react-icons/fa";
import getRemainingOrders from "../Server/dashboard/orders";



const DBHome : React.FC = () => {
    const remainingOrders = getRemainingOrders();

    return(<>
        <Sidebar/>
        <div className="db-home">
            <DbHeader/>
            <div className="fw-bold"><FaWpforms className="me-3" size={20}/> Orders</div>
            <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                <thead>
                    <tr className="text-muted">
                        <th>Order ID</th>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    {remainingOrders.map((ord, index)=>(
                        <tr key={index}>
                            <td>{ord.order_id}</td>
                            <td>{ord.transaction_id}</td>
                            <td>{ord.date}</td>
                            <td>{ord.amount}</td>
                            <td>{ord.status?"Verified":"Waiting"}</td>
                            <td><button className="btn btn-primary">Process</button></td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>


    </>

    )
}
export default DBHome;