import * as yup from "yup";
export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("username is required")
      .min(5, "username must be at least 5 characters long"),
    email: yup.string().email("valid email is required").required(),
    password: yup
      .string()
      .required("password is required")
      .min(6, "password must be at least 6 characters long"),
  })
  .required();

export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .required("identifier is required")
      .min(5, "identifier must be at least 5 characters long"),
    password: yup
      .string()
      .required("password is required")
      .min(6, "password must be at least 6 characters long"),
  })
  .required();
