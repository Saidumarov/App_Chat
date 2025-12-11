import { IntlProvider } from "next-intl";
import { LanguageProvider } from "./context/language-provider";
import Chat from "./chat/Chat";
import ReactQueryProvider from "./context/ReactQueryProvider";
function App() {
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
