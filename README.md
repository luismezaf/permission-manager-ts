# PermissionManager.ts

PermissionManager.ts is a utility library I decided to share with all of you after using it in my own projects and finding it extremely useful and convenient. It allows for simpler and more expressive management of permissions in JavaScript.

### Motivation

If you have worked with permissions, you might be familiar with the following peace of code.

```JavaScript
if (user.permissions.includes("create.task")) {
  // Create your task here
}

/* Or maybe you were used a constant instead a literal... */

if (user.permissions.includes(PERMISSIONS.CREATE_TASK)) {
  // Create your task in a better way, but not enougth...
}
```

This way you may have a lot of repetitive code.

### Proposed solution

PermissionManager.ts proposes a cleaner, more pleasant, and automatic way to perform this same validation. How? As easy as this:

```JavaScript
if (canCreateTask()) {
  // Create the most awesome task ever!
}
```

I know it, beautiful. But let's see how to make that awesome function work, I promise it's much easier than you think.

## Initialization

Simply import the definePermissions function, then define the list of permissions of your system (or import it) and finally pass it straight to definePermissions.

```TypeScript
import definePermissions from "permission-manager-ts";

const systemPermissions = [
  'list.tasks',
  'create.tasks',
  'update.tasks',
  'delete.tasks',
  // ...other permissions
] as const;

const permissionManager = definePermissions(systemPermissions);
```

And that's all to define the manager. In the next step, let's see what we can use it for.

## Basic Usage

With the manager defined, the only thing we need are the permissions that the user of our system are currently in possesion of and pass it straight the "grant" function provided for the manager.

```TypeScript
const permissions = permissionManager.grant(user.permissions);
```

Voilá, now we have access to a list of functions that represents our inicial set of permissions (systemPermissions). What's the best part?

### It comes with fully TypeScript recommendations!

```TypeScript
permissions.canListTasks();
permissions.canCreateTasks();
permissions.canUpdateTasks();
permissions.canDeleteTasks();
```

Yeah, you can now just type "permissions." and get all those functions as typescript recommendations.

## Full code example

Here is the full example, in a shortened form.

```TypeScript
import definePermissions from "permission-manager-ts";

const systemPermissions = [
  'list.tasks',
  'create.tasks',
  'update.tasks',
  'delete.tasks',
  // ...other permissions
] as const;

const {
  canListTasks,
  canCreateTasks,
  canUpdateTasks,
  canDeleteTasks,
  // ...other formatted permission functions
} = definePermissions(systemPermissions).grant(user.permissions);

if (canCreateTasks()) {
  // Create the most awesome task ever!
}
```

## Group permissions

Sometimes, you have a permission that represents a set of permissions. For example, the permission "all.tasks" may indicate that the user has all the permissions for the tasks module, which can includes "list.tasks", "create.tasks", "update.tasks" and "delete.tasks".

PermissionManager.ts allows you to create those kinds of groups by simply passing the "groups" property to the options parameter of definePermissions.

```TypeScript

const groups = {
  "all.tasks": ['list.tasks', 'create.tasks', 'update.tasks', 'delete.tasks']
};

const permissions = definePermissions(systemPermissions, { groups }).grant(user.permissions);
```

This way, you are not adding a new permission to your system permissions set, so you will not receive a recommendation like "canAllTasks()" which doesn't make any sense in this scenario.

Now, assuming that the user has the "all.tasks" permission, it will be granted all the permissions of the group.

```TypeScript
// user.permissions = ["all.tasks"]

permissions.canListTasks(); // true
permissions.canCreateTasks(); // true
permissions.canUpdateTasks(); // true
permissions.canDeleteTasks(); // true
```

## Permission alias

Maybe your system doesn´t work with the format of permissions that can be easily formatted, such as "module:tasks-action:list" that would literaly be formatted as "canModuleTasksActionList()". In this case, you can use permission aliases.

An alias converts your source permission into the declared permission, so let's say that you manage the following permissions in your database:

```TypeScript
"module:tasks-action:list"
"module:tasks-action:create"
"module:tasks-action:update"
"module:tasks-action:delete"
```

If you want to achieve pretty function names like "canListTasks", so you have to define your system permissions as the alias you want to use, and then declare the actual permission name to match both of them.

```TypeScript
const systemPermissions = [
  'list.tasks',
  'create.tasks',
  'update.tasks',
  'delete.tasks',
] as const;

const alias = {
  'list.tasks': "module:tasks-action:list",
  'create.tasks': "module:tasks-action:create",
  'update.tasks': "module:tasks-action:update",
  'delete.tasks': "module:tasks-action:delete",
}

const permissions = definePermissions(systemPermissions, { alias }).grant(user.permissions);

// Assuming user.permissions = ['module:tasks-action:list']

permissions.canListTasks(); // true
permissions.canCreateTasks(); // false
permissions.canUpdateTasks(); // false
permissions.canDeleteTasks(); // false
```

## ReactJS and React Native usage

As this is a JavaScript library, you can also use it in your RectJS or React Native projects the same way you would in vanilla JavaScript.

I strongly recommend creating a hook to manage the permission definitions. Here is a basic example.

``` TypeScript
import definePermissions from "permission-manager-ts";

const systemPermissions = [
  'list.tasks',
  'create.tasks',
  'update.tasks',
  'delete.tasks',
] as const;

const manager = definePermissions(systemPermissions);

export default function usePermissions() {
  const user = useGetUser(); // Get you user or pass it by parameter
  return manager.grant(user.permissions);
}
```

So now, you can import the hook into any component you need to validate permissions.

### Code example

In this example, the visibility of the button for creating a new task is validated using the canCreateTask function defined by PermissionManager.ts.

``` TypeScript
import usePermissions from '...';

export default TaskDetail() {
  const { canCreateTask } = usePermissions();

  return (
    {/* ... */}
    
    { canCreateTask() && <CreateTaskButton /> }
    
    {/* ... */}
  )
}
```

## VueJS useage

As this is a JavaScript library, you can also use it in your VueJS projects the same way you would in vanilla JavaScript.

I strongly recommend creating a hook to manage the permission definitions. Here is a basic example.

``` TypeScript
import definePermissions from "permission-manager-ts";

const systemPermissions = [
  'list.tasks',
  'create.tasks',
  'update.tasks',
  'delete.tasks',
] as const;

const manager = definePermissions(systemPermissions);

export default function usePermissions() {
  const user = useGetUser(); // Get you user or pass it by parameter
  return manager.grant(user.value.permissions);
}
```

So now you can import the hook in any component you need to validate permissions.

### Code example

In this example, the visibility of the button for creating a new task is validated using the canCreateTask function defined by PermissionManager.ts.

``` TypeScript
<template>
<!-- ... -->

<CreateTaskButton v-if="canCreateTask()" />

<!-- ... -->
</template>

<script setup lang="ts">
import usePermissions from '...';

const { canCreateTask } = usePermissions();
</script>

