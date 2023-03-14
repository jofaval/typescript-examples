enum BadEnumVisibleInRuntime {
  NOT_FETCHED = "not_fetched",
  FETCHED = "fetched",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

function badEnumFunction(enumProp: BadEnumVisibleInRuntime) {
  Object.values(BadEnumVisibleInRuntime).forEach(console.log);

  if (enumProp in BadEnumVisibleInRuntime) {
    console.log("Key and value are both values and keys");
  }
}

badEnumFunction(BadEnumVisibleInRuntime.ERROR);
// @ts-expect-error
badEnumFunction("error");
// @ts-expect-error
badEnumFunction("doesn't exist");

const GoodEnumVisibleInRuntime = {
  NOT_FETCHED: "not_fetched",
  FETCHED: "fetched",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

type ObjectValues<T> = T[keyof T];

type GoodEnumVisibleInRuntimeType = ObjectValues<
  typeof GoodEnumVisibleInRuntime
>;

function goodEnumFunction(enumProp: GoodEnumVisibleInRuntimeType) {
  Object.values(GoodEnumVisibleInRuntime).forEach(console.log);

  if (enumProp in GoodEnumVisibleInRuntime) {
    console.log("Only accepts the value, this won't show");
  }
}

goodEnumFunction(GoodEnumVisibleInRuntime.ERROR);
goodEnumFunction("error");
// @ts-expect-error
goodEnumFunction("doesn't exist");

type ConstrainedEnumHiddenInRuntime =
  | "not_fetched"
  | "fetched"
  | "loading"
  | "success"
  | "error";

function constrainedEnumFunction(enumProp: ConstrainedEnumHiddenInRuntime) {
  console.log(
    "Filters the value in dev time, but doesn't actually validate them"
  );
}

constrainedEnumFunction("error");
// @ts-expect-error
constrainedEnumFunction("doesn't exist");
