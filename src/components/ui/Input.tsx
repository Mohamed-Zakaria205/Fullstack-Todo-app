import { InputHTMLAttributes, forwardRef } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, IProps>(({ ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
      {...rest}
    />
  );
});

export default Input;
