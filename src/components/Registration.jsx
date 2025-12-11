// import { useMask } from "@react-input/mask";
import { useState } from "react";
// import { useIsUzbekPhone } from "../hooks/usePhone";
import { useTranslations } from "next-intl";
import { PiSpinnerBold } from "react-icons/pi";

export const RegistrationForm = ({ onSubmit, isPending }) => {
  const [fullName, setFullName] = useState("");
  // const [phone, setPhone] = useState("+998");
  const [errors, setErrors] = useState({});
  const t = useTranslations("chat");

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Ism familiyangizni kiriting";
    }

    // if (!phone.trim()) {
    //   newErrors.phone = "Telefon raqamingizni kiriting";
    // }
    // else if (phone.replace(/\D/g, "").length < 9 || !useIsUzbekPhone(phone)) {
    //   newErrors.phone = "To'g'ri telefon raqam kiriting";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({ fullName });
    }
  };

  // const inputRef = useMask({
  //   mask: "+998 __ ___ __ __",
  //   replacement: { _: /\d/ },
  // });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("fullname")}
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => (
            setFullName(e.target.value),
            setErrors((prev) => ({
              ...prev,
              fullName: false,
            }))
          )}
          placeholder={t("name")}
          className={`w-full px-4 py-2.5 !text-[16px] border rounded-xl focus:outline-none focus:ring-2 ${
            errors.fullName ? "focus:ring-red-500" : "focus:ring-green-500"
          } transition-all ${
            errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
      </div>
      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("tel")}
        </label>
        <input
          type="tel"
          ref={inputRef}
          value={phone || "+998"}
          onChange={(e) => (
            setPhone(e.target.value),
            setErrors((prev) => ({
              ...prev,
              phone: false,
            }))
          )}
          className={`w-full px-4 !text-[16px] py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.phone ? "focus:ring-red-500" : "focus:ring-green-500"
          }  transition-all ${
            errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
      </div> */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r  disabled:opacity-[0.8] from-[#0d5293] active:scale-[0.98] transition-all duration-200 via-[#3CAB3D] to-[#42e645] text-white py-3 rounded-xl font-semibold hover:opacity-90  flex items-center justify-center gap-2 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <PiSpinnerBold className="animate-spin text-white" />
          </span>
        ) : (
          <></>
        )}
        {t("start")}
      </button>
    </form>
  );
};
