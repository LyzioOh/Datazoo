import { deepmergeInto } from 'deepmerge-ts';
import {
  FilteringParameter,
  Objectkey,
  keyValuePair,
  MergeConfig,
} from './types.ts';

function* objectKeyPairGenerator(
  object: object,
  filterParameter?: FilteringParameter,
): Generator<keyValuePair, string, undefined> {
  let keys;

  if (filterParameter == undefined) {
    for (const keyValuePair of Object.entries(object)) {
      yield keyValuePair;
    }
  } else if (
    typeof filterParameter == 'string' ||
    typeof filterParameter == 'number'
  ) {
    if (Object.hasOwn(object, filterParameter)) {
      const keyValuePair = [filterParameter, object[filterParameter]];

      console.log(keyValuePair);

      yield keyValuePair;
    }
  } else if (filterParameter instanceof RegExp) {
    keys = Object.keys(object).filter((key) => filterParameter.test(key));

    for (const key of keys) {
      if (Object.hasOwn(object, key)) {
        const keyValuePair = [key, object[key]];

        yield keyValuePair;
      }
    }
  } else if (filterParameter instanceof Array) {
    keys = filterParameter;

    for (const key of keys) {
      if (Object.hasOwn(object, key)) {
        const keyValuePair = [key, object[key]];

        yield keyValuePair;
      }
    }
  } else if (filterParameter instanceof Function) {
    keys = Object.keys(object).filter((key) => filterParameter(key));

    for (const key of keys) {
      if (Object.hasOwn(object, key)) {
        const keyValuePair = [key, object[key]];

        yield keyValuePair;
      }
    }
  }
  return 'Done';
}

const toNestedObject = (path: Objectkey[], value: unknown): object =>
  path.reduceRight((acc, key) => ({ [key]: acc }), value);

export class RefactzooDataManipulation {
  private data: Record<string, object>;

  constructor(obj: Record<string, object>) {
    this.data = obj;
  }

  public reduce(
    filters?: FilteringParameter[],
    reducteur: (
      path: Objectkey[],
      value: unknown,
      lastKey: Objectkey,
    ) => object = toNestedObject,
  ): object {
    const acc = {};

    this.explore(
      (path, value, key) => deepmergeInto(acc, reducteur(path, value, key)),
      filters,
    );
    return acc;
  }

  /**
   * Recursively traverses all properties of the object.
   * @param callback Function called for each property (key, value, path).
   */
  public explore(
    callbackFn: (path: Objectkey[], value: Objectkey, key: Objectkey) => void,
    filters?: FilteringParameter[],
  ): void {
    this._explore(this.data, [], callbackFn, filters);
  }

  public merge(builders: MergeConfig[]): object {
    const result = {};

    for (const builder of builders) {
      let select = builder.select;

      select = select.map((value) => {
        if (value.startsWith('@@/Re/')) {
          return new RegExp(value.slice(6));
        } else {
          return value;
        }
      });

      console.log(select);

      const merge = builder.merge;

      const current_result = this.reduce(select, (path, value, key) =>
        merge(key, value, path),
      );

      deepmergeInto(result, current_result);
    }

    return result;
  }

  private _explore(
    obj: object,
    path: Objectkey[],
    callbackFn: (key: Objectkey[], value: unknown, path: Objectkey) => void,
    filters?: FilteringParameter[],
  ): void {
    const filter = filters && filters[path.length];
    const generator = objectKeyPairGenerator(obj, filter);

    for (const [key, value] of generator) {
      const currentPath = [...path, key];

      if (typeof value === 'object') {
        this._explore(value, currentPath, callbackFn, filters);
      } else {
        callbackFn(currentPath, value, key);
      }
    }
  }
}
