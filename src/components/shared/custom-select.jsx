import React, { useState, useRef, useEffect } from "react";

/* ===========================
   MAIN SELECT CONTAINER
=========================== */
export const Select = ({ children, value, onValueChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Tashqi clicklarni tutish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {React.Children.map(children, (child) => {
        if (!child || !child.type) return child;

        const name = child.type.displayName;

        if (name === "SelectTrigger") {
          return React.cloneElement(child, {
            onClick: () => !disabled && setIsOpen(!isOpen),
            disabled,
            isOpen,
          });
        }

        if (name === "SelectContent") {
          return (
            isOpen &&
            React.cloneElement(child, {
              onSelect: (v) => {
                onValueChange(v);
                setIsOpen(false);
              },
              onClose: () => setIsOpen(false),
              value,
            })
          );
        }

        return child;
      })}
    </div>
  );
};
Select.displayName = "Select";

/* ===========================
   TRIGGER
=========================== */
export const SelectTrigger = ({
  children,
  onClick,
  isOpen,
  disabled,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full rounded-xl shadow-none bg-white border border-gray-300 text-[1rem] h-[44px] px-4 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed ${
      className || ""
    }`}
  >
    {children}
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
);
SelectTrigger.displayName = "SelectTrigger";

/* ===========================
   SELECT VALUE
=========================== */
export const SelectValue = ({ placeholder, children }) => (
  <span className="text-left truncate">{children || placeholder}</span>
);
SelectValue.displayName = "SelectValue";

/* ===========================
   CONTENT (dropdown)
=========================== */
export const SelectContent = ({ children, onSelect, onClose, value }) => (
  <>
    <div className="fixed inset-0 z-40" onClick={onClose} />
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
      {React.Children.map(children, (child) => {
        if (!child || !child.type) return child;

        if (child.type.displayName === "SelectGroup") {
          return React.cloneElement(child, { onSelect, value });
        }

        return child;
      })}
    </div>
  </>
);
SelectContent.displayName = "SelectContent";

/* ===========================
   GROUP
=========================== */
export const SelectGroup = ({ children, onSelect, value }) => (
  <div className="py-1">
    {React.Children.map(children, (child) => {
      if (!child || !child.type) return child;

      if (child.type.displayName === "SelectItem") {
        return React.cloneElement(child, {
          onSelect,
          isSelected: value === child.props.value,
        });
      }

      return child;
    })}
  </div>
);
SelectGroup.displayName = "SelectGroup";

/* ===========================
   ITEM
=========================== */
export const SelectItem = ({
  value,
  children,
  onSelect,
  isSelected,
  className,
}) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className={`w-full text-left px-4 py-2.5 text-[1rem] hover:bg-gray-50 transition ${
      isSelected ? "bg-sky-50 text-sky-700" : ""
    } ${className || ""}`}
  >
    {children}
  </button>
);
SelectItem.displayName = "SelectItem";
