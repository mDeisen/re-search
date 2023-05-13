import React, { useState } from "react";
import Modal from "./Modal";
import { useCreateProfile } from "@lens-protocol/react-web";
import { toast } from "react-hot-toast";

type CreateProfileFormProps = {
  open: boolean;
  onClose: () => void;
};

const CreateProfileForm = ({ open, onClose }: CreateProfileFormProps) => {
  const toastId = "create-profile";
  const [handle, setHandle] = useState("");

  const { execute: create, error, isPending } = useCreateProfile();

  const handleCreate = async () => {
    try {
      toast.loading("Creating profile...", { id: toastId });
      if (handle) {
        await create({
          handle,
        });
      }
      toast.success("Profile created!", { id: toastId });
      onClose();
    } catch (error) {
      toast.error("Error creating profile", { id: toastId });
    }
  };

  return (
    <Modal
      open={open}
      close={onClose}
      title="Create Lens Profile"
      confirmText="Create"
      confirmAction={() => {
        handleCreate();
      }}
      confirmLoading={isPending}
    >
      <div className="flex flex-col gap-3 w-[440px]">
        <label>Handle</label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="Handle"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
          }}
        />
      </div>
    </Modal>
  );
};

export default CreateProfileForm;
