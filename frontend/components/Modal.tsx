import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

type ModalProps = {
  open: boolean;
  title: string;
  close: () => void;
  confirmText: string;
  confirmAction: () => void;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  children: React.ReactNode;
};

const Modal = ({
  open,
  close,
  confirmAction,
  confirmText,
  confirmDisabled = false,
  confirmLoading = false,
  children,
  title,
}: ModalProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="w-full h-full absolute top-0 flex flex-row justify-center items-center z-50"
        open={open}
        onClose={close}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className={"bg-white border p-4 rounded-md"}>
            <Dialog.Title className="font-bold text-lg">{title}</Dialog.Title>
            <div className="mt-4">{children}</div>
            <div className="modal-action">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={confirmDisabled}
                className={classNames("btn", confirmLoading && "loading")}
              >
                {confirmText}
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
