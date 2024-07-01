import React, { useState } from "react";
import css from "./NewAppointment.module.scss";
import Services from "./Services";
import { Step, StepContent, StepLabel, Stepper } from "@mui/material";
import CustomerData from "./CustomerData";
import PaymentMethod from "./PaymentMethod";
import { Button } from "@nextui-org/react";

const NewAppointment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsLength = 3;

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const StepsButton = ()=>{
      return (
        <div className="mb-2 mt-14">
          <div>
            <Button
            size="lg"
            radius="sm"
              onClick={handleNext}
              className="mr-3 mt-1 bg-[#01ab8e] text-white"
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
    }


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
                }}
              >
                Select a Service
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                }}
              >
                <Services />
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
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "36px",
                  },
                }}
              >
                Provide Customer's Data <span className={css.sec_text}></span>
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                }}
              >
                <CustomerData />
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
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "36px",
                  },
                }}
              >
                Select Payment Method
              </StepLabel>
              <StepContent
                sx={{
                  pl: "35px",
                  py: "28px",
                }}
              >
                <PaymentMethod />
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
