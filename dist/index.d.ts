type CamelCase<S extends string> = S extends `${infer P1}-${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}.${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}_${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1} ${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}!${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}@${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}&${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}%${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}$${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}#${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}+${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}*${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}/${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : S extends `${infer P1}:${infer P2}`
  ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}`
  : Capitalize<S>;

type RemoveNonAlpha<S extends string> = S extends `${infer P1}${infer P2}`
  ? P1 extends Lowercase<P1> | Uppercase<P1>
    ? `${P1}${RemoveNonAlpha<P2>}`
    : RemoveNonAlpha<P2>
  : S;

type PermissionsManager<T extends readonly string[]> = {
  [P in T[number] as `can${CamelCase<RemoveNonAlpha<P>>}`]: () => boolean;
};

type GroupFormat<T extends readonly string[]> = Record<
  string,
  T[number][]
>;

type AliasFormat<T extends readonly string[]> = {
  [P in T[number]]?: string;
};

type DefinePermissionsOptions<T extends readonly string[]> = {
  groups?: GroupFormat<T> | Record<string, string[]>;
  alias?: AliasFormat<T> | Record<string, string>;
};

type DefinePermissionsResult<T extends readonly string[]> = {
  grant: (activePermissions: string[]) => PermissionsManager<T>;
};

declare function definePermissions<T extends readonly string[]>(permissions: T, options?: DefinePermissionsOptions<T>): DefinePermissionsResult<T>;

export { definePermissions };
