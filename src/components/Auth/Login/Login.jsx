import React, { useEffect, useMemo, useState } from "react";
import css from "./Login.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useApiErrorHandling } from "../../../hooks/useApiErrors";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../../utils/validations/AuthValidation";
import { Button } from "@nextui-org/react";
import {
  useLoginUserMutation,
  useValidateTokenQuery,
} from "../../../services/api/authApi/authApi";
import ApiErrorDisplay from "../../../hooks/ApiErrorDisplay";
import ClipSpinner from "@/components/Loader/ClipSpinner";

const Login = () => {
  const token = localStorage.getItem("crmBusinessToken");
  const navigate = useNavigate();
  const {
    data,
    isLoading: isLoadingValidate,
    isSuccess: isSuccessValidate,
    error: isErrorValidate,
  } = useValidateTokenQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: !token,
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!token) {
      setShow(true);
    } else {
      if (!isLoadingValidate && isSuccessValidate) {
        navigate("/dashboard");
      } else if (!isLoadingValidate && isErrorValidate) {
        setShow(true);
        localStorage.removeItem("crmBusinessToken");
      }
    }
  }, [data, isLoadingValidate, isErrorValidate, isSuccessValidate]);

  const initialValues = {
    email: "",
    password: "",
  };

  const [loginUser, res] = useLoginUserMutation();
  const { isLoading, isSuccess, error } = res;

  const apiErrors = useApiErrorHandling(error);

  const handleSubmit = async (values) => {
    const { data } = await loginUser({
      email: values.email,
      password: values.password,
    });

    if (data?.token) {
      localStorage.setItem("crmBusinessToken", data.token);

      navigate("/dashboard");
    }
  };

  if (isLoadingValidate) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "999",
          paddingBottom: "3rem",
        }}
      >
        <ClipSpinner color="#01ABAB" size={45} speedMultiplier={0.85} />
      </div>
    );
  }

  return (
    <>
      {show && (
        <div className="w-full h-[99vh] flex justify-center items-center max-w-screen-sm mx-auto">
          <div className={css.wrapper}>
            <div className={css.top}>
              <p>Sign in</p>
            </div>

            {/* Display Errors  */}
            <ApiErrorDisplay apiErrors={apiErrors} className="mx-auto mt-3" />

            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, setFieldValue, touched }) => (
                <Form className={css.loginForm}>
                  <div className={css.inputContainer}>
                    <label htmlFor="name">Email</label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email address"
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
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      className={
                        errors.password &&
                        touched.password &&
                        "inputBottomBorder"
                      }
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className={css.errorSpan}
                    />
                  </div>

                  <div className={css.button}>
                    <button
                      type="button"
                      className={`border-none ${css.backBtn}`}
                      style={{
                        width: "auto",
                        fontWeight: "500",
                        fontSize: "18px",
                      }}
                    >
                      Forgot Password?
                    </button>
                    <Button isLoading={isLoading} type="submit">
                      Enter
                    </Button>
                  </div>

                  <p className="text-sm text-center lg:text-right font-medium text-default-600 mt-14">
                    <span>Don't have an account?</span>{" "}
                    <NavLink className="text-blue-400" to={"/signup"}>
                      Register
                    </NavLink>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
