export function triggerFileDownload(fileName: string, fileContent: unknown) {
  const contentAsString = JSON.stringify(fileContent, null, 2)

  const blob = new Blob([contentAsString], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = fileName
  link.href = url
  link.click()
}

export async function fileToString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsText(file, "UTF-8")
    reader.addEventListener("load", (event) => {
      if (event?.target?.result) {
        const result = event.target.result

        if (typeof result === "string") {
          resolve(result)
        } else {
          reject("cannot read file content")
        }
      } else {
        reject("cannot read file content")
      }
    })
    reader.addEventListener("error", reject)
  })
}
