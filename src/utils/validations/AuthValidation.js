import * as Yup from "yup";

export const signupEmailSchema = Yup.object({
  email: Yup.string()
    .max(255, "Maximun characters are 255")
    .email("Please Enter a valid email address")
    .required("Email is Required"),
  contact: Yup.string().required("Contact is Required"),
  password: Yup.string()
    .min(6)
    .max(255, "Maximun characters are 255")
    .required("Password is Required"),
  confirmPass: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Password not matched"),
});

export const verificationCodeSchema = Yup.object({
  code: Yup.number()
    .required("Verification code is Required")
    .test(
      "len",
      "Verification code must be exactly 6 characters",
      (val) => val.toString().length === 6
    ),
});

export const personalInformationSchema = Yup.object({
  name: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Buisness name is Required"),
  description: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Buisness description is Required"),
  profileImg: Yup.mixed().nullable().required("Please Select Business Profile"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .max(255, "Maximun characters are 255")
    .email("Please Enter a valid email address")
    .required("Email is Required"),
  password: Yup.string()
    .min(6)
    .max(255, "Maximun characters are 255")
    .required("Password is Required"),
});

export const businessProfileSchema = Yup.object({
  name: Yup.string()
    .max(255, "Maximun characters are 255")
    .min(3, "Minimum characters are 3")
    .required("Name is Required"),
  address: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Buisness Address is Required"),
  description: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Buisness description is Required"),
});
