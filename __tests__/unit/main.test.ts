import { describe, it, expect } from 'vitest';

import { RefactzooDataManipulation } from '../../src/main.js'

/**
 * @jest-environment node
 */

// Example: Zoo with animals

describe('zoo', () => {
  it('instanciate', () => {
    const zoo = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }
    const zooTree = new RefactzooDataManipulation(zoo)
  })

  it('return the same object', () => {
    const data = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
      girafe: {
        ageinMonth: 600,
        name: 'Gerard',
      },
    }
    const result = new RefactzooDataManipulation(data).reduce()

    expect(result).toEqual(data)
  })

  it('sort on string', () => {
    const data = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }

    const expected = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }

    const result = new RefactzooDataManipulation(data).reduce(['whale'])

    expect(result).toEqual(expected)
  })

  it('sort on regexp', () => {
    const data = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }

    const expected = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }

    const result = new RefactzooDataManipulation(data).reduce([/whale/])

    expect(result).toEqual(expected)
  })

  it('sort on function', () => {
    const data = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }

    const expected = {
      whale: {
        name: 'MObye',
        ageinYear: 20,
      },
    }

    const result = new RefactzooDataManipulation(data).reduce([() => true])

    expect(result).toEqual(expected)
  })

  it('may_rearrange_key', () => {
    const input = {
      cp_vec: {
        a3: 12,
        a7: 14,
      },
      cp_win_rate_vec: {
        a3: 16,
        a7: 18,
      },
    }

    const expected = {
      a3: {
        coup: "a3",
        cp: 12,
        win_rate: 16,
      },

      a7: {
        cp: 14,
        coup: "a7",
        win_rate: 18,
      },
    }

    const api_test = [
  {
    select: ['cp_vec'],
      //@ts-expect-error

    merge: (key: value, value: any) => ({
      [key]: {
        cp: value,
        coup: key,
      },
    }),
  },

  {
    select: ['cp_win_rate_vec'],
      //@ts-expect-error

    merge: (key: value, value: any) => ({
      [key]: {
        win_rate: value,
      },
    }),
  },
]

    const result = new RefactzooDataManipulation(input).merge(api_test)

    expect(result).toEqual(expected)

  })
})
