module Parser

import System.Path
import Data.String.Parser
import Types

packageNameP : Parser String
packageNameP = takeUntil "Package " *> takeUntil " "

packageModuleP : String -> Parser PackageModule
packageModuleP dir = do
  _ <- takeUntil "href=\""
  filename <- takeUntil "\""
  _ <- takeUntil ">"
  name <- takeUntil "<"
  _ <- takeUntil "/li>"
  pure (MkPackageModule name (dir </> filename) [])

packageP : String -> Parser Package
packageP dir = do
  packageName <- packageNameP
  _ <- takeUntil "\"names\">"
  packageModules <- many (packageModuleP dir)
  pure (MkPackage packageName packageModules)

export
parsePackage : String -> String -> Either String Package
parsePackage dir = map fst . parse (packageP dir)

------------------------------------------------------------------------

moduleDefinitionP : Parser ModuleDefinition
moduleDefinitionP = do
  _ <- takeUntil "<dt id"
  _ <- takeUntil "\">"
  defHtml <- takeUntil "</dt>"
  _ <- takeUntil "<dd>"
  bodyHtml <- takeUntil "</dd>"
  let defName = parseDefName defHtml
  pure (MkModuleDefinition (either (const "") id defName) defHtml bodyHtml)

  where
    defNameP : Parser String
    defNameP = do
      _ <- takeUntil "\"name function\">"
      takeUntil "</span>"

    parseDefName : String -> Either String String
    parseDefName = map fst . parse defNameP


moduleDefinitionsP : Parser (List ModuleDefinition)
moduleDefinitionsP = do
  _ <- takeUntil "<dl class=\"decls\">"
  many moduleDefinitionP

export
parseModuleDefinitions : String -> Either String (List ModuleDefinition)
parseModuleDefinitions = map fst . parse moduleDefinitionsP
