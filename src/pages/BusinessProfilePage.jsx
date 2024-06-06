import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import { Profile } from '../components/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BusinessProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      const canSee =
        user.employee &&
        user.flags.roles.some((role) => role.name === "can_profile");
      if (user.owner || canSee) {
        setShow(true);
      } else {
        navigate(-1);
      }
    }
  }, [user, navigate]);

  return <Layout children={show && <Profile />} />;
}

export default BusinessProfilePage