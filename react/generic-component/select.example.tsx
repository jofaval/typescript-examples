import React, { FC, useId } from "react";

export const SelectionModeEnum = {
  SINGLE: "single",
  MULTIPLE: "multiple",
} as const;

export type ObjectValues<T> = T[keyof T];

export type SelectMode = ObjectValues<typeof SelectionModeEnum>;

export type GenericSelectProps<
  TElement,
  TValueKey extends keyof TElement,
  TLabelKey extends keyof TElement
> = {
  elements: TElement[];
  valueKey: TElement[TValueKey] extends NonNullable<
    React.OptionHTMLAttributes<HTMLOptionElement>["value"]
  >
    ? TValueKey
    : never;
  labelKey: TElement[TLabelKey] extends NonNullable<
    React.OptionHTMLAttributes<HTMLOptionElement>["label"]
  >
    ? TLabelKey
    : never;
  name?: string;
  id?: string;
};

export type SingleSelectProps<
  TElement,
  TValueKey extends keyof TElement,
  TLabelKey extends keyof TElement
> = GenericSelectProps<TElement, TValueKey, TLabelKey> & {
  mode: "single";
  onSelectionChange: (selection: TElement[TValueKey]) => void;
};

export type MultipleSelectProps<
  TElement,
  TValueKey extends keyof TElement,
  TLabelKey extends keyof TElement
> = GenericSelectProps<TElement, TValueKey, TLabelKey> & {
  mode: "multiple";
  onSelectionChange: (selection: TElement[TValueKey][]) => void;
};

export type SelectProps<
  TElement,
  TValueKey extends keyof TElement,
  TLabelKey extends keyof TElement
> =
  | SingleSelectProps<TElement, TValueKey, TLabelKey>
  | MultipleSelectProps<TElement, TValueKey, TLabelKey>;

// does NOT include option groups, in this version
export function Select<
  TElement extends object,
  TValueKey extends keyof TElement,
  TLabelKey extends keyof TElement
>({
  elements,
  labelKey,
  mode,
  onSelectionChange,
  valueKey,
  name,
  id,
}: SelectProps<TElement, TValueKey, TLabelKey>) {
  const innerId = useId();
  const actualId = id ?? innerId;

  return (
    <select {...{ name, id: actualId }} key={actualId}>
      {elements && Array.isArray(elements) && elements.length
        ? elements.map((option) => {
            if (!(labelKey in option)) {
              throw new Error(
                `label "${String(labelKey)}" not found in typeof ${Object.keys(
                  option
                )}`
              );
            } else if (!(valueKey in option)) {
              throw new Error(
                `value "${String(valueKey)}" not found in typeof ${Object.keys(
                  option
                )}`
              );
            }

            const value = option[valueKey];
            const label = option[labelKey];

            // FIXME: some error types
            return (
              <option value={value} key={value}>
                {label}
              </option>
            );
          })
        : null}
    </select>
  );
}

export type DataType = {
  id: number;
  unique: string;
  uDate: number;
  cDate: number;
  description?: string;
};

const data: DataType[] = [];

export const App: FC = () => {
  return (
    <Select
      elements={data}
      valueKey="id"
      labelKey="unique"
      mode="single"
      onSelectionChange={(selection) => {
        console.log(selection);
      }}
    />
  );
};
