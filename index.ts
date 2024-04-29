type CamelCase<S extends string> = 
    S extends `${infer P1}-${infer P2}` ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}` :
    S extends `${infer P1}.${infer P2}` ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}` :
    S extends `${infer P1}_${infer P2}` ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}` :
    S extends `${infer P1} ${infer P2}` ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}` :
    S extends `${infer P1}!${infer P2}` ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}` :
    S extends `${infer P1}@${infer P2}` ? `${Capitalize<CamelCase<P1>>}${Capitalize<CamelCase<P2>>}` : Capitalize<S>;

type RemoveNonAlpha<S extends string> = S extends `${infer P1}${infer P2}` ? 
    P1 extends Lowercase<P1> | Uppercase<P1> ? `${P1}${RemoveNonAlpha<P2>}` : RemoveNonAlpha<P2> : S;

type TextFormat<T extends ReadonlyArray<string>> = {
    [P in T[number] as `hasPermissionTo${CamelCase<RemoveNonAlpha<P>>}`]: () => boolean
};

type GroupFormat<T extends ReadonlyArray<string>> = Record<string, T[number][]>;

type AliasFormat<T extends ReadonlyArray<string>> = {
    [P in T[number]]?: string
};

type DefinePermissionsOptions<T extends ReadonlyArray<string>> = {
    groups?: GroupFormat<T>
    alias?: AliasFormat<T>
}

type DefinePermissionsResult<T extends ReadonlyArray<string>> = {
    withActivePermissions : (activePermissions: string[]) => TextFormat<T>
}

function definePermissions<T extends ReadonlyArray<string>>(permissions: T, options?: DefinePermissionsOptions<T>): DefinePermissionsResult<T> {

    function hasPermissionTo(permission: string, activePermissions: string[]) {
        // TODO: Implement hasPermissionTo
        // 1. Check that permission is in activePermissions
        if (activePermissions.includes(permission)) {
            return true;
        }

        if (!options) return false

        // 2. If there is any key in options.groups, and if that key exists in activePermissions, then all permissions in the value array are grented
        // For example, for the group: 'users.all': ['create.user', 'update_admin.user']
        // If there is 'users.all' in activePermissions, then 'create.user' and 'update_admin.user' must be granted like they was in activePermissions
        if (options?.groups) {
            for (const group in options.groups) {
                if (activePermissions.includes(group) && options.groups[group].includes(permission)) {
                    return true;
                }
            }
        }

        // 3. If there is any key in options.alias and if the value of that key exists in activePermissions, then the key must be granted as it was in activePermissions
        const aliasValue = Reflect.get(options.alias as object, permission)
        if (options?.alias && aliasValue) {
            if (activePermissions.includes(aliasValue as string)) {
                return true;
            }
        }

        return false;
    }
    
    function evalPermissions(activePermissions: string[]) {

        const result = {} as TextFormat<T>;
        for (const permission of permissions) {
            const formattedKey = `hasPermissionTo${permission.replace(/[^a-zA-Z]+(.)/g, (match, char) => char.toUpperCase())}` as keyof TextFormat<T>
            const validatorFunction = () => hasPermissionTo(permission, activePermissions)
            Reflect.set(result, formattedKey, validatorFunction)
        }

        return result
    }

    return {
        withActivePermissions: (activePermissions: string[]) => {
            return evalPermissions(activePermissions)
        },
    }
}

// Usage example
const allPermissions = [
    'create.user',  // hasPermissionToCreateUser
    'list.user', 
    'update.user',
    'list.tasks',
] as const;

const permissionsManager = definePermissions(allPermissions, {
    groups: {
        'users.all': ['create.user', 'list.user']
    },
    alias: {
        'create.user': 'I can create users :)'
    }
})

const permissions = permissionsManager.withActivePermissions(['list.users', 'I can create users :)'])

permissions.hasPermissionToCreateUser()

