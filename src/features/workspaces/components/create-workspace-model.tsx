import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModel } from "../store/use-create-workspace-model";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateWorkspaceModel = () => {
  const [open, setOpen] = useCreateWorkspaceModel();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutate(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace created");
          router.push(`/workspace/${id}`);
          handleClose();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <Input
            value={name}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="workspace name e.g. 'Work', 'Personal', 'Home'"
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex justify-end">
            <Button disabled={false} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModel;
