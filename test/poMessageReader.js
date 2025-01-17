/* eslint-env mocha */

import expect from 'expect'
import poMessageReader from '../src/po2json/poMessageReader'

describe('po message reader', () => {
  let result
  const expected = {
    en: {
      'a.a': 'the a message',
      'a.b': 'the b message',
      'a.c': 'the a message',
      'b.a': 'the a message',
      'b.b': 'the b message',
      'b.c': 'the c message',
    },
    pt: {
      'a.a': 'a mensagem a',
      'a.b': 'a mensagem b',
      'a.c': 'a mensagem a',
      'b.a': 'a mensagem a',
      'b.b': 'a mensagem b',
      'b.c': 'a mensagem c',
    },
  }
  context('called with valid po files', () => {
    beforeEach(() => {
      result = poMessageReader({
        messagesPattern: '**/test_output-*.po',
        cwd: 'test/fixtures/po',
      })
    })
    it('should return all messages', () => {
      expect(result).toEqual(expected)
    })
    it('should use id as a fallback for context', () => {
      result = poMessageReader({
        messagesPattern: '**/test_output_context-*.po',
        cwd: 'test/fixtures/po',
      })
      expect(result).toEqual({
        en: {
          'the a message': 'the a message',
          'the b message': 'the b message',
          'another way of saying a': 'the a message',
          'yet another way of saying a': 'the a message',
          'another way of saying b': 'the b message',
          'the c message': 'the c message',
        },
        pt: {
          'the a message': 'a mensagem a',
          'the b message': 'a mensagem b',
          'the c message': 'a mensagem c',
          'another way of saying a': 'a mensagem a',
          'yet another way of saying a': 'a mensagem a',
          'another way of saying b': 'a mensagem b',
        },
      })
    })
  })
  context('called with invalid po files', () => {
    it('should throw for multiple messages with the same context(id)', () => {
      const fn = () => poMessageReader({
        messagesPattern: 'multiple_messages_with_same_context*.po',
        cwd: 'test/fixtures/poInvalid',
      })
      expect(fn).toThrow('More than one message was found for the context a.a')
    })
    it('should warn about ignoring plurals', () => {
      /* eslint-disable no-console */
      console.warn = expect.createSpy()
      poMessageReader({
        messagesPattern: 'message_with_plural*.po',
        cwd: 'test/fixtures/poInvalid',
      })
      expect(console.warn.calls.length).toBe(1)
      /* eslint-enable no-console */
    })
  })
})

