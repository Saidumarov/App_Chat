export const CustomLabel = ({ htmlFor, className, children, ...rest }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1 block text-[15px] font-medium text-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </label>
  );
};
