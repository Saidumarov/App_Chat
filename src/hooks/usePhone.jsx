"use client";
import { useMemo } from "react";

export function cleanPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[^\d]/g, "");
}

export const useIsUzbekPhone = (phoneNumber) => {
  if (!phoneNumber) return false;

  const clean = phoneNumber.replace(/\D/g, "");
  const operators = [
    "90",
    "91",
    "93",
    "94",
    "95",
    "97",
    "98",
    "99",
    "88",
    "77",
    "55",
    "33",
    "71",
    "74",
    "76",
    "79",
    "50",
    "33",
  ];

  // 998XXXXXXXXX format
  if (clean.length === 12 && clean.startsWith("998")) {
    return operators.includes(clean.substring(3, 5));
  }

  // XXXXXXXXX format
  if (clean.length === 9) {
    return operators.includes(clean.substring(0, 2));
  }

  return false;
};

export function formatPhoneNumber(number) {
  const cleaned = ("" + number).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}-${match[4]}-${match[5]}`;
  }
  return number;
}

export function formatPhoneNumber2(number) {
  const cleaned = ("" + number).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}-${match[4]}-${match[5]}`;
  }
  return number;
}

export function useMaskPhone(phone) {
  const maskedPhone = useMemo(() => {
    // Raqamni faqat sonlardan tozalaymiz
    const cleaned = phone.replace(/\D/g, "");

    // Raqam 12 ta raqam bo'lishi kerak: 998XXXXXXXXX
    if (!/^998\d{9}$/.test(cleaned)) {
      return phone; // noto‘g‘ri format bo‘lsa, o‘zini qaytar
    }

    // Oxirgi 4 raqamni olish
    const lastFour = cleaned.slice(-4);
    const firstPart = cleaned.slice(0, 3); // 998
    const maskedPart = "******";

    return `+${firstPart}${maskedPart}${lastFour.slice(0, 2)}-${lastFour.slice(
      2
    )}`;
  }, [phone]);

  return maskedPhone;
}

export const baseurl = window?.location?.href?.replace(/\/(uz|ru|en|oz)\/?$/, "/");
export const Bot = "https://res.cloudinary.com/dihwufibd/image/upload/v1762418151/bot_f3cozh.png";
export function getLocaleFromUrl() {
  if (typeof window === 'undefined') return null; // serverda ishlamasin

  const path = window.location.pathname; // masalan: /uz/sa/sasas
  const match = path.match(/^\/(uz|ru|en|oz)(?:\/|$)/);
  return match ? match[1] : null;
}