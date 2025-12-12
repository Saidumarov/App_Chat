import { useTranslations } from "use-intl";
import { Chek, OP, Replay } from "../constants/icons";
import { useLocale } from "../context/language-provider";
import {
  formatDateHeader,
  formatISODate,
  groupMessagesByDate,
} from "../hooks/useDate";
import { Bot } from "../hooks/usePhone";
import { TypewriterText } from "../hooks/playSendSound";
import DinamikForm from "../forms";

export const GroupedMessages = ({
  messages,
  openViewer,
  setCountValue,
  setIsLoading,
}) => {
  const { locale } = useLocale();
  const data = [
  {
    "id": "a1",
    "text": "salom",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-11T09:22:11.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "a2",
    "text": "Salom! Qanday yordam bera olaman?",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-11T09:22:15.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "a3",
    "text": "Hisobimga kira olmayapman",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-11T10:10:44.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "a4",
    "text": "Hisobga kirish bo‘yicha muammo qabul qilindi.",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-11T10:10:50.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "a5",
    "text": "raqamim o'zgargan edi shuni tiklamoqchiman",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-11T11:40:12.000Z",
    "image": null,
    "isTyping": false
  },

  {
    "id": "b1",
    "text": "salom",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-12T04:38:37.018Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b2",
    "text": "Salom! Sizga qanday yordam bera olishimni aniqlash uchun savolingizni aniqroq ayta olasizmi?",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-12T04:38:42.679Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b3",
    "text": "ilova ishlamayapdi ukam",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-12T04:42:58.421Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b4",
    "text": "Murojaatingiz qabul qilindi. Tez orada operator bog‘lanadi.",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-12T04:43:05.162Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b5",
    "text": "qancha vaqtda hal bo'ladi taxminan?",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-12T06:15:22.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b6",
    "text": "Odatda 1-2 soat ichida muammo ko‘rib chiqiladi.",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-12T06:15:30.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b7",
    "text": "yaxshi kutaman",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-12T06:16:55.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b8",
    "text": "Agar qo‘shimcha savollar bo‘lsa bemalol yozing.",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-12T06:17:01.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b9",
    "text": "karta balansim ham yangilanmayapti",
    "sender": "user",
    "operatorName": "",
    "created_at": "2025-12-12T07:05:44.000Z",
    "image": null,
    "isTyping": false
  },
  {
    "id": "b10",
    "text": "Balans yangilanishi bo‘yicha texnik ishlar ketmoqda.",
    "sender": "ai",
    "operatorName": "MKBANK AI",
    "created_at": "2025-12-12T07:05:50.000Z",
    "image": null,
    "isTyping": false
  }
]

  const groupedMessages = groupMessagesByDate(data, locale);
  const t = useTranslations("chat");

  return (
    <div className="space-y-6">
      {groupedMessages.map(([dateKey, group]) => (
        <div key={dateKey} className="space-y-3">
          <div className="flex justify-center  sticky -top-2 z-10 my-4">
            <div className="bg-gray-200 border  border-gray-300 text-gray-600 px-2 py-[2px] rounded-full text-xs font-bold">
              {formatDateHeader(group?.date, locale)}
            </div>
          </div>

          {group?.messages?.map((msg) => (
            <div key={msg?.id}>
              {msg?.form ? (
                <DinamikForm
                  setCountValue={setCountValue}
                  formData={msg?.form}
                />
              ) : (
                <div
                  className={`mb-3 flex   w-full ${
                    msg?.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative flex  max-w-[100%]  justify-between   items-center group  `}
                  >
                    <button
                      disabled
                      className={` ${
                        msg?.sender === "user" ? "" : "hidden"
                      } transition-all opacity-0 duration-300 mr-5 max-sm:mr-2 bg-white cursor-pointer shadow-md rounded-full p-1.5 hover:bg-gray-100  `}
                    >
                      <Replay />
                    </button>
                    <div
                      className={`  w-[90%] min-w-20 relative  rounded-xl p-3 ${
                        msg?.sender === "user"
                          ? "bg-[#18c139] rounded-br-none"
                          : "bg-gray-200 rounded-bl-none "
                      }   `}
                    >
                      {["operator", "ai", "system"]?.includes(msg?.sender) ? (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8  rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {["ai", "system"].includes(msg?.sender) ? (
                              <img
                                src={`${Bot}`}
                                className="w-full h-full rounded-full"
                                alt="AI"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gray-300 p-1 flex items-center justify-center">
                                <OP />
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {msg?.operatorName || t("op")}
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}

                      {msg?.image && (
                        <img
                          src={msg?.image}
                          onClick={() => openViewer(msg?.image)}
                          alt="rasm"
                          className="w-full max-w-xs rounded-md cursor-pointer mb-2"
                        />
                      )}

                      {msg?.text && (
                        <div
                          className={` max-sm:text-[16px] max-2xl:text-sm break-words ${
                            msg?.sender === "user"
                              ? "text-white"
                              : "text-gray-900"
                          } `}
                        >
                          {msg?.sender === "user" ? (
                            msg?.text
                          ) : msg?.isTyping ? (
                            <TypewriterText
                              text={msg?.text}
                              speed={50}
                              setIsLoading={setIsLoading}
                              setCountValue={setCountValue}
                            />
                          ) : (
                            msg?.text
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <div
                          className={`text-xs absolute flex items-center gap-1 right-2 ${
                            msg?.sender === "user"
                              ? "text-white"
                              : "text-gray-400"
                          } `}
                        >
                          {formatISODate(msg?.created_at, "soat")}{" "}
                          {msg?.sender === "user" ? (
                            <div className="flex relative items-start">
                              <span className="-mr-3">
                                <Chek />
                              </span>{" "}
                              <span>
                                <Chek />
                              </span>{" "}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      disabled
                      className={` } ${
                        msg.sender === "user" ? "hidden" : ""
                      } transition-all  opacity-0 duration-300 ml-5 max-sm:ml-2 bg-white cursor-pointer shadow-md rounded-full p-1.5 hover:bg-gray-100  `}
                    >
                      <Replay />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
