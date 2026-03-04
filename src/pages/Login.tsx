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
import { Link } from "react-router-dom";

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
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data,
      );
      console.log(resData);
      if (status === 200) {
        toast.success(
          "You will navigate to home page after 2 seconds to login!",
          {
            position: "bottom-center",
          },
        );
        localStorage.setItem("loggedInUser", JSON.stringify(resData));
        setTimeout(() => {
          location.replace("/");
        }, 2000);
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
      <p className="mt-4 text-center">
        <span>You don't have an account? </span>
        <Link to="/register" className="text-indigo-600">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
