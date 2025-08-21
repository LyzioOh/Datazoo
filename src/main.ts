//@ts-expect-error

import { deepmergeInto } from 'deepmerge-ts'

type Path = Objectkey[]

//dmitripavlutin.com/typescript-index-signatures/
type FilteringParameter =
  | string
  | number
  | RegExp
  | string[]
  | Function
  | undefined

type Objectkey = string | number | boolean
type keyValuePair = [Objectkey, any | undefined]

type MergeConfig = {select : FilteringParameter[], merge: (key: Objectkey, value: any, path? : Objectkey[]) => object}

function* objectKeyPairGenerator(
  object: Object,
  filterParameter?: FilteringParameter
): Generator<keyValuePair, string, undefined> {
  let keys

  if (filterParameter == undefined) {
    for (const keyValuePair of Object.entries(object)) {
      yield keyValuePair
    }
  } else if (
    typeof filterParameter == 'string' ||
    typeof filterParameter == 'number'
  ) {
    if (object.hasOwnProperty(filterParameter)) {
      //@ts-expect-error

      const keyValuePair = [filterParameter, object[filterParameter]]

      console.log(keyValuePair)

      //@ts-expect-error

      yield keyValuePair
    }
  } else if (filterParameter instanceof RegExp) {
    keys = Object.keys(object).filter((key) => filterParameter.test(key))

    for (const key of keys) {
      if (object.hasOwnProperty(key)) {
        //@ts-expect-error

        const keyValuePair = [key, object[key]]
        //@ts-expect-error

        yield keyValuePair
      }
    }
  } else if (filterParameter instanceof Array) {
    keys = filterParameter

    for (const key of keys) {
      if (object.hasOwnProperty(key)) {
        //@ts-expect-error

        const keyValuePair = [key, object[key]]
        //@ts-expect-error

        yield keyValuePair
      }
    }
  } else if (filterParameter instanceof Function) {
    keys = Object.keys(object).filter((key) => filterParameter(key))

    for (const key of keys) {
      if (object.hasOwnProperty(key)) {
        //@ts-expect-error

        const keyValuePair = [key, object[key]]
        //@ts-expect-error

        yield keyValuePair
      }
    }
  }
  return 'Done'
}

const toNestedObject = (path: Objectkey[], value: any): Function =>
  //@ts-expect-error
  path.reduceRight((acc, key) => ({ [key]: acc }), value)

export class RefactzooDataManipulation {
  private data: Record<string, any>

  constructor(obj: Record<string, any>) {
    this.data = obj
  }

  public reduce(
    filters?: FilteringParameter[],
    reducteur: (
      path: Objectkey[],
      value: any,
      lastKey: Objectkey
    ) => object = toNestedObject
  ): object {
    let acc = {}

    this.explore(
      (path, value, key) => deepmergeInto(acc, reducteur(path, value, key)),
      filters
    )
    return acc
  }

  /**
   * Recursively traverses all properties of the object.
   * @param callback Function called for each property (key, value, path).
   */
  public explore(
    callbackFn: (path: Objectkey[], value: Objectkey, key: Objectkey) => void,
    filters?: FilteringParameter[]
  ): void {
    this._explore(this.data, [], callbackFn, filters)
  }

  public merge(
    builders: MergeConfig[]
  ): object {
    /**
    console.log(filteringParameter)

    const parsedFilteringParameter = filteringParameter.map(value => {


      /**
      if (value.startsWith('@@/Re/')) {
        return new RegExp(value.slice(5))

      }
      else {
        return value
      }
    })
    console.log(parsedFilteringParameter)
    const buildFunction = builder[1]

    */

    let result = {}


    for(const builder of builders) {

      const select = builder.select
      const merge = builder.merge

      const current_result = this.reduce(select, (path, value, key) =>
      merge(key, value, path))

      deepmergeInto(result, current_result)
}

    return result


  }

  private _explore(
    obj: Record<string, any>,
    path: Objectkey[],
    callbackFn: (key: Objectkey[], value: any, path: Objectkey) => void,
    filters?: FilteringParameter[]
  ): void {
    const filter = filters && filters[path.length]
    const generator = objectKeyPairGenerator(obj, filter)

    for (let [key, value] of generator) {
      const currentPath = [...path, key]

      if (typeof value === 'object') {
        this._explore(value, currentPath, callbackFn, filters)
      } else {
        console.log(value, key)
        callbackFn(currentPath, value, key)

        callbackFn(currentPath, value, key)
      }
    }
  }
}
