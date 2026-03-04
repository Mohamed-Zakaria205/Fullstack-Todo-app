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

interface IFormInputs {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
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
          "You will navigate to login page after 4 seconds to login!",
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
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderedInputs}
        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
