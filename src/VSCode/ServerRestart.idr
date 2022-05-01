module VSCode.ServerRestart

%foreign "javascript:lambda:() => require('./ServerRestart').startServerRestartService()"
prim__startServerRestartService : PrimIO ()

export
startRestartServerService : HasIO io => io ()
startRestartServerService = primIO $ prim__startServerRestartService
