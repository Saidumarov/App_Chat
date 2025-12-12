const UseDate = () => {
  const id = JSON.parse(localStorage.getItem("cityId"));

  let dates = [];
  let now = new Date();

  // Hozirgi vaqtni olish
  let currentHour = now.getHours();

  // Conditions for id === 43
  if (id === 43) {
    if (currentHour >= 17) {
      now.setDate(now.getDate() + 1); // Skip to tomorrow if it's after 17:00
    }
  } else {
    // For other ids, start from 2 days after the current date
    now.setDate(now.getDate() + 2);
  }

  for (let i = 0; i < 4; i++) {
    // Generate dates for the next 4 days
    let futureDate = new Date(now);
    futureDate.setDate(now.getDate() + i); // Correctly increment each day

    // Extract day, month, day of the week
    let day = futureDate.getDate();
    let month = futureDate.toLocaleString("ru-RU", { month: "short" });
    let dayOfWeek = futureDate.toLocaleString("ru-RU", { weekday: "short" });

    // Ensure fullDate is in YYYY-MM-DD format
    let year = futureDate.getFullYear();
    let formattedMonth = (futureDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Add leading zero
    let formattedDay = day.toString().padStart(2, "0"); // Add leading zero to day if needed
    let fullDate = `${year}-${formattedMonth}-${formattedDay}`; // Ensure day matches 'day'

    dates.push({
      day,
      month,
      dayOfWeek,
      fullDate,
    });
  }

  return dates;
};

export default UseDate;

export function getFormattedDate() {
  const today = new Date();

  // Get the day, month, and year
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  // Return the date in DD.MM.YYYY format
  return `${day}.${month}.${year}`;
}

export function formatISODate(isoDate, format) {
  const date = new Date(isoDate);

  // Sana va vaqtni formatlash
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if (format === "oy") {
    return `${day}-${month}-${year}`;
  } else if (format === "soat") {
    return `${hours}:${minutes}`;
  } else {
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
}

// Oylar nomlari
export const monthNames = {
  uz: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],

  oz: [
    "Январ",
    "Феврал",
    "Март",
    "Апрел",
    "Май",
    "Июн",
    "Июл",
    "Август",
    "Сентабр",
    "Октябр",
    "Ноябр",
    "Декабр",
  ],

  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],

  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// Barcha xabarlarni yig'ish va sana bo'yicha guruhlash
export const groupMessagesByDate = (sessions, language = "uz") => {
  const allMessages = [];

  // Barcha sessiyalardan xabarlarni yig'ish
  sessions?.forEach((session) => {
    if (session) {
      allMessages.push(session);
    }
  });

  // Vaqt bo'yicha tartiblash (eng yangi oxirida)
  allMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Sana bo'yicha guruhlash
  const grouped = {};

  allMessages.forEach((msg) => {
    const date = new Date(msg.created_at);
    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: date,
        messages: [],
      };
    }

    grouped[dateKey].messages.push(msg);
  });

  // Sana bo'yicha tartiblash (eng eski birinchi, telegram kabi)
  const sortedGroups = Object.entries(grouped).sort((a, b) => {
    return a[1].date - b[1].date;
  });

  return sortedGroups;
};

// Sana formatini ko'rsatish
export const formatDateHeader = (date, language = "uz") => {
  const day = date.getDate();
  const month = monthNames[language][date.getMonth()];
  const year = date.getFullYear();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Bugun
  if (date.toDateString() === today.toDateString()) {
    return language === "uz"
      ? "Bugun"
      : language === "oz"
      ? "Бугун"
      : language === "ru"
      ? "Сегодня"
      : "Today";
  }

  // Kecha
  if (date.toDateString() === yesterday.toDateString()) {
    return language === "uz"
      ? "Kecha"
      : language === "oz"
      ? "Кеча"
      : language === "ru"
      ? "Вчера"
      : "Yesterday";
  }

  return `${day} ${month} ${year}`;
};
