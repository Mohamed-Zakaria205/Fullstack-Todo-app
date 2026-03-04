import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { loginSchema } from "../validation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../config";
import { IErrorResponse } from "../interfaces";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { LOGIN_INPUTS } from "../data";

const LoginPage = () => {
  interface IFormInputs {
    identifier: string;
    password: string;
  }
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      //**Fulfilled *//
      const response = await axiosInstance.post("/auth/local", data);
      // console.log(response);
      if (response.status === 200) {
        toast.success(
          "You will navigate to home page after 4 seconds to login!",
          {
            position: "bottom-center",
          },
        );
      }
    } catch (error) {
      //**Rejected *//

      const errObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renders
  const renderedInputs = LOGIN_INPUTS.map(
    ({ type, placeholder, validation, name }, idx) => (
      <div key={idx}>
        <Input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
        />
        {errors[name] && <InputErrorMessage message={errors[name]?.message} />}
      </div>
    ),
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderedInputs}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
