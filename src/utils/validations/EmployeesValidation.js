import * as Yup from "yup";

export const addEmployeeSchema = Yup.object({
  name: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Employee name is Required"),
  email: Yup.string()
    .max(255, "Maximun characters are 255")
    .email("Please Enter a valid email address")
    .required("Email is Required"),
  contact: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Employee Contact is Required"),
});

export const setEmployeePasswordSchema = Yup.object({
  password: Yup.string()
    .min(8)
    .max(255, "Maximun characters are 255")
    .required("Password is Required"),
  confirmPass: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Password not matched"),
});
