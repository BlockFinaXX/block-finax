import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";

/**
 * Custom hook to access Web3 context
 * @returns The Web3 context values
 */
export const useWeb3 = () => {
  return useContext(Web3Context);
};
