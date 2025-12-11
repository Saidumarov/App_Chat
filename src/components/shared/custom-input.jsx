import React from "react";

export const CustomInput = ({
  id,
  type = "text",
  autoComplete,
  placeholder,
  className,
  errors,
  disabled,
  ...reset
}) => {
  return (
    <>
      <input
        id={id || ""}
        type={type || "text"}
        autoComplete={autoComplete || ""}
        disabled={disabled}
        placeholder={placeholder || ""}
        className={`w-full rounded-xl shadow-none bg-white border px-4 py-2.5 transition focus:outline-none focus-visible:ring-2  disabled:opacity-50 disabled:cursor-not-allowed ${
          errors
            ? "border-red-300 !bg-red-50 focus-visible:ring-red-400"
            : "border-gray-300 focus-visible:ring-sky-400"
        } ${className}`}
        {...reset}
      />
    </>
  );
};

export const CustomInput2 = ({
  id,
  type = "text",
  autoComplete,
  placeholder,
  className = "",
  errors,
  disabled,
  inputRef,
  register = {},
  ...rest
}) => {
  return (
    <input
      id={id || ""}
      type={type}
      autoComplete={autoComplete || ""}
      disabled={disabled}
      placeholder={placeholder || ""}
      className={`
                w-full rounded-xl shadow-none bg-white border px-4 py-2.5 transition
                focus:outline-none focus-visible:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  errors
                    ? "border-red-300 !bg-red-50 focus-visible:ring-red-400"
                    : "border-gray-300 focus-visible:ring-sky-400"
                }
                ${className}
            `}
      {...register}
      {...rest}
      ref={(el) => {
        // react-hook-form support
        if (register && typeof register.ref === "function") {
          register.ref(el);
        }
        // outside custom ref
        if (inputRef) inputRef.current = el;
      }}
    />
  );
};

export const CustomTextarea = ({
  id,
  placeholder,
  className,
  errors,
  disabled,
  rows = 4,
  ...props
}) => (
  <textarea
    id={id}
    disabled={disabled}
    placeholder={placeholder}
    rows={rows}
    className={`w-full rounded-xl bg-white border px-4 py-2.5  transition focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
      errors
        ? "border-red-300 !bg-red-50 focus-visible:ring-red-400"
        : "border-gray-300 focus-visible:ring-sky-400"
    } ${className || ""}`}
    {...props}
  />
);
