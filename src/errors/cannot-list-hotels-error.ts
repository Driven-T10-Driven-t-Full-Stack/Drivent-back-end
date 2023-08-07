import { ApplicationError } from "@/protocols";

export function cannotListHotelsError(message?: string): ApplicationError {
  const errorMsg = message || "Cannot list hotels!";
  return {
    name: "cannotListHotelsError",
    message: errorMsg,
  };
}
