export const Button = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 text-2xl bg-[#81b64c] text-white font-bold rounded ${className}`}
    >
      {children}
    </button>
  );
};
