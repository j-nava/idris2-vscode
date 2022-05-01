module VSCode.LanguageClient

import VSCode.GlobalState

%foreign "javascript:lambda:() => require('./LanguageClient').mkLanguageClient()"
prim__mkLanguageClient : PrimIO LanguageClient

%foreign "javascript:lambda:(context, languageClient) => require('./LanguageClient').startLanguageServer(context, languageClient)"
prim__startLanguageServer : ExtensionContext -> LanguageClient -> PrimIO ()

%foreign "javascript:lambda:(languageClient) => require('./LanguageClient').stopLanguageServer(languageClient)"
prim__stopLanguageServer : LanguageClient -> PrimIO ()

export
mkLanguageClient : HasIO io => io LanguageClient
mkLanguageClient = primIO $ prim__mkLanguageClient

export
startLanguageServer : HasIO io => ExtensionContext -> LanguageClient -> io ()
startLanguageServer context languageClient = primIO $ prim__startLanguageServer context languageClient

export
stopLanguageServer : HasIO io => LanguageClient -> io ()
stopLanguageServer languageClient = primIO $ prim__stopLanguageServer languageClient
