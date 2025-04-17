export interface User {
  id: number;
  address: string;
  username?: string;
  profileImage?: string;
  walletAddress: string;
}

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};
