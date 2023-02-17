import React, { cloneElement, FC, ReactNode } from "react";

type ComponentProps<TData, TKey extends keyof TData> = {
  idKey: TKey;
  data: TData[];
  selectedIdKeys: TData[TKey][];
  onSelectedIdKeysChange: (keys: TData[TKey][]) => void;
  children: (props: TData) => JSX.Element;
};

export function GenericComponent<TData, TKey extends keyof TData>({
  data,
  idKey,
  onSelectedIdKeysChange,
  selectedIdKeys,
  children: renderElement,
}: ComponentProps<TData, TKey>): JSX.Element {
  return (
    <div>
      {Array.isArray(data) && data.length
        ? data.map((element) => cloneElement(renderElement(element)))
        : null}
    </div>
  );
}

type DataType = {
  id: number;
  name: string;
  datetime: number;
};

const data: DataType[] = [];

export const App: FC = () => {
  // Type-safe example inferring from the `data` prop
  return (
    <GenericComponent
      data={data}
      idKey="id"
      // This will throw an error, id is typed as a number, but a string is passed
      // @ts-expect-error
      selectedIdKeys={["1"]}
      onSelectedIdKeysChange={(keys) => {
        console.log(keys);
      }}
    >
      {({ id, name }) => <p key={id}>{name}</p>}
    </GenericComponent>
  );
};
