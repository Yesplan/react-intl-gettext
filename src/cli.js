#! /usr/bin/env node

import { writeFileSync } from 'fs'
import program from 'commander'
import headerFormatter from './json2po/headerFormatter'
import potFormatter from './json2po/potFormatter'
import messageReader from './json2po/jsonMessageReader'
import poMessageReader, {
  defaultPattern,
  defaultNameMatcherPatternString,
} from './po2json/poMessageReader'
import {
  getUserPackageJson,
  buildVersionFromPackageJson,
  getRepositoryUrlFromPackageJson,
} from './utils'

const list = value => value.split(',')
const userPkg = getUserPackageJson()

program
  .command('json2pot <src> <dest>')
  .description('converts react-intl extracted json to po/pot')
  .option(
    '-p, --pattern [pattern]',
    'glob pattern used to find the src files [**/*.json]',
    '**/*.json'
  )
  .option(
    '-d, --use-default <lang>',
    'use defaultMessage as msgstr and use <lang> as value for Language header field'
  )
  .option(
    '-i, --ignore <patterns>',
    'add a pattern or an array of glob patterns to exclude matches'
  )
  .option(
    '--project-id-version [version]',
    `set the value of Project-Id-Version header field [${buildVersionFromPackageJson(userPkg)}]`,
    buildVersionFromPackageJson(userPkg)
  )
  .option(
    '--report-msgid-bugs-to [url]',
    `set the value of Report-Msgid-Bugs-to header field [${getRepositoryUrlFromPackageJson(
      userPkg
    )}]`,
    getRepositoryUrlFromPackageJson(userPkg)
  )
  .option(
    '--exclude-msgctxt',
    'exclude the msgctxt field for entries'
  )
  .option(
    '--source-reference-with-colon',
    'use the #: sourcereference format instead of # sourcereference'
  )
  .option(
    '--exclude-description',
    'exclude the #. description field for entries'
  )
  .action((src, dest, {
    pattern,
    useDefault,
    ignore,
    projectIdVersion,
    reportMsgidBugsTo,
    excludeMsgctxt,
    sourceReferenceWithColon,
    excludeDescription,
    }) => {
    writeFileSync(
      dest,
      potFormatter(
        messageReader({ cwd: src, messagesPattern: pattern, ignore }),
        {
          copyDefaultTranslation: !!useDefault,
          header: headerFormatter({
            projectIdVersion,
            reportMsgidBugsTo,
            language: useDefault,
          }),
          excludeMsgctxt,
          sourceReferenceWithColon,
          excludeDescription,
        }
      )
    )
  })

program
  .command('po2json <src> <dest>')
  .description('converts po files to json')
  .option(
    '-p, --pattern [pattern]',
    `glob pattern used to find the src files [${defaultPattern}]`,
    defaultPattern
  )
  .option('--pretty', 'pretty print json')
  .option(
    '-i, --ignore <patterns>',
    'add a pattern or an array of glob patterns to exclude matches',
    list
  )
  .option(
    '--lang-matcher-pattern [lang-matcher-pattern]',
    `pattern used to match the language from the file name [${defaultNameMatcherPatternString}]`,
    defaultNameMatcherPatternString
  )
  .action((src, dest, { pattern, pretty, ignore, langMatcherPattern }) => {
    writeFileSync(
      dest,
      JSON.stringify(
        poMessageReader({
          cwd: src,
          messagesPattern: pattern,
          langMatcherPattern,
          ignore,
        }),
        null,
        pretty ? '  ' : undefined
      )
    )
  })

program.parse(process.argv)
