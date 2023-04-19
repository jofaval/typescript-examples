import z from "zod";

// (not) surprisingly same as: https://stackoverflow.com/questions/70415330/do-not-allow-extra-properties-with-zod-parse
const SuperImportantObject = z.object({
  foo: z.string(),
  bar: z.number(),
});

type SuperImportantObjectType = z.infer<typeof SuperImportantObject>;

// @ts-expect-error
const throwsError = { foo: 1, bar: "a" } as SuperImportantObjectType;

const parseResult = SuperImportantObject.safeParse({ foo: 1, bar: "a" });
if (!parseResult.success) {
  // warn the user
} else {
  const { bar, foo } = parseResult.data;
}

const filterContaminationResult = SuperImportantObject.safeParse({
  foo: "bar",
  bar: 1,
  pollution: true,
});

if (!filterContaminationResult.success) {
  // warn the user
} else {
  const { bar, foo } = filterContaminationResult.data;
  // note: weird that typescript doesn't filter the autocomplete to it's narrowest type
  console.assert(typeof bar === "number");
  console.assert(typeof foo === "string");
}
