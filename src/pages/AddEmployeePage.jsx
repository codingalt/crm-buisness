import React from 'react'
import Layout from '../components/Layout/Layout'
import AddEmployee from '../components/Employees/AddEmployee'
import { PusherProvider } from '../context/PusherContext'

const AddEmployeePage = () => {
  return (
    <PusherProvider>
      <Layout children={<AddEmployee />} />
    </PusherProvider>
  )
}

export default AddEmployeePage