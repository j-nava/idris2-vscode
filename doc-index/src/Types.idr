module Types

public export
record ModuleDefinition where
  constructor MkModuleDefinition
  name     : String
  defHtml  : String
  bodyHtml : String

public export
record PackageModule where
  constructor MkPackageModule
  name        : String
  filename    : String
  definitions : List ModuleDefinition

public export
record Package where
  constructor MkPackage
  name    : String
  modules : List PackageModule
