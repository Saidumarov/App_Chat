import { IntlProvider } from "next-intl";
import { LanguageProvider } from "./context/language-provider";
import Chat from "./chat/Chat";
import ReactQueryProvider from "./context/ReactQueryProvider";
import { getStoredSessionId } from "./hooks/storeg";
function App() {
  const id = getStoredSessionId();
  const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(
    navigator.userAgent
  );
  if (!id || !isMobile) {
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
