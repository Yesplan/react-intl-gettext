import { sync as globSync } from 'glob'
import { join } from 'path'
import { readFileSync } from 'fs'
import { po } from 'gettext-parser'

const newNameMatcher = (regex) => (filename) => filename.match(regex)[1]

export const defaultNameMatcherPatternString = '.*-(.*)\\.po$'
export const defaultPattern = '**/*.po'

export default ({
  messagesPattern = defaultPattern,
  cwd = process.cwd(),
  langMatcherPattern = defaultNameMatcherPatternString,
  langMatcher = newNameMatcher(langMatcherPattern),
  ignore,
}) => {
  const translations = globSync(messagesPattern, { cwd, ignore }).map((filename) => {
    const { translations: contexts } = po.parse(readFileSync(join(cwd, filename)), 'utf-8')
    const translationsToProcess = Object.keys(contexts)
    const mergedTranslations = translationsToProcess.reduce((messagesForLanguage, contextName) => {
      const extendMessagesForLanguage = { ...messagesForLanguage }
      if (contextName !== '' && Object.entries(contexts[contextName]).length > 1) {
        throw new Error(`More than one message was found for the context ${contextName}`)
      }
      Object.entries(contexts[contextName]).forEach(([msgId, msgObject]) => {
        let id = msgId
        if (contextName !== '' && contextName !== msgId) {
          id = contextName
        }
        if (msgId === '') { /* Ignore entries with empty string as key, which store meta data */
          return
        }
        if (msgObject.msgstr.length > 1) {
            /* eslint-disable no-console */
          console.warn(`Plural definitions were found for the context ${contextName}.
               Plurals are ignored!`)
            /* eslint-enable no-console */
        }
        extendMessagesForLanguage[id] = msgObject.msgstr[0]
      })
      return extendMessagesForLanguage
    }, {})
    return {
      [langMatcher(filename)]: mergedTranslations,
    }
  })
  return translations.reduce(
    (acc, nextFile) => ({
      ...acc,
      ...nextFile,
    }),
    {}
  )
}
