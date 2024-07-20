import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <ShoppingCartIcon className="animate-spin-half text-customYellow !w-1/4 !h-1/4" />
    </div>
  );
};

export default Loader;
