import React from 'react'
import Layout from '@/components/Layout/Layout'
import NewAppointment from '@/components/NewAppointment/NewAppointment'

const AddAppointmentPage = () => {
  return (
    <Layout children={<NewAppointment />} />
  )
}

export default AddAppointmentPage