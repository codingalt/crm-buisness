import React, { useEffect, useState } from "react";
import shapeCustomer from "@/assets/shapeCustomer.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import css from "./NewAppointment.module.scss";
import { Button, Checkbox } from "@nextui-org/react";
import { MdErrorOutline } from "react-icons/md";
import {
  manualAppointmentSchema,
  manualAppointmentSchema2,
} from "@/utils/validations/AppointmentValidation";
import * as Yup from "yup";
import debounce from "lodash.debounce";
import { TiTick } from "react-icons/ti";
import { useGetCustomerDataByEmailMutation } from "@/services/api/authApi/authApi";
import ClipSpinner from "../Loader/ClipSpinner";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Tooltip } from "@mui/material";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import { toastError } from "../Toast/Toast";

const CustomerData = ({
  handleNext,
  handleBack,
  activeStep,
  stepsLength,
  initialValues,
  setInitialValues,
  isCustomer,
  setIsCustomer,
}) => {
  const [isError, setIsError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [getCustomerData, res] = useGetCustomerDataByEmailMutation();
  const { data, isLoading, isSuccess, error } = res;
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const apiErrors = useApiErrorHandling(error);

  useEffect(() => {
    if (data) {
      if (data.customer) {
        setIsValid(true);
        // setIsCustomer(true);
        const res = data.customer;
        setInitialValues((prevValues) => ({
          ...prevValues,
          name: res.name,
          email: res.email,
          contact: res.phone_number,
        }));
      } else {
        // Set Error
        if(isCustomer){
          setIsError(true);
        }
      }
    }
  }, [data]);

  const handleSubmit = async (values) => {

    const {data: resp} = await getCustomerData({ email: values.email });
    const res = resp?.customer;

    setInitialValues({
      name: values.name,
      email: values.email,
      contact: values.contact,
    });

    if (isCustomer && !res) {
      setIsError(true);
      toastError("Please enter a valid email address");
    } else if (!isCustomer && res) {
      toastError("Customer with this email is already registered.");
      return;
    } else {
      handleNext();
    }
  };

  const handleEmailValidation = debounce(async (event, setFieldValue) => {
    const value = event.target.value;
    // Get Customer Data when email is valid
    setIsError(null);
    setIsValid(null);
    if(isCustomer){
      if (value.trim() !== "") {
        // Validate email format
        if (Yup.string().email().isValidSync(value)) {
          await getCustomerData({ email: value });
        } 
      }
    }

    setFieldValue("email", value);
  }, 1000);

  const StepsButton = () => {
    return (
      <div className="mb-2 mt-14">
        <div>
          <Button
            size="lg"
            radius="sm"
            className="mr-3 mt-1 bg-[#01ab8e] text-white"
            type="submit"
          >
            {activeStep === stepsLength - 1 ? "Finish" : "Continue"}
          </Button>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className="mr-1 mt-1 bg-transparent"
          >
            Back
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={css.customerData}>
      <div className={css.left}>
        <Formik
          initialValues={initialValues}
          validationSchema={
            isCustomer ? manualAppointmentSchema2 : manualAppointmentSchema
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, setFieldValue, touched }) => (
            <Form className={css.formData}>
              <div className={css.customerCheckbox}>
                <Checkbox
                  isSelected={isCustomer}
                  onValueChange={setIsCustomer}
                  radius="sm"
                  size={isSmallDevice ? "sm" : "lg"}
                >
                  The client is a customer on this platform
                </Checkbox>
              </div>

              <div className="flex gap-1 mb-10 md:mb-11 text-tiny md:text-sm font-normal text-[#01ab8e]">
                <MdErrorOutline className="text-[26px] -mt-0.5 md:mt-0 md:text-[19px]" />
                <span>
                  Registered Customers Will Need To Confirm The Appointment
                </span>
              </div>
              <div className={`${css.inputContainer} relative`}>
                <label htmlFor="email">Customer's Email</label>
                <Field
                  required={true}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Please Enter Email of Customer"
                  className={errors.email && touched.email && "redBorder"}
                  onKeyUp={(e) => handleEmailValidation(e, setFieldValue)}
                  // disabled={isLoading}
                  style={{ paddingRight: "2.7rem" }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={css.errorSpan}
                />

                <Tooltip title={isError && "Customer not found"}>
                  <div
                    className={
                      "z-10 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all absolute right-1 -mt-0.5 md:-mt-1 md:right-4 top-1/2 text-lg md:text-2xl"
                    }
                  >
                    {isLoading ? (
                      <ClipSpinner size={isSmallDevice ? 18 : 21} />
                    ) : isValid ? (
                      <TiTick className="text-green-500" />
                    ) : isError ? (
                      <MdErrorOutline className="text-red-500" />
                    ) : (
                      <></>
                    )}
                  </div>
                </Tooltip>
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="name">Customer's Name</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Please Enter Name of Customer"
                  className={errors.name && touched.name && "redBorder"}
                  readOnly={isCustomer}
                  disabled={isCustomer}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.errorSpan}
                />
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="contact">Customer's Contact</label>
                <Field
                  type="text"
                  name="contact"
                  id="contact"
                  placeholder="Please Enter Contact Number of Customer"
                  className={errors.contact && touched.contact && "redBorder"}
                  readOnly={isCustomer}
                  disabled={isCustomer}
                />
                <ErrorMessage
                  name="contact"
                  component="div"
                  className={css.errorSpan}
                />
              </div>

              {/* Steps Button  */}
              <StepsButton />
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
