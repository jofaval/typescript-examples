function functionMagic<TProps>(props: TProps): () => TProps {
  return () => props;
}

const functionMagicResult = functionMagic({ foo: "", bar: "" })().bar;

const arrowMagic = <TProps,>(props: TProps): (() => TProps) => {
  return () => props;
};

const arrowMagicResult = arrowMagic({ arrow: "", syntax: "" })().syntax;

class MethodMagicEntity {
  public methodMagic<TProps>(props: TProps): () => TProps {
    return () => props;
  }
}

const methodMagicInstance = new MethodMagicEntity();
const methodMagicResult = methodMagicInstance.methodMagic({
  works: "",
  with: "",
  classes: "",
})().classes;

const semiNaturalInference = <TProps,>(props: TProps) => {
  return props;
};

const semiNaturalInferenceResult = semiNaturalInference({
  just: "",
  fine: "",
}).fine;

const withSiblingInference = <TOlderSibling,>(
  olderSibling: TOlderSibling[],
  loop: (element: TOlderSibling, index: number, array: TOlderSibling[]) => void
) => {
  olderSibling.forEach(loop);
};

const withSiblingInferenceResult = withSiblingInference(
  [
    {
      id: 1,
      sku: "SD321BH65WRH65WR",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  ({ createdAt, id, sku, updatedAt }) => {
    console.log({ createdAt, id, sku, updatedAt });
  }
);
