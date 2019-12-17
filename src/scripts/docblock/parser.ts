/* eslint-disable @typescript-eslint/ban-ts-ignore */

// @ts-ignore
import docblockParser from 'docblock-parser'

interface DocBlock {
    label: string;
    description: string;
    resource: string|undefined;
    events: string[];
    security?: string;
}

const docBlockExtractor = /(\/\*\*.+?\*\/)/s

/**
 * Parses source and extracts docblock as structured object (DocBlock)
 * @param source
 * @constructor
 */
export function Parse (source: string): DocBlock {
  // Split by end of comment
  const doc = (docBlockExtractor.exec(source) || ['']).shift()
  if (!doc) {
    throw new Error('unable to parse docblock')
  }

  const { text, tags } = docblockParser({
    tags: {
      resource: docblockParser.singleParameterTag,
      event: docblockParser.multilineTilTag,
      security: docblockParser.singleParameterTag
    }
  }).parse(doc)

  const firstEol = text.indexOf('\n')

  let label = text
  let description = ''

  if (firstEol > 0) {
    label = text.substring(0, firstEol)
    description = text.substring(firstEol + 1)
  }

  return {
    label,
    description,
    resource: tags.resource,
    events: tags.event,
    security: tags.security
  }
}
