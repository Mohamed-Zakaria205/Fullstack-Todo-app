export interface IRegisterInput {
  name: "username" | "email" | "password";
  type: string;
  placeholder: string;
  validation: {
    required: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
}
export interface ILoginInput {
  name: "identifier" | "password";
  type: string;
  placeholder: string;
  validation: {
    required: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
}

export interface IErrorResponse {
  error: {
    message?: string;
  };
}
