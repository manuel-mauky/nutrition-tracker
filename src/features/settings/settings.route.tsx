import { CSSProperties, useEffect } from "react"
import { ContentLayout } from "../../content-layout.tsx"

import { Button, Modal, Panel, Text, Uploader } from "rsuite"
import { PiArrowSquareIn, PiCheckCircle, PiDownloadSimple, PiUploadSimple } from "react-icons/pi"
import { RootStore, useStore } from "../store.ts"
import { useState } from "react"
import { fileToString, triggerFileDownload } from "./file-utils.ts"
import { FileType } from "rsuite/esm/Uploader/Uploader"

import { deDE } from "rsuite/locales"
import { migrate } from "../../storage.ts"

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

  const [isPersistedEnabled, setIsPersistedEnabled] = useState(false)

  useEffect(() => {
    navigator.storage.persisted().then((result) => {
      setIsPersistedEnabled(result)
    })
  }, [])

  function onExport() {
    const version = useStore.persist.getOptions().version

    const file = {
      version,
      state,
    }

    triggerFileDownload("nutrition-tracker-data.json", file)
  }

  async function fileChanged(newFileList: Array<FileType>) {
    setFileList(newFileList)

    if (newFileList.length > 0) {
      const file = newFileList[0].blobFile

      if (file) {
        try {
          const contentAsString = await fileToString(file)
          const contentAsJson = JSON.parse(contentAsString)

          const { version, state: newState } = contentAsJson

          const migratedState = await migrate(newState, version)

          // todo: Maybe should do _some_ runtime typeschecking to see if it's really a RootStore
          setUploadedState(migratedState as RootStore)
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

  async function onRequestPersisted() {
    const isPersisted = await navigator.storage.persist()
    setIsPersistedEnabled(isPersisted)
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
          <Panel header="Datenspeicher">
            <div style={panelContainerStyle}>
              <Text>
                Nutrition-Tracker speichert bewusst keine deiner Daten auf irgendeinem Server. Alle Daten werden
                ausschließlich lokal in deinem Browser gespeichert. Damit ist allerdings ein gewisses Risiko verbunden,
                dass Daten verloren gehen könnten, beispielsweise wenn du die Seite lange nicht mehr besucht hast oder
                du die Browser-History oder Cookies löschst.
              </Text>
              <Text>Du kannst Nutrition-Tracker erlauben, Daten langfristig lokal im Browser zu speichern.</Text>
              {isPersistedEnabled ? (
                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                  <PiCheckCircle size="20" style={{ color: "var(--rs-state-success)" }} /> Erlaubnis bereits erteilt
                </div>
              ) : (
                <div>
                  <Text>
                    Wenn du diesen Button klickst, fragt dich dein Browser eventuell nach, ob du dies gestatten
                    möchtest.
                  </Text>
                  <Button onClick={onRequestPersisted}>Dauerhafte Speicherung erlauben?</Button>
                </div>
              )}
              <Text>
                Allerdings ist auch das keine absolute Garantie. Es wird daher dringend empfohlen, die Daten regelmäßig
                zu sichern. Um eine Sicherheitskopie deiner Daten zu erstellen, kannst du hier deine Daten als Datei
                exportieren und bei Bedarf wieder importieren. <br />
                Damit kannst du deine Daten auch zu einem anderen Browser oder Computer mitnehmen.
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
