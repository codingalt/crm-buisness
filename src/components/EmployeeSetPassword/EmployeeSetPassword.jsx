import React, { useEffect, useState } from "react";
import css from "./EmployeeSetPassword.module.scss";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import passwordSvg from "@/assets/p1.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Input, Snippet } from "@nextui-org/react";
import { setEmployeePasswordSchema } from "@/utils/validations/EmployeesValidation";
import { useLocation } from "react-router-dom";
import ClipSpinner from "../Loader/ClipSpinner";
import {
  useAcceptInvitationMutation,
  useValidateInvitationMutation,
} from "@/services/api/employeesApi/employeesApi";
import SuccessModal from "./SuccessModal";
import { useApiErrorHandling } from "@/hooks/useApiErrors";
import { toastError } from "../Toast/Toast";
import { useTranslation } from "react-i18next";

const EmployeeSetPassword = () => {
  const { t } = useTranslation();
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
  const {
    isLoading: isLoadingAccept,
    error: errorAccept,
    isSuccess: successAccept,
  } = res2;

  const apiErrors = useApiErrorHandling(errorAccept);

  useEffect(() => {
    if (
      errorAccept &&
      errorAccept.status !== 500 &&
      errorAccept.status != "FETCH_ERROR"
    ) {
      toastError(
        errorAccept?.data?.message
          ? errorAccept?.data?.message
          : "Uh ho! Something went wrong"
      );
    }
  }, [errorAccept]);

  const handleValidateToken = async () => {
    await validateInvitation({
      id: id,
      invitation_token: token,
    });
  };

  useEffect(() => {
    if (token && id) {
      handleValidateToken();
    }
  }, [token, id]);

  useEffect(() => {
    if (isSuccess) {
      setShow(true);
    }
  }, [isSuccess]);

  const handleSubmit = async (values, { resetForm }) => {
    await acceptInvitation({
      id: id,
      invitation_token: token,
      email: email,
      password: values.password,
    });

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
        <Snippet hideCopyButton color="danger" className="px-6 py-3 font-medium" radius="sm" hideSymbol>
          {t("linkExpired")}
        </Snippet>
        <p className="text-default-600 font-medium text-sm max-w-[80%] md:max-w-[80%] mx-auto mt-2 text-center">
          {t("contactBusinessManager")}
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
            <span>{t("setupPassword")}</span>
            <HiMiniRocketLaunch className="text-red-400 text-sm md:text-medium" />
          </header>
          <div className="w-full min-h-[calc(100vh-48px)] overflow-hidden px-7 md:px-10 xl:px-0 mt-10 pb-10 md:pb-0 md:mt-0 flex flex-col gap-8 md:gap-0 md:flex-row max-w-screen-2xl mx-auto scrollbar-hide">
            <div className="flex-1 shrink flex justify-center items-center scrollbar-hide">
              <Formik
                initialValues={initialValues}
                validationSchema={setEmployeePasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, setFieldValue, touched, values }) => (
                  <Form>
                    <h3 className="text-xl md:text-2xl text-[#01ab8e] font-bold text-center">
                      {t("setupYourPassword")}
                    </h3>
                    <p className="text-default-500 font-medium text-xs md:mb-10 md:text-sm max-w-[95%] md:max-w-[80%] mx-auto mt-3 text-center">
                      {t("passwordDescription")}
                    </p>

                    <div className={css.inputContainer}>
                      <label htmlFor="email">{t("email")}</label>
                      <div className={css.input}>
                        <Input
                          type="email"
                          value={email}
                          disabled
                          readOnly
                          size="lg"
                          radius="sm"
                          className="mb-0"
                        />
                      </div>
                    </div>

                    <div className={css.inputContainer}>
                      <label htmlFor="password">{t("newPassword")}</label>
                      <div className={css.input}>
                        <Input
                          type="password"
                          isRequired
                          name="password"
                          id="password"
                          size="lg"
                          radius="sm"
                          placeholder={t("enterPassword")}
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
                      <label htmlFor="confirmPass">
                        {t("confirmPassword")}
                      </label>
                      <div className={css.input}>
                        <Input
                          type="password"
                          isRequired
                          name="confirmPass"
                          id="confirmPass"
                          size="lg"
                          radius="sm"
                          placeholder={t("confirmPassword")}
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
                      {t("submit")}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="flex-1 shrink-0 w-full flex justify-center items-center">
              <div className="w-[80%] max-w-xl flex justify-center items-center">
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
