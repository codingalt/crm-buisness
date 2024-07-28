import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./Profile.module.scss";
import { Button, Image, Input, Switch } from "@nextui-org/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BiSolidPencil } from "react-icons/bi";
import h1 from "../../assets/h1.jpg";
import h2 from "../../assets/h2.jpg";
import h3 from "../../assets/h3.jpg";
import h4 from "../../assets/h4.jpg";
import ImageComponent from "../ui/Image/ImagePostsComponent";
import { businessProfileSchema } from "../../utils/validations/AuthValidation";
import {
  useGetBusinessProfileQuery,
  useUpdateBusinessInfoMutation,
  useUpdateOpeningHoursMutation,
} from "../../services/api/profileApi/profileApi";
import { ClipLoader } from "react-spinners";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { toastSuccess } from "../Toast/Toast";
import { useApiErrorHandling } from "../../hooks/useApiErrors";
const { RangePicker } = TimePicker;
import { Typography } from "@mui/material";
import { IoMoonOutline } from "react-icons/io5";

export const Profile = () => {
  const [editState, setEditState] = useState(null);
  const submitButton = useRef();

  // Update Business Profile Mutation
  const [updateProfile, resp] = useUpdateBusinessInfoMutation();
  const {
    isLoading: isLoadingUpdateProfile,
    error: errorUpdateProfile,
    isSuccess: successUpdateProfile,
  } = resp;

  const [openingHours, setOpeningHours] = useState([]);
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

  useMemo(() => {
    if (isSuccess) {
      toastSuccess("Changes Saved.");
      setEditState(null);
    }
  }, [isSuccess]);

  useMemo(() => {
    if (successUpdateProfile) {
      toastSuccess("Changes Saved.");
      setEditState(null);
    }
  }, [successUpdateProfile]);

  const onChange = (time, timeString, index) => {
    const newOpeningHours = [...openingHours];

    newOpeningHours[index].open_time = time[0];
    newOpeningHours[index].close_time = time[1];

    setOpeningHours(newOpeningHours);
    setEditState("hours");
  };

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

  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
    description: "",
  });

  const { data, isLoading } = useGetBusinessProfileQuery();

  useEffect(() => {
    if (data) {
      setInitialValues((prev) => ({
        name: data.business.name,
        address: data.business.address,
        email: data.business.email,
        contact: data.business.contact,
        description: data.business.description,
      }));

      // Format Opening Hours
      const formattedOpeningHours = data?.openingHours?.map((hours) => {
        return {
          ...hours,
          open_time: dayjs(hours.open_time, "HH:mm:ss"),
          close_time: dayjs(hours.close_time, "HH:mm:ss"),
        };
      });

      setOpeningHours(formattedOpeningHours);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    console.log(values);

    await updateProfile(values);
  };

  const handleChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    setEditState("profile");
  };

  return (
    <div className={`${css.wrapper}`}>
      <div className={css.headingTop}>
        <h1>Business Details</h1>

        {(editState === "hours" || editState === "profile") && (
          <div className={css.buttons}>
            <Button
              className="px-3 md:px-6"
              type="button"
              onClick={() => setEditState(null)}
            >
              Cancel
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
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <p className={`${css.emailText} text-default-600 mt-1 text-center md:text-start`}>{data?.email}</p>

      {isLoading ? (
        <div className="h-[75%] w-full flex items-center justify-center">
          <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
        </div>
      ) : (
        <div className={css.profileWrap}>
          <div className={css.left}>
            <Formik
              enableReinitialize={true}
              validationSchema={businessProfileSchema}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({ errors, setFieldValue, touched, values }) => (
                <Form>
                  <div className="w-full mb-8 flex justify-between items-center">
                    <div className={css.inputContainer}>
                      <label htmlFor="name">Business Name</label>
                      <div className={css.input}>
                        <Input
                          type="text"
                          variant="underlined"
                          name="name"
                          id="name"
                          value={values.name}
                          placeholder="Business name"
                          className={
                            errors.name && touched.name && "inputBottomBorder"
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

                  {/* <div className="w-full mb-8 flex justify-between items-center">
                    <div className={css.inputContainer}>
                      <label htmlFor="email">Business Email</label>
                      <div className={css.input}>
                        <Input
                          type="email"
                          variant="underlined"
                          name="email"
                          id="email"
                          value={values.email}
                          placeholder="codesmanufactory@gmail.com"
                          className={
                            errors.email && touched.email && "inputBottomBorder"
                          }
                          onChange={(e) => handleChange(e, setFieldValue)}
                        />
                      </div>
                      <ErrorMessage
                        component="div"
                        name="email"
                        className={css.errorSpan}
                      />
                    </div>
                  </div> */}

                  <div className="w-full mb-8 flex justify-between items-center">
                    <div className={css.inputContainer}>
                      <label htmlFor="address">Business Address</label>
                      <div className={css.input}>
                        <Input
                          type="text"
                          variant="underlined"
                          name="address"
                          id="address"
                          value={values.address}
                          placeholder="Business address"
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
                      <label htmlFor="description">Business Description</label>
                      <div className={css.input}>
                        <Input
                          type="text"
                          variant="underlined"
                          name="description"
                          id="description"
                          value={values.description}
                          placeholder="Business description"
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
                      <label htmlFor="description">Photos</label>

                      <div className={css.images}>
                        <div className={css.img}>
                          <ImageComponent src={h1} alt="" />
                        </div>
                        <div className={css.img}>
                          <ImageComponent src={h2} alt="" />
                        </div>
                        <div className={css.img}>
                          <ImageComponent src={h3} alt="" />
                        </div>
                        <div className={css.img}>
                          <ImageComponent src={h4} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" hidden ref={submitButton}>
                    submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className={css.right}>
            <div className={css.top}>
              <p>Opening Hours</p>
              <div className="px-6 py-0.5 bg-[#01AB8E] text-white flex items-center justify-center rounded-full">
                Hours
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
                          Closed
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
      )}
    </div>
  );
};
