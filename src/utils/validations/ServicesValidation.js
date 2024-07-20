import * as Yup from "yup";

export const addServiceSchema = Yup.object({
  name: Yup.string()
    .max(255, "Maximun characters are 255")
    .required("Service name is Required"),
  time: Yup.number().required("Time is Required"),
  price: Yup.number().required("Price is Required"),
  category: Yup.string().required("Category is Required"),
  subCategory: Yup.string().required("Sub Category is Required"),
  gender: Yup.string().required("Gender is Required"),
  image: Yup.mixed().nullable().required("Please Select Service Image"),
});
