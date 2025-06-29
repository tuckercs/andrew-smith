import { CheckmarkIcon } from '@sanity/icons'

export default function SaveAction(originalPublishAction) {
  const SaveAction = (props) => {
    const originalResult = originalPublishAction(props)
    const label = {
      Publish: 'Save',
      Published: 'Saved',
      'Publishing…': 'Saving…',
    }
    return {
      ...originalResult,
      label: label[originalResult.label] || 'Save',
      icon: CheckmarkIcon,
    }
  }
  return SaveAction
}
