import type { CSSProperties } from "react"
import { ContentLayout } from "../../content-layout.tsx"

import { Button, Modal, Panel, Text, Uploader } from "rsuite"
import { PiArrowSquareIn, PiDownloadSimple, PiUploadSimple } from "react-icons/pi"
import { RootStore, useStore } from "../store.ts"
import { useState } from "react"
import { fileToString, triggerFileDownload } from "./file-utils.ts"
import { FileType } from "rsuite/esm/Uploader/Uploader"

import { deDE } from "rsuite/locales"

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "start",
}

export function SettingsRoute() {
  const state = useStore()

  const [fileList, setFileList] = useState<Array<FileType>>([])

  const [uploadedState, setUploadedState] = useState<RootStore | undefined>()
  const [showImportWarning, setShowImportWarning] = useState(false)

  function onExport() {
    triggerFileDownload("nutrition-tracker-data.json", state)
  }

  async function fileChanged(newFileList: Array<FileType>) {
    setFileList(newFileList)

    if (newFileList.length > 0) {
      const file = newFileList[0].blobFile

      if (file) {
        try {
          const contentAsString = await fileToString(file)
          const newState = JSON.parse(contentAsString)

          setUploadedState(newState)
          return
        } catch (e) {
          console.error(e)
        }
      }
    }

    setUploadedState(undefined)
  }

  function onImportClicked() {
    setShowImportWarning(true)
  }

  function onImport() {
    if (uploadedState) {
      useStore.setState(uploadedState)
    }
    setShowImportWarning(false)
  }

  return (
    <>
      <Modal open={showImportWarning} role="alertdialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>Wirklich importieren?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Möchten Sie die Daten wirklich importieren? Damit werden alle aktuelle Daten überschrieben und lassen sich
          nicht wieder herstellen.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onImport} appearance="primary">
            Ok
          </Button>
          <Button onClick={() => setShowImportWarning(false)} appearance="subtle">
            Abbrechen
          </Button>
        </Modal.Footer>
      </Modal>
      <ContentLayout header={<Text>Einstellungen</Text>}>
        <div id="settings-root">
          <Panel header="Daten sichern">
            <div style={panelContainerStyle}>
              <Text>
                Alle Daten werden ausschließlich lokal in deinem Browser gespeichert. Es wird aber dringend empfohlen,
                die Daten regelmäßig zu sichern. Um eine Sicherheitskopie deiner Daten zu erstellen, kannst du hier
                deine Daten als Datei exportieren und bei Bedarf wieder importieren.
              </Text>

              <div className="two-column-form-grid">
                <Panel header="Export" shaded>
                  <div style={panelContainerStyle}>
                    <Text>Speichert deine aktuellen Daten in eine Datei zum Download.</Text>
                    <Button startIcon={<PiDownloadSimple />} onClick={onExport}>
                      Export
                    </Button>
                  </div>
                </Panel>

                <Panel header="Import" shaded>
                  <div style={panelContainerStyle}>
                    <Text>
                      Wähle eine exportierte Datei aus und importiere die Daten. Vorsicht: Dabei werden deine aktuellen
                      Daten überschrieben!
                    </Text>

                    <div>
                      <Uploader
                        locale={{ ...deDE.Uploader, ...deDE.common, upload: "Auswählen" }}
                        startIcon={<PiUploadSimple />}
                        accept="application/json"
                        autoUpload={false}
                        action=""
                        fileList={fileList}
                        onChange={fileChanged}
                      />

                      <Button startIcon={<PiArrowSquareIn />} disabled={!uploadedState} onClick={onImportClicked}>
                        Import
                      </Button>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </Panel>
        </div>
      </ContentLayout>
    </>
  )
}
