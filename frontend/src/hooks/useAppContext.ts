import { useContext } from "react";
import { AppContext } from "../context/AppContext";

/**
 * Custom hook to access App context
 * @returns The App context values
 */
export const useAppContext = () => {
  return useContext(AppContext);
};
