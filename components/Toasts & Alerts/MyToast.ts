import { toast } from "react-hot-toast";
import { knownErrors } from "@/lib/dictionaries/knownErrors";
export const myToast = {
  success: (text: string) => toast.success(text),
  error: (text?: string) =>
    toast.error(text ?? "Hubo un error favor intente nuevamente"),
  loading: () => toast.loading("Waiting..."),
  promise: async (text: string, promise: Promise<unknown>) =>
    toast.promise(
      promise,
      {
        loading: "Loading",
        success: "Got the data",
        error: "Error when fetching",
      },
      {
        success: {
          duration: 3000,
          icon: "🔥",
        },
      }
    ),
};

export const handleUseMutationAlerts = ({
  successText,
  callback,
}: {
  successText: string;
  callback?: (x: any, y: any, z: any) => void;
}) => {
  const loadToast = () => toast.loading("Un momento porfavor...");
  return {
    onError: (error: { message: string }) => {
      toast.dismiss();
      myToast.error(knownErrors(error.message));
    },
    //data is the return from the event
    onSuccess: (data: any, variables: any, context: any) => {
      toast.dismiss();
      myToast.success(successText);
      callback && callback(data, variables, context);
    },
    onMutate: () => loadToast(),
  };
};
