import { ContentLayout } from "../../content-layout.tsx"
import { Text } from "rsuite"

export function DiaryRoute() {
  return (
    <ContentLayout header={<Text>Tagebuch</Text>}>
      <p>tagebuch content</p>
    </ContentLayout>
  )
}
