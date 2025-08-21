type PredicateFn =(key: Objectkey) => boolean



//dmitripavlutin.com/typescript-index-signatures/
type FilteringParameter =
  | string
  | number
  | RegExp
  | string[]
  | PredicateFn
  | undefined

type Objectkey = string | number | boolean

type keyValuePair = [Objectkey, unknown | undefined]

type MergeConfig = {select : FilteringParameter[], merge: (key: Objectkey, value: unknown, path? : Objectkey[]) => object}
