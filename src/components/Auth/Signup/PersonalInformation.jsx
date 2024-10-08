import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./Signup.module.scss";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandling } from "../../../hooks/useApiErrors";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { personalInformationSchema } from "../../../utils/validations/AuthValidation";
import { Button } from "@nextui-org/react";
import { useStoreBusinessInformationMutation } from "../../../services/api/authApi/authApi";
import ApiErrorDisplay from "../../../hooks/ApiErrorDisplay";
import { AiOutlineCamera } from "react-icons/ai";
import avatar from "../../../assets/loadingProfile.png"
import { useSelector } from "react-redux";
import BusinessLocation from "./BusinessLocation";
import { useTranslation } from "react-i18next";

const PersonalInformation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [show, setShow] = useState(null);
  const [isAddressError, setIsAddressError] = useState(false);
  
  const initialValues = {
    name: "",
    description: "",
    address: "",
    latLng: "",
    country: "",
    city: "",
    profileImg: "",
  };

  console.log(user);
  

  useEffect(()=>{
    if (user && user.employee) {
      navigate("/login");
    }else if (user && user.profile_setup) {
        navigate("/dashboard");
    }else{
      setShow(true);
    }
  },[user]);

  const [storeBusinessInformation, res] = useStoreBusinessInformationMutation();
  const {isLoading, isSuccess, error} = res;

  useMemo(()=>{
    if(isSuccess){
      navigate("/dashboard");
    }
  },[isSuccess]);

  const apiErrors = useApiErrorHandling(error);

  const handleSubmit = async (values) => {
    
    if(!values.address){
      setIsAddressError(true);
      return;
    }

    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("latLng", values.latLng);
    formData.append("city", values.city);
    formData.append("country", values.country);
    formData.append("profile_picture", values.profileImg);

    await storeBusinessInformation(formData);
  };

  const openImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage({
        image: URL.createObjectURL(img),
      });
    }
  };

  return (
    <>
      {show && (
        <div className="w-full pb-28 pt-4 min-h-[99vh] flex justify-center items-center max-w-screen-sm mx-auto">
          <div className={`${css.wrapper} ${css.businessWrapper}`}>
            <div className={css.top}>
              <p className="text-center">{t("businessInformation")}</p>
            </div>

            {/* Display Errors  */}
            <ApiErrorDisplay
              apiErrors={apiErrors}
              className="mx-auto mt-3 -mb-6"
            />

            <Formik
              initialValues={initialValues}
              validationSchema={personalInformationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, setFieldValue, touched }) => (
                <Form className={`${css.personalInfoForm} mt-14`}>
                  <div className={css.inputContainer}>
                    <label className="text-center mb-3" htmlFor="name">
                      {t("businessProfile")}
                    </label>
                    <div className={css.userProfile}>
                      <div
                        className={css.profile}
                        onClick={() => imageRef.current.click()}
                      >
                        <input
                          ref={imageRef}
                          type="file"
                          onChange={(e) => {
                            setFieldValue("profileImg", e.target.files[0]);
                            openImage(e);
                          }}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                        <img src={image ? image.image : avatar} alt="" />
                      </div>
                      <div className={css.icon}>
                        <AiOutlineCamera />
                      </div>
                    </div>
                  </div>
                  <ErrorMessage
                    name="profileImg"
                    component="div"
                    className={`${css.errorSpan} text-center mb-1`}
                    style={{ marginTop: "-25px" }}
                  />

                  <div className={css.inputContainer}>
                    <label htmlFor="name">{t("businessName")}</label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder={t("enterBusinessName")}
                      className={
                        errors.name && touched.name && "inputBottomBorder"
                      }
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className={css.errorSpan}
                    />
                  </div>

                  <div className={css.inputContainer}>
                    <label htmlFor="description">
                      {t("businessDescription")}
                    </label>
                    <Field
                      type="text"
                      name="description"
                      id="description"
                      placeholder={t("enterBusinessDescription")}
                      className={
                        errors.description &&
                        touched.description &&
                        "inputBottomBorder"
                      }
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className={css.errorSpan}
                    />
                  </div>

                  <div className={css.inputContainer}>
                    <label htmlFor="address">{t("address")}</label>
                    <BusinessLocation
                      errors={errors}
                      touched={touched}
                      setIsAddressError={setIsAddressError}
                      setFieldValue={setFieldValue}
                    />
                    {isAddressError && (
                      <div className={css.errorSpan}>
                        Business address is Required.
                      </div>
                    )}
                  </div>

                  <div className={css.button}>
                    <Button isLoading={isLoading} type="submit">
                      {t("next")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInformation;
