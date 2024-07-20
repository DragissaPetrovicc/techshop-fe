import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="p-2 md:p-5 lg:p-8 xl:p-10 w-full h-[85px] md:h-[120px] border-t-2 md:border-t-4 border-customYellow bg-[#161513] flex flex-col gap-2 items-center justify-center font-bold text-white">
      <span>Copyright ©2024. Made by</span>
      <span className="text-[#F2CA2C] text-2xl"> DRAGIŠA PETROVIĆ </span>
    </div>
  );
};
export default Footer;
