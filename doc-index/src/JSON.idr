module JSON

import public Language.JSON
import Types

moduleDefinition : ModuleDefinition -> JSON
moduleDefinition (MkModuleDefinition name defHtml bodyHtml) =
  JObject
    [ ("name", JString name)
    , ("definition", JString defHtml)
    , ("body", JString bodyHtml)
    ]

moduleJson : PackageModule -> JSON
moduleJson (MkPackageModule name filename definitions) =
  JObject
    [ ("name", JString name)
    , ("filename", JString filename)
    , ("definitions", JArray (moduleDefinition <$> definitions))
    ]

packageJson : Package -> JSON
packageJson (MkPackage name modules) =
  JObject
    [ ("name", JString name)
    , ("modules", JArray (moduleJson <$> modules))
    ] 

export
packagesJson : List Package -> JSON
packagesJson packages =
  JObject
    [ ("packages", JArray (packageJson <$> packages))
    ]