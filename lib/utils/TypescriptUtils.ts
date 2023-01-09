//It randomizes an enum, use for seeding, ignore type errors. It works.
export function randEnumValue<T>(enumObj: T): T[keyof T] {
  //@ts-ignore
  const enumValues = Object.values(enumObj);
  const index = Math.floor(Math.random() * enumValues.length);

  //@ts-ignore
  return enumValues[index];
}
