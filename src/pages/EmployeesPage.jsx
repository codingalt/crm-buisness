import React, { useEffect, useState } from "react";
import Employees from "../components/Employees/Employees";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EmployeesPage = () => {
   const navigate = useNavigate();
   const { user } = useSelector((store) => store.auth);
   const [show, setShow] = useState(false);

   useEffect(() => {
     if (user) {
       const canSee =
         user.employee &&
         user.flags.roles.some((role) => role.name === "can_employees");
       if (user.owner || canSee) {
         setShow(true);
       } else {
         navigate(-1);
       }
     }
   }, [user, navigate]);

  return <Layout children={show && <Employees />} />;
};

export default EmployeesPage;
