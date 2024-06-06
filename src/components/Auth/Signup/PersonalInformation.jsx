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

const PersonalInformation = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [show, setShow] = useState(null);
  console.log(user);
  const initialValues = {
    name: "",
    description: "",
    address: "",
    profileImg: "",
  };

  useEffect(()=>{
    if (user && user.employee) {
      navigate("/login");
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
  
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("profile_pic", values.profileImg);

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
        <div className="w-full min-h-[99vh] flex justify-center items-center max-w-screen-sm mx-auto">
          <div className={`${css.wrapper} ${css.businessWrapper}`}>
            <div className={css.top}>
              <p className="text-center">Business Information</p>
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
                      Business Profile
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
                    <label htmlFor="name">Business Name</label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter business name"
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
                    <label htmlFor="description">Business Description</label>
                    <Field
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Enter short description of your business "
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
                    <label htmlFor="address">Address</label>
                    <Field
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Enter business address"
                      className={
                        errors.address && touched.address && "inputBottomBorder"
                      }
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className={css.errorSpan}
                    />
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
        </div>
      )}
    </>
  );
};

export default PersonalInformation;
