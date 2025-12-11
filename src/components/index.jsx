import { useTranslations } from "next-intl";
import { Bot } from "../hooks/usePhone";
import { OP } from "../constants/icons";

export const emojis = [
  "😀",
  "😂",
  "😍",
  "😊",
  "😎",
  "😢",
  "😡",
  "🤔",
  "👍",
  "🙏",
  "🎉",
  "🔥",
  "❤️",
  "😅",
  "😴",
  "🥰",
  "😉",
  "🤩",
  "😇",
  "🤗",
  "💪",
  "✨",
  "🌟",
  "💯",
];

export const IsTypengLoading = ({ sender }) => {
  const t = useTranslations("chat");

  return (
    <div className="flex justify-start pt-3 mb-3">
      <div className="bg-gray-200 rounded-xl rounded-bl-none p-3 ">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8  rounded-full flex items-center justify-center text-white text-sm font-bold">
            {["ai", "system"].includes(sender) ? (
              <img
                src={`${Bot}`}
                className="w-full h-full rounded-full"
                alt="AI"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 p-1 flex items-center justify-center">
                <OP/>
              </div>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {["ai", "system"].includes(sender) ? "MKBANK AI" : t("op")}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
        </div>
      </div>
    </div>
  );
};
