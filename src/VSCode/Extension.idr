module VSCode.Extension

import VSCode.GlobalState
import VSCode.LanguageClient
import VSCode.ServerRestart

%nomangle "activate"
activate : ExtensionContext -> ()
activate context = unsafePerformIO $ do
  languageClient <- mkLanguageClient
  startLanguageServer context languageClient
  startRestartServerService

%nomangle "deactivate"
deactivate : ()
deactivate = unsafePerformIO $ do
  languageClient <- getLanguageClient
  stopLanguageServer languageClient

main : IO ()
main = pure ()
