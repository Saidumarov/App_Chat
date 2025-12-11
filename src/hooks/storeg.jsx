const STORAGE_KEY = "mkbank_chat_session_id";

// localStorage helpers
export const getStoredSessionId = () => {
  try {
    const id = new URLSearchParams(location.search).get("id");
    return id;
  } catch (e) {
    console.error("localStorage o'qishda xatolik:", e);
    return null;
  }
};

export const setStoredSessionId = (id) => {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch (e) {
    console.error("localStorage yozishda xatolik:", e);
  }
};

export const clearStoredSessionId = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("localStorage tozalashda xatolik:", e);
  }
};
