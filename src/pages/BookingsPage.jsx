import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout/Layout";
import Bookings from '../components/Bookings/Bookings';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BookingsPage = () => {
  // const navigate = useNavigate();
  // const { user } = useSelector((store) => store.auth);
  // const [show, setShow] = useState(false);

  // useEffect(() => {
  //   if (user) {
  //     const canSee =
  //       user.employee &&
  //       user.flags.roles.some((role) => role.name === "can_dashboard");
  //     if (user.owner || canSee) {
  //       setShow(true);
  //     } else {
  //       navigate(-1);
  //     }
  //   }
  // }, [user, navigate]);

  return (
    <Layout children={<Bookings />} />
  )
}

export default BookingsPage