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
import { useTranslation } from "react-i18next"

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "start",
}

export function SettingsRoute() {
  const { t } = useTranslation()
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
          <Modal.Title>{t("settings.importDataDialogTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("settings.importDataDialogHint")}</Modal.Body>
        <Modal.Footer>
          <Button onClick={onImport} appearance="primary">
            {t("common.ok")}
          </Button>
          <Button onClick={() => setShowImportWarning(false)} appearance="subtle">
            {t("common.cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
      <ContentLayout header={<Text>{t("settings.title")}</Text>}>
        <div id="settings-root">
          <Panel header={t("settings.dataPersistenceSubTitle")}>
            <div style={panelContainerStyle}>
              <Text>{t("settings.persistenceHint1")}</Text>

              <Text>{t("settings.persistenceHint2")}</Text>
              {isPersistedEnabled ? (
                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                  <PiCheckCircle size="20" style={{ color: "var(--rs-state-success)" }} />{" "}
                  {t("settings.persistencePermissionGranted")}
                </div>
              ) : (
                <div>
                  <Text>{t("settings.persistencePermissionHint1")}</Text>
                  <Button onClick={onRequestPersisted}>{t("settings.persistencePermissionButton")}</Button>
                </div>
              )}
              <Text>{t("settings.persistenceHint3")}</Text>

              <div className="two-column-form-grid">
                <Panel header="Export" shaded>
                  <div style={panelContainerStyle}>
                    <Text>{t("settings.persistenceExportHint1")}</Text>
                    <Button startIcon={<PiDownloadSimple />} onClick={onExport}>
                      {t("settings.exportButton")}
                    </Button>
                  </div>
                </Panel>

                <Panel header="Import" shaded>
                  <div style={panelContainerStyle}>
                    <Text>{t("settings.persistenceImportHint1")}</Text>

                    <div>
                      <Uploader
                        locale={{ ...deDE.Uploader, ...deDE.common, upload: t("settings.chooseFileButton") }}
                        startIcon={<PiUploadSimple />}
                        accept="application/json"
                        autoUpload={false}
                        action=""
                        fileList={fileList}
                        onChange={fileChanged}
                      />

                      <Button startIcon={<PiArrowSquareIn />} disabled={!uploadedState} onClick={onImportClicked}>
                        {t("settings.importButton")}
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
