const MainButton = ({
  isActive = false,
  children,
  onClick,
}: {
  isActive?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className={`${
        isActive
          ? "bg-black text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } px-3 py-2 rounded-[50px] font-semibold min-w-[80px] text-center transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default MainButton;
