const object = {
  FIRST: {
    FIRST_FIRST: "first_first",
    FIRST_SECOND: "first_second",
    FIRST_THIRD: "first_third",
    nested: {
      key: "jashgjhasgjhsag",
      foo: "bar",
    },
  },
  SECOND: {
    SECOND_FIRST: "second_first",
    SECOND_SECOND: "second_second",
    SECOND_THIRD: "second_third",
  },
  THIRD: {
    THIRD_FIRST: "third_first",
    THIRD_SECOND: "third_second",
    THIRD_THIRD: "third_third",
  },
} as const;

type Prettify<T> = {
  [k in keyof T]: T[k];
};

type ObjectValues<T extends object> = T[keyof T];

type LiteralFromObjectsAssertion = ObjectValues<typeof object.SECOND>;

type LiteralFromNestedObjectsAssertion = ObjectValues<{
  FIRST: ObjectValues<typeof object.FIRST>;
  SECOND: ObjectValues<typeof object.SECOND>;
  THIRD: ObjectValues<typeof object.THIRD>;
}>;

type NestedValuesFromScratch<T extends object> = Prettify<
  {
    [k in keyof T]: T[k] extends object ? NestedValuesFromScratch<T[k]> : T[k];
  }[keyof T]
>;

type Values = NestedValuesFromScratch<typeof object>;

type NestedKeysFromScratch<T extends object> =
  | keyof T
  | {
      [k in keyof T]: T[k] extends object ? NestedKeysFromScratch<T[k]> : k;
    }[keyof T];

type NestedKeysFromScratchWithPrefix<
  T extends object,
  TPrefix extends string = ""
> =
  | keyof T
  | {
      [k in keyof T]: T[k] extends object
        ? NestedKeysFromScratchWithPrefix<
            T[k],
            k extends string
              ? k
              : TPrefix extends ""
              ? k
              : k extends string
              ? `${TPrefix}.${k}`
              : k
          >
        : TPrefix extends ""
        ? k
        : k extends string
        ? `${TPrefix}.${k}`
        : k;
    }[keyof T];

type NestedConfiguration = {
  object: object;
  prefix?: string;
  separator?: string;
};

type WithPrefix<
  TConfiguration extends NestedConfiguration,
  TKey
> = TKey extends string
  ? TConfiguration["prefix"] extends string
    ? `${TConfiguration["prefix"]}${TConfiguration["separator"] extends string
        ? TConfiguration["separator"]
        : "."}${TKey}`
    : TKey
  : undefined;

type FilterKeysByType<T extends object, TType> = ObjectValues<{
  [TKey in keyof T]: T[TKey] extends TType ? TKey : never;
}>;

type OnlyKeysWithObjectsAsValues<T extends object> = FilterKeysByType<
  T,
  object
>;

type OnlyKeysWithObjectsAsValuesAssertion = OnlyKeysWithObjectsAsValues<
  typeof object.FIRST
>;

type AddPrefixToLiterals<
  T extends string,
  TPrefix extends string
> = `${TPrefix}${T}`;

type AddPrefixToLiteralsAssertion = AddPrefixToLiterals<
  "nested" | "test",
  "FIRST"
>;

type NestedKeysFromScratchWithConfiguration<
  TConfiguration extends NestedConfiguration
> =
  | (FilterKeysByType<TConfiguration["object"], object> extends string
      ? WithPrefix<
          TConfiguration,
          FilterKeysByType<TConfiguration["object"], object>
        >
      : never)
  | {
      [TKey in keyof TConfiguration["object"]]: TConfiguration["object"][TKey] extends object
        ? NestedKeysFromScratchWithConfiguration<{
            object: TConfiguration["object"][TKey];
            prefix: WithPrefix<TConfiguration, TKey>;
            separator: TConfiguration["separator"];
          }>
        : WithPrefix<TConfiguration, TKey>;
    }[keyof TConfiguration["object"]];

type Keys = Prettify<NestedKeysFromScratch<typeof object>>;
type KeysWithPrefix = Prettify<NestedKeysFromScratch<typeof object>>;

const getKeys = <
  T extends NestedKeysFromScratchWithConfiguration<{ object: typeof object }>
>(
  k: T
) => {};

getKeys("FIRST.nested");
