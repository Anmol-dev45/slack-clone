import { atom, useAtom } from "jotai";

const modelAtom = atom(false);

export const useCreateWorkspaceModel = () => {
  return useAtom(modelAtom);
};
