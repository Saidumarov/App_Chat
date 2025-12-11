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
      return "number";
    case "card_number":
      return "text";
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

export const Data = {
  id: 87,
  title: {
    uz: "Ilova ishlab chiqish",
    ru: "Разработка приложения",
    value: "app_development",
  },
  icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAABD9JREFUeF7tmz9oFEEUxieFIBIhCiooCkJAMI2KaJPCMoWVSFBQ8E+r2EmsxO5axdY/hSAESZUipYURlKBpIgpBwT8BY+GBYHvyLo7ZnJudndk3+83efQNisbszc9/vfe+92bsMdTqdjuGAKTBEADDtuwsTAFZ/AgDrTwAEgFYAvD5rAAGAFQAvTwcQAFgB8PJ0AAGAFQAvTwcQAFgB8PJ0QEUAn399McNbhs3OrTuCZiKAINnWHnqw9Mg8fPfYPJ14Yg5s3x80EwEEyPb2x2JXfPlfBgEEiBj6iI367PMEEKqmx3O9UU8AHuJVvfXa8xv/0k3eXHRAVYU3eV6iXsR3DQiA+ZWX5v3PD+bq2GXX/hp3vSjdJOMAAXBz/pa5cvhSX0HIK7KuCII5QADIOLrriLl/6q5rn0lf9416eBG2DshupKluCIn6JAHIppoEoUrUJwvApiQpzpKaUh1Voz5pAHZzKbpBK+obASC1lOQ6UIW6Fd4Fldk40g1lD1RlPkdy5wCfTdcNIUa6aTSAOlOSZpF1BVkjUlDvh4jlhrqivjFFuCh6tCHUGfV9AUDrzICI+r4BUPXMgIp6u++q78GCvxPOexfkKlau6z4pCR31IrzGaT8pABaQvFkteo0R60DlCpCqbs2bP0kAm7WrsQ9ULgBaUZ9dJ1kAWQjodBPz/JI0AFdE1nE9RtSrOEB+knd+7kIdGsDW8GkKQjcZ7ABZEN0Chn5o13NVW0vX/CoOsJOgC6PPhy1zr6sDKzOHzz2VHJBdqOluqCPdqLaheZM1EULsIutyg5oDsikp+8th1waQ11FRr1oDNhMwZTego74WAKl2SdpR35p+Zc6OHzKje0eCzKyeglKtDTGiXsRvTb82C/cupg0A7Qbt1tIKb4OtEQAQELQPVCL8i6Vv3X/Z0RgAdtOxC3TMdJOXYhsHIKYbYhRZyfNFAwJgeaUdXHhinBnqjnp4Cppb+GQWP66aqcmTQe2X5msMRNQnAeBca9aMj+0zs3fOQCAgoz4ZAHYjU5MnVNxQ9vtedNQnB0A2pAWhqEvSjvq1tvJr90AVOiBFWGqApKC8oQEiD0LsA1XfANB2g3zpo/lHgL0n2VDhoSfhIgfYjWkV6KoCZZ+XlHP69ozmlJh3QWUAaBdoDdUGEoBmSqoKYWABWOHkzCCpCTUGHgDaDQTwN/Q1WtUQFxFAj2p1gyCAnLCtEwIBFOSN9rPrIVnF6xkCIIANCgT/KsLnIFY2ROmAskoZYwhgXazk3oZ6cNxwKx3goRwdQAd4hMv6reyC2AWxCxq47wPK5goW4bJKsQ3doBTbUI/A6ZsivNr+bd4sf/f46O5bJ44fdN+kcIe00Jrj2Oges3tkW9CUwa8iglbjQ/8pQADgoCAAAgArAF6eDiAAsALg5ekAAgArAF6eDiAAsALg5ekAAgArAF6eDiAAsALg5f8A5SmgHXohfZgAAAAASUVORK5CYII=",
  value: "app_development",
  iconType: "image",
  fields: [
    {
      name: "text",
      label: {
        uz: "Text",
        ru: "dasdsa",
      },
      type: "text",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "summa",
      label: {
        uz: "Summa",
        ru: "dsadas",
      },
      type: "number",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "email",
      label: {
        uz: "Email",
        ru: "xcvbn",
      },
      type: "email",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "phone",
      label: {
        uz: "Phone",
        ru: "dfsfs",
      },
      type: "tel",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "sana",
      label: {
        uz: "Sana",
        ru: "dddd",
      },
      type: "date",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "sana_vaqt",
      label: {
        uz: "Sana Vaqt",
        ru: "sdfghjk",
      },
      type: "datetime-local",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "info",
      label: {
        uz: "Info",
        ru: "fdsfsd",
      },
      type: "textarea",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "izoh",
      label: {
        uz: "Izoh",
        ru: "qwwqw",
      },
      type: "richtext",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "rasm_yuklash",
      label: {
        uz: "Rasm yuklash",
        ru: "sdfghjk",
      },
      type: "file",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "pasport_raqami",
      label: {
        uz: "Pasport Raqami",
        ru: "cvbnm",
      },
      type: "passport",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "pinfl",
      label: {
        uz: "PINFL",
        ru: "sdgdg",
      },
      type: "pinfl",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "karta_raqam",
      label: {
        uz: "Karta Raqam",
        ru: "eqwewq",
      },
      type: "card_number",
      placeholder: null,
      required: true,
      options: [],
    },
    {
      name: "tanlash",
      label: {
        uz: "Tanlash",
        ru: "yuyuyuyu",
      },
      type: "select",
      placeholder: null,
      required: true,
      options: [
        {
          labelUz: "hjhjhj",
          labelRu: "jjhhhj",
          value: "hjhjhj",
        },
        {
          labelUz: "hjhjhj",
          labelRu: "hjhjhj",
          value: "hjhjhj",
        },
        {
          labelUz: "hjhjhjh",
          labelRu: "hjhjhj",
          value: "hjhjhjh",
        },
      ],
    },
  ],
  created_at: new Date().toDateString(),
  updated_at: "2025-12-10T02:15:08.396641+05:00",
  is_active: true,
};
