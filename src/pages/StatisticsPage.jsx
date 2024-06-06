import React, { useEffect, useState } from 'react'
import Statistics from '../components/Statistics/Statistics'
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StatisticsPage = () => {
   const navigate = useNavigate();
   const { user } = useSelector((store) => store.auth);
   const [show, setShow] = useState(false);

   useEffect(() => {
     if (user) {
       const canSee =
         user.employee &&
         user.flags.roles.some((role) => role.name === "can_view_statistics");
       if (user.owner || canSee) {
         setShow(true);
       } else {
         navigate(-1);
       }
     }
   }, [user, navigate]);

  return <Layout children={show && <Statistics />} />;
}

export default StatisticsPage