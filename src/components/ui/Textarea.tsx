import { TextareaHTMLAttributes, forwardRef } from "react";

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, IProps>(({ ...rest }, ref) => {
  return (
    <textarea
      ref={ref}
      className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200 resize-y"
      rows={6}
      {...rest}
    />
  );
});

export default Textarea;
