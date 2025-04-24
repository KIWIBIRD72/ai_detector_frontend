import { FC } from "react";
import { Toaster } from "react-hot-toast";

export const ToasterProvider: FC = () => {
  return <Toaster containerClassName="toaster" />;
};
