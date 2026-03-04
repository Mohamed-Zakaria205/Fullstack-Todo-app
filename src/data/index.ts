import { IRegisterInput } from "../interfaces";

export const REGISTER_INPUTS: IRegisterInput[] = [
  {
    name: "username",
    type: "text",
    placeholder: "Username",
    validation: {
      required: true,
      minLength: 5,
    },
  },
  {
    name: "email",

    type: "email",
    placeholder: "Email address",
    validation: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];
