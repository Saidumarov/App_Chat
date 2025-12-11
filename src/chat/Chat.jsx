import { useState, useEffect, useRef } from "react";
import { Paperclip, X } from "lucide-react";
import { Chek, OP, Replay, Sends } from "../constants/icons";
import { ImageViewer } from "../components/ImageViewer";
import { Bot } from "../hooks/usePhone";
import { useTranslations } from "next-intl";
import { playSendSound, TypewriterText } from "../hooks/playSendSound";
import { IsTypengLoading } from "../components";
import { usePost } from "../service/post.service";
import {
  clearStoredSessionId,
  getStoredSessionId,
  setStoredSessionId,
} from "../hooks/storeg";
import { formatISODate } from "../hooks/useDate";
import { useLocale } from "../context/language-provider";
const WS_URL = import.meta.env.VITE_MKBANK_WS_API;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageViw, setSelectedImageViw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLocale();
  const [selectedImage, setSelectedImage] = useState(null);
  const [count, setCount] = useState(0);
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const [countValue, setCountValue] = useState(0);
  const [active, setActive] = useState("ai");

  // Backend states
  const [sessionId, setSessionId] = useState(null);
  const [ws, setWs] = useState(null);
  const t = useTranslations("chat");
  const ID = getStoredSessionId();

  const { mutate: POST, isPending } = usePost("chat");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Create new session
  const createNewSession = ({ full_name, anon_id }) => {
    if (anon_id) {
      POST(
        {
          body: {
            channel: "web",
            language: "uz",
            anon_id: anon_id,
          },
          url: "/chat/sessions/",
        },
        {
          onSuccess: (res) => {
            connectWebSocket(res?.id);
            setSessionId(res?.id);
          },
        }
      );
    } else {
      POST(
        {
          body: {
            channel: "web",
            language: "uz",
            full_name: full_name || "Anonim",
          },
          url: "/chat/sessions/",
        },
        {
          onSuccess: (res) => {
            connectWebSocket(res.id);
            setStoredSessionId(res?.anon_id);
            setSessionId(res.id);
            setMessages((prev) => [
              ...prev,
              {
                id: new Date().toDateString(),
                text:
                  locale == "uz"
                    ? `Assalomu alaykum, ${full_name}! 😊 Sizga qanday yordam bera olaman?`
                    : locale == "ru"
                    ? `Здравствуйте, ${full_name}! 😊 Чем я могу вам помочь?`
                    : locale == "en"
                    ? `Hello, ${full_name}! 😊 How can I help you?`
                    : locale == "oz"
                    ? `Ассалому алайкум, ${full_name}! 😊 Сизга қандай ёрдам берa оламан?`
                    : "",
                sender: "ai",
                operatorName: "MKBANK AI",
                created_at: new Date().toDateString(),
                isTyping: true,
              },
            ]);
          },
        }
      );
    }
  };

  // Connect to WebSocket
  const connectWebSocket = (sessionId) => {
    try {
      const websocket = new WebSocket(`${WS_URL}/ws/chat/${sessionId}/`);
      websocket.onopen = () => {
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      websocket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };

      websocket.onclose = () => {
        console.log("❌ WebSocket disconnected");

        setCount((prev) => {
          const newCount = prev + 1;

          // Auto reconnect
          reconnectTimeoutRef.current = setTimeout(() => {
            if (sessionId) {
              if (newCount < 5) {
                console.log("🔄 WebSocket reconnecting...");
                connectWebSocket(sessionId);
              } else {
                console.log(
                  "❌ 5 failed connections. A new session will be created."
                );
                clearStoredSessionId();
                setSessionId(null);
                setMessages([]);
                setCount(0);
                setCountValue(0);
                setIsTypingLocal(false);
                setIsTyping(false);
              }
            }
          }, 1000);

          return newCount;
        });
      };
    } catch (error) {
      console.error("❌ WebSocket connection error:", error);
    }
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data?.type) {
      case "connection":
        console.log("✅ Connection confirmed");
        break;

      case "message":
        const msg = data?.message;

        setMessages((prev) => {
          // 1. Agar sender user bo'lsa — UI ga qo‘shmaymiz
          if (msg?.sender === "user" || !msg?.text) return prev;

          // 2. Avvaldan bor bo'lsa — qo‘shmaymiz
          const exists = prev?.some((m) => m?.id === msg?.id);
          if (exists) return prev;

          // 3. Yangi message qo‘shish
          return [
            ...prev,
            {
              id: msg?.id,
              text: msg?.text,
              sender: msg?.sender,
              operatorName:
                msg?.sender === "ai"
                  ? "MKBANK AI"
                  : msg?.sender === "operator"
                  ? t("op")
                  : msg?.sender === "system"
                  ? "MKBANK AI"
                  : "",
              created_at: msg?.created_at,
              image: msg?.image || null,
              isTyping: true,
            },
          ];
        });
        setIsTyping({
          sender: "ai",
          is_typing: false,
        });
        break;

      case "history":
        const loadedMessages = data?.messages?.map((msg) => ({
          id: msg?.id,
          text: msg?.text,
          sender: msg?.sender,
          operatorName:
            msg?.sender === "ai"
              ? "MKBANK AI"
              : msg?.sender === "operator"
              ? t("op")
              : msg?.sender === "system"
              ? "MKBANK AI"
              : "",
          created_at: msg?.created_at,
          image: msg?.image || null,
          isTyping: false,
        }));
        if (loadedMessages?.length > 0 && ID && ID !== "undefined") {
          setMessages(loadedMessages);
        }
        break;

      case "typing":
        if (data?.sender !== "user") {
          setIsTyping(data);
        }
        break;

      case "session_update":
        setActive(data?.update?.status);
        break;
      case "error":
        console.error("Server error:", data.error);
        break;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, countValue, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [inputMessage]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading || isTyping.is_typing) return;
    playSendSound();
    ws.send(
      JSON.stringify({
        type: "message",
        session_id: sessionId,
        text: inputMessage,
        sender: "user",
        language: locale,
        ...(selectedImage && { image: selectedImage }),
      })
    );
    setInputMessage("");
    setMessages((prev) => [
      ...prev,
      {
        id: new Date(),
        type: "message",
        session_id: sessionId,
        text: inputMessage,
        sender: "user",
        isTyping: false,
        created_at: new Date(),
        ...(selectedImage && { image: selectedImage }),
      },
    ]);

    setSelectedImage(null);

    if (active !== "operator") {
      setIsTyping({
        sender: "ai",
        is_typing: true,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openViewer = (imageUrl) => {
    setSelectedImageViw(imageUrl);
    setViewerOpen(true);
  };

  useEffect(() => {
    if (ID) {
      setSessionId(ID);
      createNewSession({ anon_id: ID });
    }

    if (!ID || ID === undefined || ID === "undefined") {
      clearStoredSessionId();
      setSessionId(null);
      setCount(0);
      setCountValue(0);
      setIsTypingLocal(false);
      setIsTyping(false);
      setMessages([]);
    }
  }, [ID]);

  // Typing indicator yuborish
  const sendTyping = (sessionId, isTyping = true) => {
    ws.send(
      JSON.stringify({
        type: "typing",
        session_id: sessionId,
        is_typing: isTyping,
        sender: "user",
      })
    );
  };

  const handleCahnge = (value) => {
    setInputMessage(value);

    // Agar hali typing true bo'lmasa yuboramiz
    if (!isTypingLocal && value.length > 0) {
      sendTyping(sessionId, true);
      setIsTypingLocal(true);
    }

    // Timeoutni tozalaymiz
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // 1.2 sekund yozish to'xtasa false yuboramiz
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingLocal) {
        sendTyping(sessionId, false);
        setIsTypingLocal(false);
      }
    }, 1200);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed hidden max-lg:block z-[999999] font-sans">
      <ImageViewer
        imageUrl={selectedImageViw}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />

      <div className="fixed top-0 left-0 w-full h-full bg-white shadow-main flex flex-col">
        <div className="bg-gradient-to-r from-[#0d5293] via-[#3CAB3D] to-[#42e645] p-3 px-5 text-white cursor-move select-none">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-start gap-x-2">
              <div className="w-10 h-10 bg-white  rounded-full flex items-center justify-center text-white text-sm font-bold">
                <img src={`${Bot}`} className="w-full h-full rounded-full" />
              </div>{" "}
              <p className="text-lg font-semibold m-0">MKBANK</p>
            </div>
          </div>
        </div>

    <div className="overflow-y-auto h-full pb-20 overflow-x-hidden w-full p-5 max-sm:px-2 bg-gray-50 pt-[68px]">
          {messages?.map((msg) => (
            <div
              key={msg?.id}
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
                        msg?.sender === "user" ? "text-white" : "text-gray-900"
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
                        msg?.sender === "user" ? "text-white" : "text-gray-400"
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
          ))}
          {isTyping?.sender !== "user" ? (
            isTyping?.is_typing && <IsTypengLoading sender={isTyping?.sender} />
          ) : (
            <></>
          )}
          <div ref={messagesEndRef} />
        </div>
          <div className="fixed bottom-0  left-0 right-0 !px-2 max-sm:!py-2 w-full !py-[10px] bg-white border-t border-gray-200">

          {selectedImage && (
            <div className="mb-2 w-20 h-20 relative">
              <img
                src={selectedImage}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex relative  items-center gap-2">
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 hover:bg-gray-100 top-[5px] text-gray-600 hover:text-[#18c139] rounded-full flex-shrink-0 transition-colors"
            >
              <Paperclip className="w-5 h-5 " />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="flex-1 h-full flex items-center  justify-center relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => handleCahnge(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("send")}
                rows={1}
                className="w-full p-2.5  border scrolbar  max-sm:pr-11  border-gray-300 rounded-2xl  max-sm:!text-[16px]  max-2xl:text-sm   resize-none focus:outline-none focus:border-[#18c139]"
                style={{ maxHeight: "120px", minHeight: "42px" }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isTyping.is_typing}
              className=" max-sm:p-0 absolute top-[5px]  right-1 bg-gradient-to-r from-[#0d5293] via-[#3CAB3D] to-[#42e645] text-white rounded-full hover:opacity-90 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <span className="block">
                <Sends />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
