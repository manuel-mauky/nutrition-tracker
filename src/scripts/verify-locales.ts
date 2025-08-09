// This script will verify that all translation files
// have the same keys.
// There are TypeScript types in place which will verify that
// within the code base there are no invalid keys used.
// However, the types are taken from the english translation file.
// If any other translation file has typos or missing keys, TypeScript won't complain.

import fastGlob from "fast-glob"
import fs from "node:fs/promises"
import path from "node:path"

// @ts-expect-error the library doesn't provide typings
import keysDiff from "keys-diff"

async function main() {
  console.log("verify locales")

  const referenceLocale = JSON.parse(
    await fs.readFile(path.resolve("src", "locales", "en", "app.json"), { encoding: "utf8" }),
  )

  const paths = fastGlob.sync("./src/locales/*/app.json")

  let foundError = false

  for (const path of paths) {
    const locale = JSON.parse(await fs.readFile(path, { encoding: "utf8" }))

    const diffs = keysDiff(referenceLocale, locale)
    const missingKeys = diffs[0] as Array<Array<string>>

    if (missingKeys.length > 0) {
      console.log(`found differences in "${path}":`)
      for (const missingKey of missingKeys) {
        console.log(">", missingKey.join("."))
      }
      foundError = true
    }
  }

  if (foundError) {
    process.exit(1)
  } else {
    console.log("locales are correct")
  }
}

main()
