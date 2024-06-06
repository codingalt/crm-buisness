import React, { useEffect, useState } from "react";
import css from "./EmployeeSetPassword.module.scss";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import ImageComponent from "../ui/Image/ImagePostsComponent";
import passwordSvg from "@/assets/p1.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Input } from "@nextui-org/react";
import { setEmployeePasswordSchema } from "@/utils/validations/EmployeesValidation";
import { useLocation } from "react-router-dom";
import ClipSpinner from "../Loader/ClipSpinner";
import { useAcceptInvitationMutation, useValidateInvitationMutation } from "@/services/api/employeesApi/employeesApi";
import SuccessModal from "./SuccessModal";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import { toastError } from "../Toast/Toast";

const EmployeeSetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const [show, setShow] = useState(null);

  const initialValues = {
    password: "",
    confirmPass: "",
  };

  // Validate Invitation 
  const [validateInvitation, res] = useValidateInvitationMutation();
  const { isLoading, error, isSuccess } = res;

  // Accept Invitation 
  const [acceptInvitation, res2] = useAcceptInvitationMutation();
  const { isLoading: isLoadingAccept, error: errorAccept, isSuccess: successAccept } = res2;

  const apiErrors = useApiErrorHandling(errorAccept);

  useEffect(() => {
    if (errorAccept && errorAccept.status !== 500 && errorAccept.status != "FETCH_ERROR") {
      toastError(
        errorAccept?.data?.message
          ? errorAccept?.data?.message
          : "Uh ho! Something went wrong"
      );
    }
  }, [errorAccept]);

  const handleValidateToken = async() =>{
      await validateInvitation({
        id: id,
        invitation_token: token,
      });
  }

  useEffect(()=>{
    if(token && id){
      handleValidateToken();
    }
  },[token,id]);

  useEffect(() => {
    if (isSuccess) {
      setShow(true);
    }
  }, [isSuccess]);

  const handleSubmit = async (values, { resetForm }) => {

    await acceptInvitation({ id: id, invitation_token: token,email: email, password: values.password });

    resetForm({
      values: initialValues,
    });
  };

  const handleChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen overflow-hidden flex items-center justify-center">
        <ClipSpinner />
      </div>
    );
  }

  if (!isLoading && error) {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col gap-y-2 items-center justify-center">
        <h3 className="text-3xl font-bold text-center text-red-500">Link Expired.</h3>
        <p className="text-default-600 font-medium text-sm max-w-[95%] md:max-w-[80%] mx-auto mt-2 text-center">
          Please contact your business manager to Re invite you.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Success Modal  */}
      {successAccept && <SuccessModal />}

      {show && !isLoading && (
        <div className={css.wrapper}>
          <header className="flex justify-center items-center w-full h-12 bg-[#01ab8e] text-white text-tiny md:text-sm font-medium space-x-2">
            <span>Setup your password on our platform to continue.</span>
            <HiMiniRocketLaunch className="text-red-400 text-sm md:text-medium" />
          </header>
          <div className="w-full h-screen overflow-hidden px-7 md:px-0 mt-10 pb-6 md:pb-0 md:mt-0 flex flex-col md:flex-row max-w-screen-2xl mx-auto scrollbar-hide">
            <div className="flex-1 flex justify-center items-center scrollbar-hide">
              <Formik
                initialValues={initialValues}
                validationSchema={setEmployeePasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, setFieldValue, touched, values }) => (
                  <Form>
                    <h3 className="text-2xl text-[#01ab8e] font-bold text-center">
                      Setup your Password
                    </h3>
                    <p className="text-default-500 font-medium text-sm max-w-[95%] md:max-w-[80%] mx-auto mt-3 text-center">
                      This password will be used to login your account on our
                      platform.
                    </p>

                    <div className={css.inputContainer}>
                      <label htmlFor="password">Email</label>
                      <div className={css.input}>
                        <Input
                          type="email"
                          value={email}
                          disabled
                          readOnly
                          size="lg"
                        />
                      </div>
                    </div>

                    <div className={css.inputContainer}>
                      <label htmlFor="password">New Password</label>
                      <div className={css.input}>
                        <Input
                          type="password"
                          isRequired
                          name="password"
                          id="password"
                          size="lg"
                          placeholder="Enter your password"
                          onChange={(e) => handleChange(e, setFieldValue)}
                        />
                      </div>
                      <ErrorMessage
                        component="div"
                        name="password"
                        className={css.errorSpan}
                      />
                    </div>

                    <div className={css.inputContainer}>
                      <label htmlFor="confirmPass">Confirm Password</label>
                      <div className={css.input}>
                        <Input
                          type="password"
                          isRequired
                          name="confirmPass"
                          id="confirmPass"
                          size="lg"
                          placeholder="Confirm password"
                          onChange={(e) => handleChange(e, setFieldValue)}
                        />
                      </div>
                      <ErrorMessage
                        component="div"
                        name="confirmPass"
                        className={css.errorSpan}
                      />
                    </div>

                    <Button isLoading={isLoadingAccept} type="submit">
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="flex-1 w-full flex justify-center items-center">
              <div className="w-[80%] flex justify-center items-center">
                <img className="w-full" src={passwordSvg} alt="Password svg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeSetPassword;
