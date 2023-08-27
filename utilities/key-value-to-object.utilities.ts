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
  TKeyValue extends KeyValue<TKey, TValue, TKeyProp, TValueProp>[]
>(
  keyValue: TKeyValue,
  // allow for optional values while retaining type inference
  key: TKeyProp,
  value: TValueProp
) => {
  type TFinalObject = KeyValueToObject<
    TKeyProp,
    TValueProp,
    TKeyValue,
    KeyValueToObjectArray<TKeyProp, TValueProp, TKeyValue>
  >;
  return {} as TFinalObject;

  // return keyValue.reduce<TFinalObject>((acc, curr) => {
  //   acc[curr[key]] = curr[value];
  //   return acc;
  // }, {});
};

const keyValueArrayExample = [
  { key: "firstName", value: "Foo" } as const,
  { key: "lastName", value: "Bar" } as const,
  { key: "age", value: 24 } as const,
];

const result = fromKeyValueToObject(keyValueArrayExample, "key", "value");
const { age, firstName, lastName } = result;

const differentKeysArrayExample = [
  { clave: "test", valor: "funciona" } as const,
];

const differentKeys = fromKeyValueToObject(
  differentKeysArrayExample,
  "clave",
  "valor"
);
const { test } = differentKeys;
