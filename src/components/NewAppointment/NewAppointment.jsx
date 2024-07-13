import React, { useEffect, useState } from "react";
import css from "./NewAppointment.module.scss";
import Services from "./Services";
import { Step, StepContent, StepLabel, Stepper } from "@mui/material";
import CustomerData from "./CustomerData";
import PaymentMethod from "./PaymentMethod";
import { Button } from "@nextui-org/react";
import { toastError, toastSuccess } from "../Toast/Toast";
import {
  useAddManualAppointmentMutation,
  useGetPaymentMethodsQuery,
} from "@/services/api/bookingsApi/bookingsApi";
import { useGetServicesQuery } from "@/services/api/servicesApi/servicesApi";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import { useNavigate } from "react-router-dom";
import ChooseDateTime from "./ChooseDateTime";
import moment from "moment";

const formatDate = (selectedDate, selectedTime) => {
  const date = moment(selectedDate);
  const time = moment.utc(selectedTime);

  const formattedDate = date.format("YYYY-MM-DD");
  const formattedTime = time.format("HH:mm:ss");

  // Concatenate the formatted date and time
  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  return formattedDateTime;
};

const NewAppointment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const stepsLength = 4;
  const [selectedService, setSelectedService] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isCustomer, setIsCustomer] = useState(false);
  const [dateTimeValues, setDateTimeValues] = useState({
    date: moment().format("YYYY-MM-DD"),
    time: moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
  });

  const { data, isLoading, refetch, error } = useGetPaymentMethodsQuery();
  const { data: services, isLoading: isLoadingServices } =
    useGetServicesQuery();

  // Manual Appointment Mutation
  const [manualAppointment, resp] = useAddManualAppointmentMutation();
  const {
    isLoading: isLoadingManualAppointment,
    isSuccess: isSuccessManualAppointment,
    error: errorManualAppointment,
  } = resp;

  const apiErrors = useApiErrorHandling(errorManualAppointment);

  useEffect(() => {
    if (isSuccessManualAppointment) {
      toastSuccess("Appointment Successfull.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [isSuccessManualAppointment]);

  const handleManualAppointment = async () => {
    if (!selectedService || !paymentMethod) {
      toastError("Please fill all the details properly.");
      return;
    }

    const formattedDateTime = formatDate(
      dateTimeValues.date,
      dateTimeValues.time
    );

    await manualAppointment({
      serviceId: selectedService,
      data: {
        name: initialValues.name,
        email: initialValues.email,
        phone_number: initialValues.contact,
        payment_method_id: paymentMethod?.id,
        date: formattedDateTime,
        is_customer: isCustomer
      },
    });
  };

  useEffect(() => {
    if (data) {
      setPaymentMethod(data.paymentMethods[0]);
    }
  }, [data]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      toastError("Please select a service");
      return;
    }

    if (activeStep === 3) {
      handleManualAppointment();
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const StepsButton = () => {
    return (
      <div className="mb-2 mt-12 md:mt-14">
        <div>
          <Button
            size="lg"
            radius="sm"
            onClick={handleNext}
            className="mr-3 mt-1 bg-[#01ab8e] text-white"
            isLoading={isLoadingManualAppointment}
          >
            {activeStep === stepsLength - 1
              ? "Confirm Appointment"
              : "Continue"}
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
    <div className={`${css.wrapper} max-w-screen-2xl xl:px-2`}>
      <h3>Add an appointment for your Customer</h3>

      {/* Stepper  */}
      <div className={css.card}>
        <div className={css.stepperWrapper}>
          <Stepper activeStep={activeStep} orientation={"vertical"}>
            <Step>
              <StepLabel
                sx={{
                  [".Mui-active"]: {
                    color: "#01ab8e !important",
                  },
                  [".Mui-completed"]: {
                    color: "#01ab8e !important",
                  },
                  [".MuiStepLabel-label"]: {
                    fontSize: "22px",
                    fontWeight: 500,
                    lineHeight: "36px",
                  },
                  "@media (max-width: 600px)": {
                    [".MuiStepLabel-label"]: {
                      fontSize: "18px",
                      lineHeight: "32px",
                    },
                  },
                }}
              >
                Select a Service
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                  "@media (max-width: 600px)": {
                    pl: "20px",
                    py: "18px",
                  },
                }}
              >
                <Services
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  data={services}
                  isLoading={isLoadingServices}
                />
                <StepsButton />
              </StepContent>
            </Step>

            <Step>
              <StepLabel
                sx={{
                  [".Mui-active"]: {
                    color: "#01ab8e !important",
                  },
                  [".Mui-completed"]: {
                    color: "#01ab8e !important",
                  },
                  [".MuiStepLabel-label"]: {
                    fontSize: "22px",
                    fontWeight: 500,
                    lineHeight: "36px",
                  },
                  "@media (max-width: 600px)": {
                    [".MuiStepLabel-label"]: {
                      fontSize: "18px",
                      lineHeight: "32px",
                    },
                  },
                }}
              >
                Choose Date & Time
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                  "@media (max-width: 600px)": {
                    pl: "20px",
                    py: "18px",
                  },
                }}
              >
                <ChooseDateTime
                  handleNext={handleNext}
                  handleBack={handleBack}
                  activeStep={activeStep}
                  stepsLength={stepsLength}
                  dateTimeValues={dateTimeValues}
                  setDateTimeValues={setDateTimeValues}
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel
                sx={{
                  [".Mui-active"]: {
                    color: "#01ab8e !important",
                  },
                  [".Mui-completed"]: {
                    color: "#01ab8e !important",
                  },
                  [".MuiStepLabel-label"]: {
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "36px",
                  },
                  "@media (max-width: 600px)": {
                    [".MuiStepLabel-label"]: {
                      fontSize: "18px",
                      lineHeight: "32px",
                    },
                  },
                }}
              >
                Provide Customer's Data <span className={css.sec_text}></span>
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                  "@media (max-width: 600px)": {
                    pl: "20px",
                    py: "18px",
                  },
                }}
              >
                <CustomerData
                  handleNext={handleNext}
                  handleBack={handleBack}
                  activeStep={activeStep}
                  stepsLength={stepsLength}
                  initialValues={initialValues}
                  setInitialValues={setInitialValues}
                  isCustomer={isCustomer}
                  setIsCustomer={setIsCustomer}
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel
                sx={{
                  [".Mui-active"]: {
                    color: "#01ab8e !important",
                  },
                  [".Mui-completed"]: {
                    color: "#01ab8e !important",
                  },
                  [".MuiStepLabel-label"]: {
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "36px",
                  },
                  "@media (max-width: 600px)": {
                    [".MuiStepLabel-label"]: {
                      fontSize: "18px",
                      lineHeight: "32px",
                    },
                  },
                }}
              >
                Select Payment Method
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                  "@media (max-width: 600px)": {
                    pl: "20px",
                    py: "18px",
                  },
                }}
              >
                <PaymentMethod
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  isLoading={isLoading}
                  refetch={refetch}
                  error={error}
                  data={data}
                />
                <StepsButton />
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;
