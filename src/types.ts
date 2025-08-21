export type PredicateFn = (key: Objectkey) => boolean;

//dmitripavlutin.com/typescript-index-signatures/
export type FilteringParameter =
  | string
  | number
  | RegExp
  | string[]
  | PredicateFn
  | undefined;

export type Objectkey = string | number | boolean;

export type keyValuePair = [Objectkey, unknown | undefined];

export type MergeConfig = {
  select: FilteringParameter[];
  merge: (key: Objectkey, value: unknown, path?: Objectkey[]) => object;
};
