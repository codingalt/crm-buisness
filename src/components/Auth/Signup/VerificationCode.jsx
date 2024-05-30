import React, { useEffect, useMemo, useState } from "react";
import css from "./Signup.module.scss";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandling } from "../../../hooks/useApiErrors";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { verificationCodeSchema } from "../../../utils/validations/AuthValidation";
import { Button } from "@nextui-org/react";
import {
  useReSendVerificationCodeMutation,
  useValidateCodeMutation,
} from "../../../services/api/authApi/authApi";
import ApiErrorDisplay from "../../../hooks/ApiErrorDisplay";
import { formatTime } from "../../../utils/helpers/helpers";
import { toastError, toastSuccess } from "../../Toast/Toast";
import { useSelector } from "react-redux";

const VerificationCode = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { user } = useSelector((store) => store.auth);
  useEffect(()=>{
    if(user){
      setShow(true)
      // if(user.phoneVerified === 0){
      //   setShow(true);
      // }
      // else if(user.phoneVerified === 1){
      //   navigate(-1);
      // }
    }
  },[user]);

  const initialValues = {
    code: "",
  };
  const [validateCodeError, setValidateCodeError] = useState(null);

  const [validateCode, res] = useValidateCodeMutation();
  const { isLoading, isSuccess, error } = res;

  useMemo(() => {
    if (error) {
      if (error.status === 422) {
        toastError("Incorrect OTP. Please try again");
      } else {
        const apiErrors = useApiErrorHandling(error);
        setValidateCodeError(apiErrors);
      }
    }
  }, [error]);

  // Resend Code Mutation
  const [resendCode, resp] = useReSendVerificationCodeMutation();
  const {
    isLoading: isLoadingResend,
    isSuccess: isSuccessResend,
    error: isErrorResend,
  } = resp;

  useMemo(() => {
    if (isSuccessResend) {
      toastSuccess("Verification code sent successfully");
    }
  }, [isSuccessResend]);

  const apiErrors2 = useApiErrorHandling(isErrorResend);

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleResendCode = async () => {
    await resendCode();
    setRemainingTime(120);
  };

  useMemo(() => {
    if (isSuccess) {
      navigate("/personalInformation");
    }
  }, [isSuccess]);

  const handleSubmit = async (values) => {
    await validateCode({ code: values.code });
  };

  return (
    <div className="w-full h-[99vh] flex justify-center items-center max-w-screen-sm mx-auto">
      {show && (
        <div className={css.wrapper}>
          <div className={css.top}>
            <p>Verification Code</p>
          </div>

          {/* Display Errors  */}
          <ApiErrorDisplay
            apiErrors={validateCodeError}
            className="mx-auto mt-3"
          />
          <ApiErrorDisplay apiErrors={apiErrors2} className="mx-auto mt-3" />

          <Formik
            initialValues={initialValues}
            validationSchema={verificationCodeSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, setFieldValue, touched }) => (
              <Form className={`${css.verificationFotm} mt-12`}>
                <div className={css.inputContainer}>
                  <Field
                    type="number"
                    name="code"
                    id="code"
                    maxLength={6}
                    placeholder="122122"
                    className={
                      errors.code && touched.code && "inputBottomBorder"
                    }
                    style={{ letterSpacing: "30px" }}
                  />
                  <ErrorMessage
                    name="code"
                    component="div"
                    className={css.errorSpan}
                  />

                  <div
                    className={`flex justify-end items-end flex-col md:flex-row md:justify-between md:items-center ${css.note}`}
                  >
                    <p className="text-sm md:text-medium">
                      The verification code is sent to the number 050-5050505
                    </p>
                    <div className="flex">
                      {remainingTime > 0 ? (
                        <span className="text-medium text-green-600 font-semibold">
                          {formatTime(remainingTime)}
                        </span>
                      ) : (
                        <Button
                          isLoading={isLoadingResend}
                          onClick={handleResendCode}
                          type="button"
                          className="bg-transparent font-semibold text-green-600"
                          disabled={isLoadingResend || remainingTime > 0}
                          style={
                            isLoadingResend || remainingTime > 0
                              ? {
                                  userSelect: "none",
                                  pointerEvents: "none",
                                  cursor: "not-allowed",
                                }
                              : {}
                          }
                        >
                          Resend Code
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={css.button}>
                  <Button isLoading={isLoading} type="submit">
                    Next
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default VerificationCode;
