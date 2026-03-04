import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { REGISTER_INPUTS } from "../data";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { registerSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInputs {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(registerSchema),
  });
  console.log(errors);
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    console.log(data);
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
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
