type DoesNotUsesGenericBag<T extends `test-${string}` | undefined = undefined> =
  T extends `test-${string}`
    ? {
        [k in T]: string;
      }
    : {
        [k in "test-fallback"]: string;
      };

type DoesNotUsesGenericBagFilledAssertion =
  DoesNotUsesGenericBag<"test-sagsag">;
type DoesNotUsesGenericBagInvalidAssertion = DoesNotUsesGenericBag<"sagsag">;
type DoesNotUsesGenericBagEmptyAssertion = DoesNotUsesGenericBag;

type GenericBag = {
  magicKey?: `test-${string}`;
};

type UsesGenericBag<T extends GenericBag | undefined = undefined> =
  T extends GenericBag
    ? T["magicKey"] extends `test-${string}`
      ? {
          [k in T["magicKey"]]: string;
        }
      : {
          [k in "test-fallback"]: string;
        }
    : null;

type UsesGenericBagNoGenericAssertion = UsesGenericBag;
type UsesGenericBagEmptyGenericAssertion = UsesGenericBag<{}>;
type UsesGenericBagInvalidGenericAssertion = UsesGenericBag<{
  magicKey: "test";
}>;
type UsesGenericBagFilledAssertion = UsesGenericBag<{
  magicKey: "test-wegewg";
}>;
