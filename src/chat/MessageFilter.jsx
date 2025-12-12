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

  const groupedMessages = groupMessagesByDate(messages, locale);
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
