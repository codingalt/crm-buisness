import React from 'react'
import Layout from "../components/Layout/Layout";
import Diary from '@/components/Diary/Diary';

const DiaryPage = () => {
  return <Layout children={<Diary />} />;
}

export default DiaryPage