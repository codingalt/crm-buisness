import * as Yup from "yup";

export const manualAppointmentSchema = Yup.object({
  name: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Name is Required"),
  email: Yup.string()
    .max(255, "Maximun characters are 255")
    .email("Please Enter a valid email address")
    .required("Email is Required"),
  contact: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Contact is Required"),
});

export const manualAppointmentSchema2 = Yup.object({  email: Yup.string()
    .max(255, "Maximun characters are 255")
    .email("Please Enter a valid email address")
    .required("Email is Required"),
});
