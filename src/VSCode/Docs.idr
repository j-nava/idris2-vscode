module VSCode.Docs

import Language.JSON

%foreign "javascript:lambda:require('./doc-index.json')"
prim__docs : String

item : String -> JSON
item l = JObject 
  [ ("label", JString l)
  , ("description", JString "descr")
  , ("detail", JString "detail")
  ]

%nomangle "searchDocs"
searchDocs : String -> String
-- searchDocs _ = show $ JArray (item <$> [ "test 1", "test 2" ]) 
searchDocs _ = prim__docs

