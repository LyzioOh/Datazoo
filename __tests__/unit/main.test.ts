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
    new RefactzooDataManipulation(zoo)
    expect(1).toEqual(1)
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

    const result = new RefactzooDataManipulation(data).reduce([() : boolean => true])

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
      //@ts-expect-error coucou

    merge: (key: value, value: unknown) : object => ({
      [key]: {
        cp: value,
        coup: key,
      },
    }),
  },

  {
    select: ['cp_win_rate_vec'],
      //@ts-expect-error coucou

    merge: (key: value, value: unknown) : object => ({
      [key]: {
        win_rate: value,
      },
    }),
  },
]

    const result = new RefactzooDataManipulation(input).merge(api_test)

    expect(result).toEqual(expected)

  })

  it(`Handle regexp`, () => {
    const input = {
      maia_kdd_1100: {
        value: 0.6353,
        policy: {
          e7e5: 0.4401793721973094,
          d7d5: 0.24666239590006406,
          e7e6: 0.06613709160794362,
          g8f6: 0.04819987187700192,
        }
      },
      maia_kdd_1200: {
        value: 0.6305,
        policy: {
          e7e5: 0.4129720697970266,
          d7d5: 0.24668198302542388,
          e7e6: 0.0746387681090626,
          g8f6: 0.05179714052442706,
        },
      },
      maia_kdd_1300: {
        value: 0.6465,
        policy: {
          e7e5: 0.38387311597058943,
          d7d5: 0.24358852389948218,
          e7e6: 0.08238763777708313,
          g8f6: 0.05867163185147936,
        },
      }}



    const result = new RefactzooDataManipulation(input).merge([

  {
    select: ["@@/Re/maia_kdd", "policy"],
    merge: (key: string, value: any, path) => ({ [key] : { [path[0]] : value }})
  },


  ])

    const expected =  {
  "d7d5":  {
    "maia_kdd_1100": 0.24666239590006406,
    "maia_kdd_1200": 0.24668198302542388,
    "maia_kdd_1300": 0.24358852389948218,
  },
  "e7e5":  {
    "maia_kdd_1100": 0.4401793721973094,
    "maia_kdd_1200": 0.4129720697970266,
    "maia_kdd_1300": 0.38387311597058943,
  },
  "e7e6":  {
    "maia_kdd_1100": 0.06613709160794362,
    "maia_kdd_1200": 0.0746387681090626,
    "maia_kdd_1300": 0.08238763777708313,
  },
  "g8f6":  {
    "maia_kdd_1100": 0.04819987187700192,
    "maia_kdd_1200": 0.05179714052442706,
    "maia_kdd_1300": 0.05867163185147936,
  },
}

    expect(result).toEqual(expected)




}





)}



  )
