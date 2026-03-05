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
            <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6  duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0  z-50"
            >
              {title && (
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-black mb-3"
                >
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription as="p" className="text-md text-gray-600">
                  {description}
                </DialogDescription>
              )}

              <div className="mt-4">{children}</div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
