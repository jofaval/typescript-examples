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

type KeyValueToObject<
  TKeyProp extends PropertyKey,
  TValueProp extends PropertyKey,
  TKeyValue extends KeyValue<PropertyKey, any, TKeyProp, TValueProp>[]
> = {
  [TKey in TKeyValue[number][TKeyProp]]: TKeyValue[number][TValueProp];
};

const keyValueToObjectBar: KeyValueToObject<"key", "value", KeyValueFoo> = {
  magic: 0,
  const: "literal",
  // FIXME: This does not error
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
  key: TKeyProp,
  value: TValueProp
) => {
  return keyValue.reduce((acc, curr) => {
    acc[curr[key]] = curr[value];
    return acc;
  }, {} as KeyValueToObject<TKeyProp, TValueProp, TKeyValue>);
};

const keyValueArrayExample = [
  { key: "firstName", value: "Foo" } as const,
  { key: "lastName", value: "Bar" } as const,
  { key: "age", value: 24 } as const,
];

const result = fromKeyValueToObject(keyValueArrayExample, "key", "value");
const { age, firstName, lastName } = result;
