import { IntlProvider } from "next-intl";
import { LanguageProvider } from "./context/language-provider";
import Chat from "./chat/Chat";
import ReactQueryProvider from "./context/ReactQueryProvider";
import { getStoredSessionId, getStoreKEY } from "./hooks/storeg";
import { decryptAES } from "./service/crypto.service";
const VITE_OPEN_KEY = import.meta.env.VITE_OPEN_KEY;
function App() {
  const id = getStoredSessionId();
  const KEY = getStoreKEY();
  const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(
    navigator.userAgent
  );

  const KEYID = decryptAES(KEY);
  if (!id || !isMobile || KEYID !== VITE_OPEN_KEY) {
    return null;
  }

  return (
    <>
      <ReactQueryProvider>
        <LanguageProvider>
          <IntlProvider>
            <Chat />
          </IntlProvider>
        </LanguageProvider>
      </ReactQueryProvider>
    </>
  );
}

export default App;
