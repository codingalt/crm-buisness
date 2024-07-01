import React from "react";
import shapeCustomer from "@/assets/shapeCustomer.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import css from "./NewAppointment.module.scss";
import { Checkbox } from "@nextui-org/react";
import { MdErrorOutline } from "react-icons/md";

const CustomerData = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    console.log(values);
  };

  return (
    <div className={css.customerData}>
      <div className={css.left}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ errors, setFieldValue, touched }) => (
            <Form className={css.formData}>
              <div className={css.customerCheckbox}>
                <Checkbox radius="sm" size="lg">
                  The client is a customer on this platform
                </Checkbox>
              </div>

              <div className="flex gap-1 items-center mb-11 text-sm font-normal text-[#01ab8e]">
                <MdErrorOutline className="text-[19px]" />
                <span>
                  Registered Customers Will Need To Confirm The Appointment
                </span>
              </div>
              <div className={css.inputContainer}>
                <label htmlFor="email">Customer's Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Please Enter Email of Customer"
                  className={
                    errors.email && touched.email && "inputBottomBorder"
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={css.errorSpan}
                />
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="name">Customer's Name</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Please Enter Name of Customer"
                  className={errors.name && touched.name && "inputBottomBorder"}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.errorSpan}
                />
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="name">Customer's Contact</label>
                <Field
                  type="text"
                  name="contact"
                  id="contact"
                  placeholder="Please Enter Contact Number of Customer"
                  className={
                    errors.contact && touched.contact && "inputBottomBorder"
                  }
                />
                <ErrorMessage
                  name="contact"
                  component="div"
                  className={css.errorSpan}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className={css.right}>
        <div className={css.img}>
          <img src={shapeCustomer} alt="Customer Details Svg" />
        </div>
      </div>
    </div>
  );
};

export default CustomerData;
