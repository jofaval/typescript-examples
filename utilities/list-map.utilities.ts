export type ListMap<TList extends any[], TEach extends TList[number]> = {
  [k in keyof TList]: TEach<TList[k]>;
};
