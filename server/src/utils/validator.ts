/**
 * This type defines the types the schema is capable of verifying, in the form <name>: <JS type>.
 * Some types correspond to the same JS type, but may have different validation requirements or
 * special purposes (ex. the 'pkey' type, of which there must be EXACTLY one in a schema).
 *
 * These types do not directly correspond to Postgres types. For example, the `timestamp` and
 * `datetime` entries will validate any date, the only difference is that `timestamp`s are not
 * required when calling `createRaw` or `updateRaw`.
 *
 * To add support for a new type to the validator, add it to the type below, then add a validator
 * function that can verify a value of an unknown type to the correct JS type.
 */
export type VTypeMap = {
  string: string;
  "string[]": string[];
  "number[]": number[];
  number: number;
  timestamp: Date;
  datetime: Date;
  pkey: number;

  n_number: number | null;
};

export type VType = keyof VTypeMap;

const validators = {
  string: (unk) => typeof unk === "string",
  number: (unk) => typeof unk === "number",
  pkey: (unk) => typeof unk === "number",
  timestamp: (unk) => unk instanceof Date,
  datetime: (unk) => unk instanceof Date,
  n_number: (unk) => unk === null || typeof unk === "number",
  "string[]": (unk) => Array.isArray(unk) && unk.every((s) => typeof s === "string"),
  "number[]": (unk) => Array.isArray(unk) && unk.every((s) => typeof s === "number"),
} satisfies Record<VType, (_: unknown) => unknown>;

export default function createValidator<S extends Record<string, VType>>(schema: S) {
  type Data = { [P in keyof S]: VTypeMap[S[P]] };

  return (data: unknown) => {
    if (typeof data !== "object" || data === null) {
      return;
    }

    const row = data as Record<string, unknown>;
    for (const key in schema) {
      if (!validators[schema[key]](row[key])) {
        return;
      }
    }

    return row as Data;
  };
}
