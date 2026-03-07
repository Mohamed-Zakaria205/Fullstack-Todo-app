import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { REGISTER_INPUTS } from "../data";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { registerSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosInstance } from "../config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { Link, useNavigate } from "react-router-dom";

interface IFormInputs {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(registerSchema),
  });
  // console.log(errors);
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      //**Fulfilled *//
      const response = await axiosInstance.post("/auth/local/register", data);
      // console.log(response);
      if (response.status === 200) {
        toast.success(
          "You will navigate to login page after 2 seconds to login!",
          {
            position: "bottom-center",
          },
        );

        setTimeout(() => {
          navigate("/login");
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
  const renderedInputs = REGISTER_INPUTS.map(
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
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-10 sm:mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Register to get access!</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {renderedInputs}
        <div className="pt-2">
          <Button fullWidth isLoading={isLoading}>
            Register
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
