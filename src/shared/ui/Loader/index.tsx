import { FC } from "react";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

export const Loader: FC = () => {
  return <LineSpinner size="40" stroke="3" speed="1" color="blue" />;
};
