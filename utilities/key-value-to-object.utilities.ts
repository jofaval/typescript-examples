import { MergeAll } from "ts-toolbelt/out/Object/MergeAll";

// Matt Pocock
type Prettify<T> = {
  [k in keyof T]: T[k];
};

// TODO: create a dynamic type where the key and value pair of props are actually parameters
type KeyValue<
  TKey extends PropertyKey,
  TValue extends any,
  TKeyProp extends PropertyKey = "key",
  TValueProp extends PropertyKey = "value"
> = {
  [k in TKeyProp]: TKey;
} & {
  [k in TValueProp]: TValue;
};

type KeyValueFoo = [
  KeyValue<"magic", number>,
  KeyValue<"const", "literal">,
  KeyValue<"age", 24>
];
const keyValueFoo: KeyValueFoo = [
  { key: "magic", value: 1 },
  { key: "const", value: "literal" },
  { key: "age", value: 24 },
];

type KeyValueToObjectArray<
  TKeyProp extends PropertyKey,
  TValueProp extends PropertyKey,
  TKeyValue extends KeyValue<PropertyKey, any, TKeyProp, TValueProp>[]
> = {
  [TKey in keyof TKeyValue]: {
    [subKey in TKeyValue[TKey][TKeyProp]]: TKeyValue[TKey][TValueProp];
  };
};

type KeyValueToObject<
  TKeyProp extends PropertyKey,
  TValueProp extends PropertyKey,
  TKeyValue extends KeyValue<PropertyKey, any, TKeyProp, TValueProp>[],
  TObjects extends KeyValueToObjectArray<TKeyProp, TValueProp, TKeyValue>
> = MergeAll<{}, TObjects>;

type MoreInferenceTest = KeyValueToObject<
  "key",
  "value",
  KeyValueFoo,
  KeyValueToObjectArray<"key", "value", KeyValueFoo>
>;

const keyValueToObjectBar: KeyValueToObject<
  "key",
  "value",
  KeyValueFoo,
  KeyValueToObjectArray<"key", "value", KeyValueFoo>
> = {
  magic: 0,
  const: "literal",
  // @ts-expect-error
  age: "literal",
};

const fromKeyValueToObject = <
  TKey extends PropertyKey,
  TValue extends any,
  TKeyProp extends PropertyKey,
  TValueProp extends PropertyKey,
  TKeyValue extends readonly ({ readonly [k in TKeyProp]: PropertyKey } & {
    readonly [k in TValueProp]: any;
  })[]
>(
  keyValue: TKeyValue,
  // allow for optional values while retaining type inference
  key: TKeyProp,
  value: TValueProp
) => {
  // return keyValue;
  const arrayOfObjects = keyValue.map((pair) => ({
    [pair[key]]: pair[value],
  })) as {
    [TIndex in keyof TKeyValue]: {
      [k in TKeyValue[TIndex][TKeyProp]]: TKeyValue[TIndex][TValueProp];
    };
  };

  const mergedObjects = arrayOfObjects.reduce((acc, curr) => {
    return Object.assign(acc, curr);
  }, {} as MergeAll<{}, typeof arrayOfObjects>);

  return mergedObjects;
};

const keyValueArrayExample = [
  { key: "firstName", value: "Foo" },
  { key: "lastName", value: "Bar" },
  { key: "age", value: 24 },
] as const;

const result = fromKeyValueToObject(keyValueArrayExample, "key", "value");
const { age, firstName, lastName } = result;

const differentKeysArrayExample = [
  { clave: "test", valor: "funciona" },
] as const;

const differentKeys = fromKeyValueToObject(
  differentKeysArrayExample,
  "clave",
  "valor"
);
const { test } = differentKeys;

// javascript test
// [{ key: "test", value: "foo" }].reduce((acc, curr) => {
//   acc[curr.key] = curr.value;
//   return acc;
// }, {});
