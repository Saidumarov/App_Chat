import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_encryptionKey; // 🔐 Maxfiy kalit (har qanday uzunlikda bo‘lishi mumkin)

// 🔑 256-bit AES kalit yaratish (SHA-256 hash orqali)
const key = CryptoJS.SHA256(secretKey);

export const encryptData = (data) => {
  const iv = CryptoJS.lib.WordArray.random(16); // ✅ 16-byte IV (har safar har xil bo‘lishi kerak)

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString(); // ✅ IV:CipherText formatida qaytarish
};

export const decryptAES = (cipherText) => {
  try {
    const parts = cipherText.split(":");
    if (parts.length !== 2) {
      throw new Error("❌ Shifrlangan format noto‘g‘ri!");
    }

    const iv = CryptoJS.enc.Hex.parse(parts[0]); // 🔄 IVni hex formatga o'tkazamiz
    const encrypted = CryptoJS.enc.Hex.parse(parts[1]); // 🔒 Shifrlangan matnni hex formatga o'tkazamiz

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error("❌ Decryption failed!");
    }

    return JSON.parse(decryptedText); // ✅ Ochiq matnni qaytaramiz
  } catch (error) {
    console.error("❌ Shifrlangan kodni ochib bo‘lmadi!", error);
    return null;
  }
};
