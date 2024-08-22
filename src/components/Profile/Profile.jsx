import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./Profile.module.scss";
import { Button, Input, Switch } from "@nextui-org/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { businessProfileSchema } from "../../utils/validations/AuthValidation";
import {
  useGetBusinessProfileQuery,
  useUpdateBusinessInfoMutation,
  useUpdateOpeningHoursMutation,
} from "../../services/api/profileApi/profileApi";
import { ClipLoader } from "react-spinners";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { toastError, toastSuccess } from "../Toast/Toast";
import { useApiErrorHandling } from "../../hooks/useApiErrors";
const { RangePicker } = TimePicker;
import { Typography } from "@mui/material";
import { IoMoonOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export const Profile = () => {
  const { t } = useTranslation();
  const [editState, setEditState] = useState(null);
  const submitButton = useRef();
  const [image, setImage] = useState(null);
  const imageRef = useRef();

  // Update Business Profile Mutation
  const [updateProfile, resp] = useUpdateBusinessInfoMutation();
  const {
    isLoading: isLoadingUpdateProfile,
    error: errorUpdateProfile,
    isSuccess: successUpdateProfile,
  } = resp;

  const [openingHours, setOpeningHours] = useState([]);
  const [initialOpeningHours, setInitialOpeningHours] = useState([]);
   const resetFormRef = useRef(null);
  const [updateOpeningHours, res] = useUpdateOpeningHoursMutation();
  const { isLoading: isLoadingUpdate, error, isSuccess } = res;

  const handleUpdateOpeningHours = async () => {
    const formattedOpeningHours = openingHours.map((hours) => {
      return {
        ...hours,
        open_time: dayjs(hours.open_time).format("HH:mm:ss"),
        close_time: dayjs(hours.close_time).format("HH:mm:ss"),
      };
    });

    await updateOpeningHours(formattedOpeningHours);
  };

  const apiErrors = useApiErrorHandling(error);
  const apiErrors2 = useApiErrorHandling(errorUpdateProfile);

  useEffect(() => {
    if (isSuccess) {
      toastSuccess(t("changesSaved"));
      setEditState(null);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (successUpdateProfile) {
      toastSuccess(t("changesSaved"));
      setEditState(null);
    }
  }, [successUpdateProfile]);

  const handleSwitchChange = (event, index) => {
    const newOpeningHours = [...openingHours];
    if (!event) {
      newOpeningHours[index].close = 1;
    } else {
      newOpeningHours[index].close = 0;
    }
    setOpeningHours(newOpeningHours);
    setEditState("hours");
  };

  const onChange = (time, timeString, index) => {
    if (time && time[0] && time[1]) {
      const newOpeningHours = [...openingHours];
      newOpeningHours[index].open_time = dayjs(time[0], "HH:mm:ss");
      newOpeningHours[index].close_time = dayjs(time[1], "HH:mm:ss");
      setOpeningHours(newOpeningHours);
      setEditState("hours");
    }
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
    description: "",
    profile_picture: "",
  });

  const {
    data,
    isLoading,
    error: errorFetchData,
    refetch,
  } = useGetBusinessProfileQuery();

  useEffect(() => {
    if (data) {
      const initialProfileValues = {
        name: data.business.name,
        address: data.business.address,
        email: data.business.email,
        contact: data.business.contact,
        description: data.business.description,
        profile_picture: data.business.profile_picture,
      };

      setInitialValues(initialProfileValues);

      // Format Opening Hours
      const formattedOpeningHours = data?.openingHours?.map((hours) => ({
        ...hours,
        open_time: dayjs(hours.open_time, "HH:mm:ss"),
        close_time: dayjs(hours.close_time, "HH:mm:ss"),
      }));

      setOpeningHours(formattedOpeningHours);
      // setInitialOpeningHours(formattedOpeningHours);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("contact", values.contact);
    formData.append("description", values.description);

    if (image) {
      formData.append("profile_picture", values.profile_picture);
    }

    await updateProfile(formData);
  };

  const handleChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    setEditState("profile");
  };

  const openImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      if (img.size <= 2 * 1024 * 1024) {
        // 2MB in bytes
        setImage({
          image: URL.createObjectURL(img),
        });
        setEditState("profile");
      } else {
        toastError(t("fileSizeLimit"));
      }
    }
  };

  const handleCancel = () => {
    if (resetFormRef.current) {
      resetFormRef.current();
    }
    setImage(null);
    setEditState(null);
    // Restore initial values
    setInitialValues(
      data
        ? {
            name: data.business.name,
            address: data.business.address,
            email: data.business.email,
            contact: data.business.contact,
            description: data.business.description,
            profile_picture: data.business.profile_picture,
          }
        : {}
    );

    // Restore opening hours without JSON serialization
    const formattedOpeningHours = data?.openingHours?.map((hours) => ({
      ...hours,
      open_time: dayjs(hours.open_time, "HH:mm:ss"),
      close_time: dayjs(hours.close_time, "HH:mm:ss"),
    }));

    setOpeningHours(formattedOpeningHours);
    // setInitialOpeningHours(formattedOpeningHours);
  };

  return (
    <div className={`${css.wrapper}`}>
      <div className={css.headingTop}>
        <h1>{t("businessDetails")}</h1>

        {(editState === "hours" || editState === "profile") && (
          <div className={css.buttons}>
            <Button
              className="px-3 md:px-6"
              type="button"
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
            <Button
              className="bg-[#01AB8E] px-3 md:px-5 text-white"
              type="button"
              isLoading={isLoadingUpdate || isLoadingUpdateProfile}
              onClick={() =>
                editState === "profile"
                  ? submitButton.current.click()
                  : handleUpdateOpeningHours()
              }
            >
              {t("saveChanges")}
            </Button>
          </div>
        )}
      </div>
      <p
        className={`${css.emailText} text-default-600 mt-1 text-center md:text-start`}
      >
        {data?.email}
      </p>

      {isLoading ? (
        <div className="pt-40 w-full flex items-center justify-center">
          <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
        </div>
      ) : (
        !errorFetchData && (
          <div className={css.profileWrap}>
            <div className={css.left}>
              <Formik
                enableReinitialize={true}
                validationSchema={businessProfileSchema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
              >
                {({ errors, setFieldValue, touched, values, setValues }) => {
                  // Function to reset form values
                  resetFormRef.current = () => setValues(initialValues);

                  return (
                    <Form>
                      <div className="w-full mb-8 flex justify-between items-center">
                        <div className={css.inputContainer}>
                          <label htmlFor="name">{t("businessName")}</label>
                          <div className={css.input}>
                            <Input
                              type="text"
                              variant="underlined"
                              name="name"
                              id="name"
                              value={values.name}
                              placeholder={t("businessName")}
                              className={
                                errors.name &&
                                touched.name &&
                                "inputBottomBorder"
                              }
                              onChange={(e) => handleChange(e, setFieldValue)}
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="name"
                            className={css.errorSpan}
                          />
                        </div>
                      </div>

                      <div className="w-full mb-8 flex justify-between items-center">
                        <div className={css.inputContainer}>
                          <label htmlFor="address">
                            {t("businessAddress")}
                          </label>
                          <div className={css.input}>
                            <Input
                              type="text"
                              variant="underlined"
                              name="address"
                              id="address"
                              value={values.address}
                              placeholder={t("businessAddress")}
                              className={
                                errors.address &&
                                touched.address &&
                                "inputBottomBorder"
                              }
                              onChange={(e) => handleChange(e, setFieldValue)}
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="address"
                            className={css.errorSpan}
                          />
                        </div>
                      </div>

                      <div className="w-full mb-8 flex justify-between items-center">
                        <div className={css.inputContainer}>
                          <label htmlFor="description">
                            {t("businessDescription")}
                          </label>
                          <div className={css.input}>
                            <Input
                              type="text"
                              variant="underlined"
                              name="description"
                              id="description"
                              value={values.description}
                              placeholder={t("businessDescription")}
                              className={
                                errors.description &&
                                touched.description &&
                                "inputBottomBorder"
                              }
                              onChange={(e) => handleChange(e, setFieldValue)}
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="description"
                            className={css.errorSpan}
                          />
                        </div>
                      </div>

                      <div className="w-full mb-8 flex justify-between items-center">
                        <div className={css.inputContainer}>
                          <label htmlFor="description">
                            {t("profilePicture")}
                          </label>

                          <div
                            className={`${css.selectImageWrap} flex items-center justify-center gap-5 sm:gap-6`}
                          >
                            <div className={`${css.img} bg-default-200`}>
                              <img
                                src={
                                  image
                                    ? image.image
                                    : import.meta.env.VITE_BUSINESS_PROFILE +
                                      values.profile_picture
                                }
                                radius={"1rem"}
                                height={"100%"}
                                className="h-full w-full object-cover"
                                alt=""
                              />
                            </div>

                            <div
                              className={`${css.chooseImage} flex flex-col justify-center lg:flex-row lg:items-center gap-3`}
                            >
                              <Button
                                className="bg-[#01ab8e] py-[22px] text-white"
                                radius="sm"
                                onClick={() => imageRef.current.click()}
                              >
                                {t("chooseImage")}
                              </Button>
                              <div className="py-5 lg:py-0 lg:flex-1 h-7 sm:h-12 border border-default-300 rounded-lg flex items-center px-4 text-sm sm:text-medium font-medium">
                                {t("noFileChosen")}
                              </div>
                              <input
                                ref={imageRef}
                                type="file"
                                onChange={(e) => {
                                  openImage(e);
                                  setFieldValue(
                                    "profile_picture",
                                    e.target.files && e.target.files[0]
                                  );
                                }}
                                style={{ display: "none" }}
                                accept="image/*"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button type="submit" hidden ref={submitButton}>
                        {t("submit")}
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>

            <div className={css.right}>
              <div className={css.top}>
                <p>{t("openingHours")}</p>
                <div className="px-6 py-0.5 bg-[#01AB8E] text-white flex items-center justify-center rounded-full">
                  {t("hours")}
                </div>
              </div>

              <div className={css.information}>
                {openingHours?.map((item, index) => (
                  <div className={css.item} key={index}>
                    <div className="flex-1 flex items-center gap-1">
                      <Switch
                        onValueChange={(e) => {
                          handleSwitchChange(e, index);
                        }}
                        isSelected={item.close === 0}
                        size="sm"
                        color="primary"
                        aria-label="Switch"
                      />
                      <p>{item.day_of_week}</p>
                    </div>
                    <div className="w-full md:w-[55%] 2xl:w-[43%]">
                      {item.close === 1 ? (
                        <div className="flex items-center justify-between w-full px-3 bg-green-50 h-10 rounded-md">
                          <IoMoonOutline />
                          <Typography
                            sx={{
                              color: "#212121",
                              fontSize: ".96rem",
                              fontWeight: "500",
                            }}
                            noWrap
                            component="div"
                          >
                            {t("closed")}
                          </Typography>
                        </div>
                      ) : (
                        <RangePicker
                          use12Hours
                          format="h:mm A"
                          value={[item.open_time, item.close_time]}
                          onChange={(dates, datesStrings) =>
                            onChange(dates, datesStrings, index)
                          }
                          size="large"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {/* Show Error If data fails to load  */}
      {!isLoading && errorFetchData && (
        <div className="px-4 pt-32 mx-auto w-full flex flex-col gap-2 items-center">
          <p className="font-medium text-[17px] text-[#01ab8e]">
            {t("letsTryAgain")}
          </p>
          <span className="px-6 text-xs text-default-600 text-center max-w-xs">
            {t("fetchError")}
          </span>
          <Button
            size="sm"
            radius="sm"
            className="mt-2 py-1 px-6 text-white bg-[#01ab8e]"
            onClick={refetch}
          >
            {t("tryAgain")}
          </Button>
        </div>
      )}
    </div>
  );
};
