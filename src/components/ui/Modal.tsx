import {
  Description as DialogDescription,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { type ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  close: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}
const Modal = ({ isOpen, close, title, description, children }: IProps) => {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
        __demoMode
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogBackdrop className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
            <DialogPanel
              transition
              className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 z-50"
            >
              {title && (
                <DialogTitle
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 mb-2"
                >
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription
                  as="p"
                  className="text-base text-gray-500 mb-4"
                >
                  {description}
                </DialogDescription>
              )}

              <div className="mt-6">{children}</div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
