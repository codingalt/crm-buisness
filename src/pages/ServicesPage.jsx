import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import Services from '../components/ServicesPrices/Services';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ServicesPage = () => {
   const navigate = useNavigate();
   const { user } = useSelector((store) => store.auth);
   const [show, setShow] = useState(false);

   useEffect(() => {
     if (user) {
       const canSee =
         user.employee &&
         user.flags.roles.some((role) => role.name === "can_services");
       if (user.owner || canSee) {
         setShow(true);
       } else {
         navigate(-1);
       }
     }
   }, [user, navigate]);

  return <Layout children={show && <Services />} />;
}

export default ServicesPage