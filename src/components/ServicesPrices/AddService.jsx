import React, { useContext, useMemo, useState } from "react";
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
import { FaCamera, FaUser } from "react-icons/fa6";
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
import { toastSuccess } from "../Toast/Toast";
import { useApiErrorHandling } from "../../hooks/useApiErrors";
import { DirectionContext } from "@/context/DirectionContext";

const genderData = [
  { id: 0, name: "General" },
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
];

const AddService = () => {
  const initialValues = {
    name: "",
    category: "",
    subCategory: "",
    tags: "",
    gender: "",
    time: "",
    price: "",
    has_parking: false,
  };

  const [isParking, setIsParking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
   const [ageGroup, setAgeGroup] = useState([0, 60]);

  const { data: categories, isLoading: isLoadingCategories } =
    useGetServiceCategoriesQuery();
  const { data: tags, isLoading: isLoadingTags } = useGetServiceTagsQuery();
  const { data: employees, isLoading: isLoadingEmployees } =
    useGetEmployeesQuery();

  // Get SubCategoriies
  const { data: subCategories, isLoading: isLoadingSubCategories } =
    useGetServiceSubCategoriesQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const [addService, res] = useAddServiceMutation();
  const { isLoading, isSuccess, error } = res;

  useMemo(() => {
    if (isSuccess) {
      toastSuccess("Service added successfully");
    }
  }, [isSuccess]);

  const apiErrors = useApiErrorHandling(error);

  const handleSubmit = async (values, { resetForm }) => {

    const {data} = await addService({
      name: values.name,
      employees: selectedEmployees,
      category_id: values.subCategory,
      tags: selectedTags,
      gender: values.gender,
      time: values.time,
      price: values.price,
      ageGroup: ageGroup,
      has_parking: values.has_parking,
    });

    resetForm({
      values: initialValues,
    });
    setSelectedEmployees([]);
    setSelectedTags([]);
    setSelectedCategory("");
    setIsParking(false);
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

  const { direction } = useContext(DirectionContext);

  return (
    <div className={`${css.addService} max-w-screen-lg`}>
      <div className={css.heading}>
        <p>Adding a new service</p>
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
                <label htmlFor="name">Service Name</label>
                <div className={css.input}>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={values.name}
                    isRequired
                    variant="underlined"
                    placeholder="Enter Queue name"
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
                <label htmlFor="employeeName">Service Giver Employees</label>
                <div className={css.input}>
                  {isLoadingEmployees ? (
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
                      placeholder="Select Employee"
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
                <label htmlFor="category">Category</label>
                <div className={css.input}>
                  {isLoadingCategories ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Select
                      isRequired
                      variant="underlined"
                      placeholder="Select Category"
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
                <label htmlFor="subCategory">Sub Category</label>
                <div className={css.input}>
                  {isLoadingSubCategories ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Select
                      isRequired
                      variant="underlined"
                      placeholder="Select Sub Category"
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
                <label htmlFor="tags">Select Tags</label>
                <div className={css.input}>
                  {isLoadingTags ? (
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
                      placeholder="Select tags"
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
                <label htmlFor="gender">Gender</label>
                <div className={css.input}>
                  <Select
                    isRequired
                    variant="underlined"
                    placeholder="Select gender"
                    name="gender"
                    id="gender"
                    selectedKeys={[values.gender]}
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
                <label htmlFor="time">Length of service</label>
                <div className={css.input}>
                  <Input
                    type="number"
                    name="time"
                    id="time"
                    isRequired
                    min={0}
                    value={values.time}
                    variant="underlined"
                    placeholder="Enter service time in minutes Eg: 30"
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
                <label htmlFor="price">Price</label>
                <div className={css.input}>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    isRequired
                    value={values.price}
                    min={0}
                    variant="underlined"
                    placeholder="Enter service price"
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
                      label="Select age group"
                      step={1}
                      maxValue={100}
                      minValue={0}
                      value={ageGroup}
                      onChange={setAgeGroup}
                      className="max-w-xxl"
                      showTooltip={true}
                      color="success"
                    />
                    <p className="text-default-500 font-medium text-small">
                      Selected age group:{" "}
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

            <div className="w-full mt-5 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <Switch
                  onValueChange={(e) => {
                    setIsParking(e);
                    setFieldValue("has_parking", e);
                  }}
                  isSelected={isParking}
                  size="sm"
                  color="success"
                  aria-label="Has Parking"
                  name="has_parking"
                  id="has_parking"
                  dir={direction}
                >
                  Has the service associated with parking?
                </Switch>
              </div>
            </div>

            <div className={css.buttons}>
              <Button isLoading={isLoading} type="submit" dir={direction}>
                Add Service
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddService;
