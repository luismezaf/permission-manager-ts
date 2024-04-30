import {
  DefinePermissionsOptions,
  DefinePermissionsResult,
  PermissionsManager,
} from "../types";

export default function definePermissions<T extends readonly string[]>(
  permissions: T,
  options?: DefinePermissionsOptions<T>
): DefinePermissionsResult<T> {
  function hasPermissionTo(
    permission: string,
    activePermissions: string[]
  ): boolean {
    // Check if the permission is directly included in the activePermissions list
    if (activePermissions.includes(permission)) {
      return true;
    }

    // Return false early if no options are provided
    if (!options) return false;

    // Check group permissions: if a group key exists in activePermissions, all its associated permissions are granted
    // Example: if 'users.all' is in activePermissions, both 'create.user' and 'update_admin.user' are granted
    if (options.groups) {
      for (const group in options.groups) {
        if (
          activePermissions.includes(group) &&
          options.groups[group].includes(permission)
        ) {
          return true;
        }
      }
    }

    // Check alias permissions: if the alias of a permission exists in activePermissions, the permission is granted
    const aliasValue = options.alias
      ? Reflect.get(options.alias as object, permission)
      : null;
    if (aliasValue && activePermissions.includes(aliasValue as string)) {
      return true;
    }

    return false;
  }

  function evalPermissions(activePermissions: string[]): PermissionsManager<T> {
    const result = {} as PermissionsManager<T>;
    for (const permission of permissions) {
      // Format the permission string to a camelCase style starting with 'can'
      const formattedKey = `can${permission.replace(
        /^(.)|[^a-zA-Z]+(.)/g,
        (_match, first, next) =>
          first ? first.toUpperCase() : next.toUpperCase()
      )}` as keyof PermissionsManager<T>;
      // Create a validator function for each permission
      const validatorFunction = () =>
        hasPermissionTo(permission, activePermissions);
      Reflect.set(result, formattedKey, validatorFunction);
    }

    return result;
  }

  return {
    grant: (activePermissions: string[]) => evalPermissions(activePermissions),
  };
}
