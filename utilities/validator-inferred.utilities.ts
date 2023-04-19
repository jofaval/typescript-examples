import z from "zod";

const SuperImportantObject = z.object({
  foo: z.string(),
  bar: z.number(),
});

type SuperImportantObjectType = z.infer<typeof SuperImportantObject>;

// @ts-expect-error
const throwsError = { foo: 1, bar: "a" } as SuperImportantObjectType;

const parseResult = SuperImportantObject.safeParse({ foo: 1, bar: "a" });
if (parseResult.success) {
  const { bar, foo } = parseResult.data;
} else {
  // warn the user
}
