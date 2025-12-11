import { z } from "zod";

export const getFieldValidation = (field) => {
  let validation = z.string();

  if (field.required) {
    validation = validation.min(
      1,
      `${field.label.uz || field.label.ru} majburiy`
    );
  } else {
    validation = validation.optional();
  }

  switch (field.type) {
    case "email":
      if (field.required) {
        validation = z.string().email("Email noto'g'ri formatda");
      }
      break;
    case "tel":
      if (field.required) {
        validation = z.string().min(12, "Telefon raqam to'liq emas");
      }
      break;
    case "number":
      if (field.required) {
        validation = z.string().min(1, "Raqam kiritish majburiy");
      }
      break;
    case "pinfl":
      if (field.required) {
        validation = z.string().length(14, "PINFL 14 ta raqamdan iborat");
      }
      break;
    case "passport":
      validation = validation.regex(
        /^[A-Z]{2}\d{7}$/,
        "Pasport formati: 2 harf + 7 raqam (masalan: AD1234567)"
      );
      break;
    case "card_number":
      if (field.required) {
        validation = z.string().min(19, "Karta raqami to'liq emas");
      }
      break;
  }

  return validation;
};

export const createFormSchema = (fields) => {
  const schemaObject = {};
  fields?.forEach((field) => {
    schemaObject[field.name] = getFieldValidation(field);
  });
  return z.object(schemaObject);
};

export const renderType = (type) => {
  switch (type) {
    case "tel":
      return "tel";
    case "passport":
      return "text";
    case "pinfl":
      return "tel";
    case "card_number":
      return "tel";
    case "password":
      return "password";
    default:
      return type;
  }
};

export const formatInput = (type, value) => {
  switch (type) {
    case "tel":
      let phone = value.replace(/\D/g, "");
      if (!phone.startsWith("998")) {
        phone = "998" + phone;
      }
      return "+" + phone.slice(0, 12);

    case "passport":
      return value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 9);

    case "pinfl":
      return value.replace(/\D/g, "").slice(0, 14);

    case "card_number":
      const digits = value.replace(/\D/g, "").slice(0, 16);
      return digits.match(/.{1,4}/g)?.join(" ") || digits;

    default:
      return value;
  }
};
