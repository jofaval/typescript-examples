const ExampleObject = {
  OVERALL: "top-level/first-level",
  NESTED: {
    LEVEL_TWO: "the two towers",
    LEVEL_THREE: {
      THE: "return of the king",
    },
  },
} as const;

// https://stackoverflow.com/questions/67214581/typescript-get-union-type-of-nested-object-keys
type NestedKeys<T> = T extends object
  ? { [K in keyof T]-?: K | NestedKeys<T[K]> }[keyof T]
  : never;

type UnionKeysFromExampleObject = NestedKeys<typeof ExampleObject>;

const PossibleKeys: UnionKeysFromExampleObject[] = [
  "LEVEL_THREE",
  "LEVEL_TWO",
  "NESTED",
  "OVERALL",
  "THE",
  // @ts-expect-error
  "NON-EXISTENT",
];

type RecursiveRecord = {
  [key in PropertyKey]: string | RecursiveRecord;
};

type NestedValues<T extends RecursiveRecord, K = keyof T> = K extends string
  ? T[K] extends string
    ? T[K]
    : T[K] extends RecursiveRecord
    ? NestedValues<Extract<T[K], RecursiveRecord>>
    : never
  : never;

type UnionValuesFromExampleObject = NestedValues<typeof ExampleObject>;

const PossibleValues: UnionValuesFromExampleObject[] = [
  "top-level/first-level",
  "the two towers",
  "return of the king",
  // @ts-expect-error
  "non-existent",
];
