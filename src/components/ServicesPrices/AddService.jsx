import React, { useContext, useMemo, useRef, useState } from "react";
import css from "./Services.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Avatar,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Slider,
  Switch,
} from "@nextui-org/react";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import { RiUser3Fill } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { IoWallet } from "react-icons/io5";
import { addServiceSchema } from "../../utils/validations/ServicesValidation";
import {
  useAddServiceMutation,
  useGetEmployeesQuery,
  useGetServiceCategoriesQuery,
  useGetServiceSubCategoriesQuery,
  useGetServiceTagsQuery,
} from "../../services/api/servicesApi/servicesApi";
import ApiErrorDisplay from "../../hooks/ApiErrorDisplay";
import { toastError, toastSuccess } from "../Toast/Toast";
import { useApiErrorHandling } from "../../hooks/useApiErrors";
import { DirectionContext } from "@/context/DirectionContext";
import { FiUploadCloud } from "react-icons/fi";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

const genderData = [
  { id: 0, name: "General" },
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
];

const AddService = () => {
  const {t} = useTranslation();

  const initialValues = {
    name: "",
    category: "",
    subCategory: "",
    tags: "",
    gender: "",
    time: "",
    price: "",
    image: "",
    has_parking: false,
  };

  const [isParking, setIsParking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [ageGroup, setAgeGroup] = useState([0, 60]);
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategorries,
  } = useGetServiceCategoriesQuery();
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: errorTags,
  } = useGetServiceTagsQuery();
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: errorEmployees,
  } = useGetEmployeesQuery();

  // Get SubCategoriies
  const {
    data: subCategories,
    isLoading: isLoadingSubCategories,
    error: errorSubCategories,
  } = useGetServiceSubCategoriesQuery(selectedCategory, {
    skip: !selectedCategory,
  });

  const [addService, res] = useAddServiceMutation();
  const { isLoading, isSuccess, error } = res;

  useMemo(() => {
    if (isSuccess) {
      toastSuccess(t("serviceAddedSuccessfully"));
    }
  }, [isSuccess]);

  const apiErrors = useApiErrorHandling(error);

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    const [start_age, end_age] = ageGroup;

    let isParking;
    if(values.has_parking){
      isParking = 1;
    }else{
      isParking = 0;
    }

    formData.append("name", values.name);
    formData.append("category_id", values.subCategory);
    formData.append("gender", values.gender);
    formData.append("time", values.time);
    formData.append("price", values.price);
    formData.append("start_age", start_age);
    formData.append("end_age", end_age);
    formData.append("has_parking", isParking);
    formData.append("image", values.image);

    selectedEmployees?.map((item) => {
      formData.append("employees[]", item);
    });

    selectedTags?.map((item) => {
      formData.append("tags[]", item);
    });

    const { data } = await addService(formData);

    resetForm({
      values: initialValues,
    });

    setSelectedEmployees([]);
    setSelectedTags([]);
    setSelectedCategory("");
    setIsParking(false);
    setImage(null);
  };

  const handleChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  const handleEmployeesChange = (e, setFieldValue) => {
    const selectedValues = e.target.value
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value !== "");

    setSelectedEmployees(selectedValues);
  };

  const handleTagsChange = (e, setFieldValue) => {
    const selectedValues = e.target.value
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value !== "");

    setSelectedTags(selectedValues);
  };

  const openImage = (e, setFieldValue) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      if (img.size > 2 * 1024 * 1024) {
        // 2MB in bytes
        toastError(t("fileSizeExceeds"));
        return;
      }
      setImage({
        image: URL.createObjectURL(img),
      });
      setFieldValue("image", img);
    }
  };

  const { direction } = useContext(DirectionContext);

  return (
    <div className={`${css.addService} max-w-screen-lg`}>
      <div className={css.heading}>
        <p>{t("addingNewService")}</p>
      </div>

      {/* Display Errors  */}
      <ApiErrorDisplay apiErrors={apiErrors} className="mx-auto mt-3" />

      <Formik
        initialValues={initialValues}
        validationSchema={addServiceSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, setFieldValue, touched, values }) => (
          <Form>
            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <label htmlFor="name">{t("serviceName")}</label>
                <div className={css.input}>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={values.name || ""}
                    isRequired
                    variant="underlined"
                    placeholder={t("enterServiceName")}
                    dir={direction}
                    startContent={
                      <BiSolidPencil className="text-[25px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                    }
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

              <div className={css.inputContainer}>
                <label htmlFor="employeeName">
                  {t("serviceGiverEmployees")}
                </label>
                <div className={css.input}>
                  {isLoadingEmployees || errorEmployees ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Select
                      items={employees?.employees}
                      isRequired
                      variant="underlined"
                      isMultiline={true}
                      selectionMode="multiple"
                      name="employeeName"
                      id="employeeName"
                      placeholder={t("selectEmployees")}
                      dir={direction}
                      labelPlacement="outside"
                      selectedKeys={selectedEmployees}
                      classNames={{
                        base: "max-w-xxl",
                        trigger: "min-h-unit-12 py-2",
                      }}
                      renderValue={(items) => {
                        return (
                          <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                              <Chip
                                className="py-2"
                                style={{
                                  background: "#13D3B3",
                                  color: "#fff",
                                  marginBottom: "10px",
                                }}
                                key={item.key}
                                dir={direction}
                              >
                                {item.data.user.name}
                              </Chip>
                            ))}
                          </div>
                        );
                      }}
                      aria-label="Employees"
                      onChange={(e) => handleEmployeesChange(e, setFieldValue)}
                    >
                      {(item) => (
                        <SelectItem
                          className="bg-white"
                          key={item.id}
                          textValue={item.user.name}
                          value={item.id}
                          dir={direction}
                        >
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <span className="text-small">
                                {item?.user.name}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="employeeName"
                  className={css.errorSpan}
                />
              </div>
            </div>

            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <label htmlFor="category">{t("category")}</label>
                <div className={css.input}>
                  {isLoadingCategories || errorCategorries ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Select
                      isRequired
                      variant="underlined"
                      placeholder={t("selectCategory")}
                      name="category"
                      id="category"
                      selectedKeys={[selectedCategory]}
                      dir={direction}
                      classNames={{
                        base: "max-w-xxl",
                        trigger: "min-h-unit-12 py-2",
                      }}
                      startContent={
                        <BiSolidCategory className="text-[21px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                      }
                      aria-label="category"
                      onChange={(e) => {
                        handleChange(e, setFieldValue);
                        setSelectedCategory(e.target.value);
                      }}
                    >
                      {categories?.categories?.map((item) => (
                        <SelectItem
                          className="bg-white"
                          key={item.id}
                          value={item.id}
                          dir={direction}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="category"
                  className={css.errorSpan}
                />
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="subCategory">{t("subCategory")}</label>
                <div className={css.input}>
                  {isLoadingSubCategories || errorSubCategories ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Select
                      isRequired
                      variant="underlined"
                      placeholder={t("selectSubCategory")}
                      name="subCategory"
                      id="subCategory"
                      selectedKeys={[values.subCategory]}
                      dir={direction}
                      classNames={{
                        base: "max-w-xxl",
                        trigger: "min-h-unit-12 py-2",
                      }}
                      startContent={
                        <MdCategory className="text-[21px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                      }
                      aria-label="subCategory"
                      onChange={(e) => handleChange(e, setFieldValue)}
                    >
                      {subCategories?.category?.sub_categories.map((item) => (
                        <SelectItem
                          dir={direction}
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="subCategory"
                  className={css.errorSpan}
                />
              </div>
            </div>

            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <label htmlFor="tags">{t("selectTags")}</label>
                <div className={css.input}>
                  {isLoadingTags || errorTags ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Select
                      items={tags?.tags}
                      isRequired
                      variant="underlined"
                      isMultiline={true}
                      selectionMode="multiple"
                      name="tags"
                      id="tags"
                      placeholder={t("selectTags")}
                      labelPlacement="outside"
                      selectedKeys={selectedTags}
                      dir={direction}
                      classNames={{
                        base: "max-w-xxl",
                        trigger: "min-h-unit-12 py-2",
                      }}
                      renderValue={(items) => {
                        return (
                          <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                              <Chip
                                className="py-2"
                                style={{
                                  background: "#13D3B3",
                                  color: "#fff",
                                  marginBottom: "10px",
                                }}
                                key={item.key}
                                dir={direction}
                              >
                                {item.data.name}
                              </Chip>
                            ))}
                          </div>
                        );
                      }}
                      aria-label="tags"
                      onChange={(e) => handleTagsChange(e, setFieldValue)}
                    >
                      {(tag) => (
                        <SelectItem
                          className="bg-white"
                          key={tag.id}
                          textValue={tag.name}
                          value={tag.id}
                          dir={direction}
                        >
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <span className="text-small">{tag?.name}</span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="tags"
                  className={css.errorSpan}
                />
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="gender">{t("gender")}</label>
                <div className={css.input}>
                  <Select
                    isRequired
                    variant="underlined"
                    placeholder="Select gender"
                    name="gender"
                    id="gender"
                    selectedKeys={values.gender ? [values.gender] : []}
                    startContent={
                      <RiUser3Fill className="text-[21px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                    }
                    classNames={{
                      base: "max-w-xxl",
                      trigger: "min-h-unit-12 py-2",
                    }}
                    aria-label="gender"
                    dir={direction}
                    onChange={(e) => handleChange(e, setFieldValue)}
                  >
                    {genderData?.map((item) => (
                      <SelectItem
                        dir={direction}
                        key={item.name}
                        value={item.name}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <ErrorMessage
                  component="div"
                  name="gender"
                  className={css.errorSpan}
                />
              </div>
            </div>

            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <label htmlFor="time">{t("lengthOfService")}</label>
                <div className={css.input}>
                  <Input
                    type="number"
                    name="time"
                    id="time"
                    isRequired
                    min={0}
                    value={values.time || ""}
                    variant="underlined"
                    placeholder={t("enterServiceTime")}
                    dir={direction}
                    startContent={
                      <MdOutlineAccessTimeFilled className="text-[21px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                    }
                    className={
                      errors.time && touched.time && "inputBottomBorder"
                    }
                    onChange={(e) => handleChange(e, setFieldValue)}
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="time"
                  className={css.errorSpan}
                />
              </div>

              <div className={css.inputContainer}>
                <label htmlFor="price">{t("price")}</label>
                <div className={css.input}>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    isRequired
                    value={values.price || ""}
                    min={0}
                    variant="underlined"
                    placeholder={t("enterServicePrice")}
                    dir={direction}
                    startContent={
                      <IoWallet className="text-[21px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                    }
                    className={
                      errors.price && touched.price && "inputBottomBorder"
                    }
                    onChange={(e) => handleChange(e, setFieldValue)}
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="price"
                  className={css.errorSpan}
                />
              </div>
            </div>

            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <div className={css.input}>
                  <div className="flex flex-col gap-2 w-full h-full max-w-xxl items-start justify-center">
                    <Slider
                      label={t("selectAgeGroup")}
                      step={1}
                      maxValue={100}
                      minValue={0}
                      value={ageGroup}
                      onChange={setAgeGroup}
                      className="max-w-xxl"
                      showTooltip={true}
                      color="primary"
                      size="sm"
                    />
                    <p className="text-default-500 font-medium text-small">
                      {t("selectedAgeGroup")}:{" "}
                      {Array.isArray(ageGroup) &&
                        ageGroup.map((b) => `${b}`).join(" – ")}
                    </p>
                  </div>

                  <ErrorMessage
                    name="ageGroup"
                    component="div"
                    className={css.errorSpan}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <div className={css.input}>
                  <div className={css.profilePic}>
                    <div className={css.detail}>
                      <div className={css.left}>
                        <h4>{t("chooseImage")}</h4>
                        <span>{t("selectServiceImage")}</span>
                      </div>
                      <div className={css.right}>
                        <div className={css.profilePreview}>
                          {image ? (
                            <img src={image.image} />
                          ) : (
                            <p className="block">{t("imagePreview")}</p>
                          )}
                        </div>
                        <div
                          className={css.upload}
                          onClick={() => imageRef.current.click()}
                        >
                          <input
                            ref={imageRef}
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={(event) =>
                              openImage(event, setFieldValue)
                            }
                            style={{ display: "none" }}
                          />
                          <div className={css.icon}>
                            <FiUploadCloud />
                          </div>
                          <p>
                            <span>{t("clickToUpload")}</span>
                            <span>SVG, PNG, JPG (recommended. 300x250px)</span>
                            <ErrorMessage
                              name="image"
                              component="div"
                              className={css.errorSpan}
                              style={{ marginTop: "0px", fontWeight: "normal" }}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mt-5 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <Switch
                  onValueChange={(e) => {
                    setIsParking(e);
                    setFieldValue("has_parking", e);
                  }}
                  isSelected={isParking}
                  size="sm"
                  color="primary"
                  aria-label="Has Parking"
                  name="has_parking"
                  id="has_parking"
                  dir={direction}
                >
                  {t("parkingAssociation")}
                </Switch>
              </div>
            </div>

            <div className={css.buttons}>
              <Button isLoading={isLoading} type="submit" dir={direction}>
                {t("addService")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddService;
