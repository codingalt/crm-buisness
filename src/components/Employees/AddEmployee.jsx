import React, { useMemo } from "react";
import css from "./Employees.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Avatar,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { BiSolidPencil } from "react-icons/bi";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MdPermContactCalendar } from "react-icons/md";
import { useAddEmployeeMutation } from "../../services/api/employeesApi/employeesApi";
import { useApiErrorHandling } from "../../hooks/useApiErrors";
import ApiErrorDisplay from "../../hooks/ApiErrorDisplay";
import { addEmployeeSchema } from "../../utils/validations/EmployeesValidation";
import { toastSuccess } from "../Toast/Toast";

const AddEmployee = () => {
  const initialValues = {
    name: "",
    contact: "",
    email: "",
  };

  const [addEmployee, res] = useAddEmployeeMutation();
  const { isLoading, isSuccess, error } = res;

  useMemo(() => {
    if (isSuccess) {
      toastSuccess("Employee created successfully");
    }
  }, [isSuccess]);

  const apiErrors = useApiErrorHandling(error);

  const handleSubmit = async (values,{resetForm}) => {
    console.log(values);

    await addEmployee({
      name: values.name,
      contact: values.contact,
      email: values.email,
    });

    resetForm({
      values: initialValues,
    });
  };

   const handleChange = (e, setFieldValue) => {
     const { name, value } = e.target;
     setFieldValue(name, value);
   };

  return (
    <div className={`${css.addEmployee} max-w-screen-lg`}>
      <div className={css.heading}>
        <p>Adding a New Employee</p>
      </div>

      {/* Display Errors  */}
      <ApiErrorDisplay apiErrors={apiErrors} className="mx-auto mt-3" />

      <Formik
        initialValues={initialValues}
        validationSchema={addEmployeeSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, setFieldValue, touched, values }) => (
          <Form>
            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <label htmlFor="name">Employee Name</label>
                <div className={css.input}>
                  <Input
                    type="text"
                    isRequired
                    variant="underlined"
                    name="name"
                    id="name"
                    value={values.name}
                    placeholder="Arya Stark"
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
                <label htmlFor="contact">Employee Contact</label>
                <div className={css.input}>
                  <Input
                    type="text"
                    isRequired
                    variant="underlined"
                    name="contact"
                    id="contact"
                    value={values.contact}
                    placeholder="(239) 555-0108"
                    startContent={
                      <MdPermContactCalendar className="text-[21px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                    }
                    className={
                      errors.contact && touched.contact && "inputBottomBorder"
                    }
                    onChange={(e) => handleChange(e, setFieldValue)}
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="contact"
                  className={css.errorSpan}
                />
              </div>
            </div>

            <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-7 md:gap-16">
              <div className={css.inputContainer}>
                <label htmlFor="name">Email</label>
                <div className={css.input}>
                  <Input
                    type="email"
                    isRequired
                    variant="underlined"
                    name="email"
                    id="email"
                    value={values.email}
                    placeholder="mail@demo.com"
                    startContent={
                      <MdEmail className="text-[25px] text-[#01AB8E] mr-2 pointer-events-none flex-shrink-0" />
                    }
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
            </div>

            <div className={css.buttons}>
              <Button isLoading={isLoading} type="submit">
                Add Employee
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
