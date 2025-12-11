import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/shared/custom-select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "../context/language-provider";
import { useEffect, useState } from "react";
import { usePost } from "../service/post.service";
import { useTranslations } from "use-intl";
import { RichText } from "../components/shared/RichText";
import { CustomInput, CustomTextarea } from "../components/shared/custom-input";
import { CustomLabel } from "../components/shared/custom-label";
import { ImSpinner9 } from "react-icons/im";
import { createFormSchema, formatInput, renderType } from "./shared";
import { getStoredSessionId } from "../hooks/storeg";

const DinamikForm = ({ setCountValue, formData }) => {
  const { locale: lang } = useLocale();
  const [selectedForm, setSelectedForm] = useState(null);
  const { mutate: POST, isPending: ispending } = usePost("ticket");
  const a = useTranslations("chat");
  const t = useTranslations("chat");
  const [file, setFile] = useState("");
  const [success, setSuccess] = useState(false);

  // Dynamic form validation
  const formSchema = selectedForm
    ? createFormSchema(selectedForm?.fields)
    : z.object({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const openFormModal = (form) => {
    setSelectedForm(form);
    const defaultValues = {};
    form?.fields.forEach((field) => {
      defaultValues[field?.name] = "";
    });
    reset(defaultValues);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFile(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFormInput = (field) => {
    const fieldPlaceholder =
      field.placeholder?.[lang] ||
      field.placeholder?.uz ||
      field.placeholder?.ru;
    const hasError = errors[field.name]?.message;

    switch (field.type) {
      case "richtext":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <RichText
                field={{
                  ...formField,
                  placeholder: field.placeholder,
                }}
                control={control}
                hasError={errors[field.name]?.message}
                lang={lang}
              />
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div>
                <CustomTextarea
                  {...formField}
                  className="!shadow-none"
                  placeholder={fieldPlaceholder}
                  rows={4}
                  errors={hasError}
                />
              </div>
            )}
          />
        );

      // case "select":
      //   return (
      //     <Controller
      //       name={field.name}
      //       control={control}
      //       render={({ field: formField }) => {
      //         return (
      //           <div>
      //             <Select
      //               value={formField.value || ""}
      //               onValueChange={(value) => {
      //                 formField.onChange(value);
      //               }}
      //             >
      //               <SelectTrigger
      //                 className={`w-full !rounded-xl shadow-none bg-white border-gray-300 !text-[1rem] h-[42px] min-w-full ${
      //                   hasError
      //                     ? "!bg-red-100 border-red-300"
      //                     : "bg-white border-gray-300"
      //                 }`}
      //               >
      //                 <SelectValue
      //                   placeholder={lang === "uz" ? "Tanlang" : "Выберите"}
      //                 >
      //                   {field.options?.find(
      //                     (el) => el?.value === formField?.value
      //                   )?.[lang === "uz" ? "labelUz" : "labelRu"] || ""}
      //                 </SelectValue>
      //               </SelectTrigger>

      //               <SelectContent className="w-full !text-[1rem] min-w-60">
      //                 <SelectGroup>
      //                   {field?.options?.map((opt, i) => (
      //                     <SelectItem key={i} value={opt?.value}>
      //                       {lang === "uz" ? opt?.labelUz : opt?.labelRu}
      //                     </SelectItem>
      //                   ))}
      //                 </SelectGroup>
      //               </SelectContent>
      //             </Select>
      //           </div>
      //         );
      //       }}
      //     />
      //   );

      case "file":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <div>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center ${
                    hasError ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <CustomInput
                    type="file"
                    className="hidden"
                    id={`file-${field.name}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      formField.onChange(file ? file.name : "");
                      handleImageUpload(e);
                    }}
                  />
                  <CustomLabel
                    htmlFor={`file-${field.name}`}
                    className="cursor-pointer text-gray-600"
                  >
                    📎{" "}
                    {fieldPlaceholder || lang == "uz"
                      ? "Faylni yuklash"
                      : "Загрузить файл"}
                    {formField.value && (
                      <span className="block text-sm text-green-600 mt-2">
                        ✓ {formField.value}
                      </span>
                    )}
                  </CustomLabel>
                </div>
              </div>
            )}
          />
        );

      case "tel":
      case "passport":
      case "pinfl":
      case "card_number":
      case "password":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <CustomInput
                {...formField}
                className="h-10"
                type={renderType(field.type)}
                placeholder={fieldPlaceholder}
                errors={hasError}
                onChange={(e) => {
                  const formatted = formatInput(field.type, e.target.value);
                  formField.onChange(formatted);
                }}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <CustomInput
                {...formField}
                className="h-10"
                type={field.type}
                placeholder={fieldPlaceholder}
                errors={hasError}
              />
            )}
          />
        );
    }
  };

  const onFormSubmit = handleSubmit(
    (data) => {
      const ID = getStoredSessionId();
      const body = {
        ticket_number: formData?.ticket_number,
        anon_id: ID,
        data: {
          ...data,
          icon: selectedForm.icon,
          apptitle_uz: selectedForm?.title.uz,
          apptitle_ru: selectedForm?.title.ru,
          img: file || null,
        },
      };

      if (formData) {
        POST(
          {
            body: body,
            url: `/chat/ticket/2d70f9c-87c1-4d2d-8f3b-87e645e983aa/`,
            key: true,
          },
          {
            onSuccess: (res) => {
              if (res?.id) {
                // ✅ Success holatini o'rnatish
                setSuccess(true);

                // ✅ 2 soniyadan keyin formani tozalash va yopish
                setTimeout(() => {
                  setSuccess(false);
                  reset();
                  setFile("");
                  setSelectedForm(null);
                }, 2000);
              }
              // else if ([404, 500, 400, 401].includes(res?.status)) {
              //   toast.error(a("loginError"));
              // } else if (res?.status === 429) {
              //   toast.error(a("tooManyRequests"));
              // }
            },
            onError: (error) => {
              console.error("Form submission error:", error);
            },
          }
        );
      }
    },
    (errors) => {
      // ✅ Validatsiya xatoliklarini ko'rsatish
      console.log("Validation errors:", errors);
      // toast.error(
      //   lang === "uz"
      //     ? "Iltimos, barcha majburiy maydonlarni to'ldiring"
      //     : "Пожалуйста, заполните все обязательные поля"
      // );
    }
  );

  useEffect(() => {
    if (formData) {
      openFormModal(formData?.form);
      setTimeout(() => {
        setCountValue((prev) => prev + 1);
      }, 200);
    }
  }, [formData]);

  if (!selectedForm) {
    return null;
  }

  return (
    <div>
      <div className="bg-white rounded-xl  border border-gray-200 w-full h-full p-4">
        {/* ✅ Success xabari */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              {lang === "uz"
                ? "Muvaffaqiyatli yuborildi!"
                : "Успешно отправлено!"}
            </span>
          </div>
        )}

        <form onSubmit={onFormSubmit} className="space-y-4">
          {selectedForm?.fields?.map((field, index) => (
            <div key={index}>
              <CustomLabel>
                {field?.label[lang] || field?.label?.uz}
                {field?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </CustomLabel>
              {renderFormInput(field)}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={ispending || success}
              className={`flex-1 ${
                success ? "bg-green-500" : "bg-sky-500 hover:bg-sky-400"
              } disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition flex items-center justify-center gap-2`}
            >
              {ispending ? (
                <>
                  <ImSpinner9 className="animate-spin w-4 h-4" />
                  <span>
                    {lang === "uz" ? "Yuborilmoqda..." : "Отправка..."}
                  </span>
                </>
              ) : success ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{lang === "uz" ? "Yuborildi" : "Отправлено"}</span>
                </>
              ) : (
                t("save")
              )}
            </button>

            {/* <button
              type="button"
              onClick={() => {
                reset();
                setFile("");
                setSelectedForm(null);
              }}
              disabled={ispending || success}
              className="px-6 py-3 border border-red-400 rounded-xl text-red-700 bg-red-50 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("cancel")}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DinamikForm;
