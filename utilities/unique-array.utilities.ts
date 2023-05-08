// https://stackoverflow.com/questions/58411739/typescript-no-repeat-value
export type RemoveArrayRepeats<T extends readonly any[]> = {
  [K in keyof T]: T[number] extends {
    [P in keyof T]: P extends K ? never : T[P];
  }[number]
    ? never
    : T[K];
};
