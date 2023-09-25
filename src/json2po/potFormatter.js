const escapeString = (str) => str.replace(/"/g, '\\"')

const buildMessage = (
  copyDefaultTranslation,
  excludeMsgctxt,
  sourceReferenceWithColon,
  excludeDescription) => ({
  reference,
  description,
  id,
  defaultMessage,
  translatedMessage,
}) => {
    let entry = [
      `#${sourceReferenceWithColon ? ': ' : ' '}${reference}`]
    if (!excludeDescription) {
      entry = [`#. ${description}`, ...entry]
    }
    if (!excludeMsgctxt) {
      entry.push(`msgctxt "${escapeString(id)}"`)
    }
    entry = [...entry,
    `msgid "${escapeString(defaultMessage)}"`,
    `msgstr "${copyDefaultTranslation ? escapeString(translatedMessage || defaultMessage) : ''}"`,
    '']
    return entry.join('\n')
  }

export default (messages, {
  copyDefaultTranslation,
  header = '',
  excludeMsgctxt = false,
  sourceReferenceWithColon = false,
  excludeDescription = false,
  sortResults = true,
} = {}) => {
  const body = (sortResults
    ? messages.sort((msg1, msg2) => `${msg1.reference}${msg1.id}`.localeCompare(`${msg2.reference}${msg2.id}`))
    : messages)
      .map(buildMessage(
      copyDefaultTranslation,
      excludeMsgctxt,
      sourceReferenceWithColon,
      excludeDescription))
    .join('\n')
  return header ? [header, '', body].join('\n') : body
}
