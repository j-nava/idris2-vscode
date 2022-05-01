module VSCode.GlobalState

GlobalState : Type
GlobalState = AnyPtr

public export
LanguageClient : Type
LanguageClient = AnyPtr

public export
ExtensionContext : Type
ExtensionContext = AnyPtr

%foreign "javascript:lambda:(languageClient) => require('./GlobalState').setLanguageClient(languageClient)"
export prim__setLanguageClient : LanguageClient -> PrimIO ()

%foreign "javascript:lambda:() => require('./GlobalState').getLanguageClient()"
export prim__getLanguageClient : PrimIO LanguageClient

export
setLanguageClient : HasIO io => LanguageClient -> io ()
setLanguageClient languageClient = primIO $ prim__setLanguageClient languageClient

export
getLanguageClient : HasIO io => io LanguageClient
getLanguageClient = primIO $ prim__getLanguageClient