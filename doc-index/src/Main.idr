module Main

import Data.Either
import Data.Maybe
import Data.List
import System.Path
import System.Directory
import System
import Parser
import Types
import JSON

libDirCmd : String
libDirCmd = "idris2 --libdir"

docDir : String -> String
docDir libdir = libdir </> "docs"

importPackage : String -> IO (Maybe Package)
importPackage dir =
  readFile indexFilename >>=
    pure . join . map (getRight . parsePackage dir) . getRight

  where
    indexFilename : String
    indexFilename = dir </> "index.html"

importPackageModuleDefinitions : PackageModule -> IO PackageModule
importPackageModuleDefinitions packageModule = do
  definitions <- readFile packageModule.filename >>=
    pure . join . map (getRight . parseModuleDefinitions) . getRight
  pure ({ definitions := fromMaybe packageModule.definitions definitions } packageModule)

importPackageDefinitions : Package -> IO Package
importPackageDefinitions package = 
  pure ({ modules := !(traverse importPackageModuleDefinitions package.modules) } package)

generate : String -> IO ()
generate libdir = do
  docDirs <- enumDocDirs . pack . filter (/= '\n') . unpack $ libdir
  packages <- catMaybes <$> traverse importPackage docDirs
  packagesWithDefinitions <- traverse importPackageDefinitions packages
  let json = packagesJson packagesWithDefinitions
  _ <- writeFile "build/output.json" (show json)
  pure ()

  where

    enumDocDirs : String -> IO (List String)
    enumDocDirs libdir = do
      listDir docDir' >>= \case
        Left _ => do
          putStrLn ("Directory not found " ++ docDir')
          pure []
        Right dirs => pure ((docDir' </>) <$> dirs)
      where
        docDir' : String
        docDir' = docDir libdir


main : IO ()
main = do
  (libdir, result) <- run libDirCmd

  case result of
    0 => generate libdir
    _ => putStrLn ("Error running " ++ libDirCmd)
