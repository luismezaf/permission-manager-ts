# PermissionsManager.ts

PermissionsManager.ts is an utility library I decided to share with all of you after using it in my own projects and finding it extremely useful and convenient. It allows for simpler and more expressive management of permissions in JavaScript.

### Motivation

If you was worked with permissions, you might be familiar with the following peace of code.

```JavaScript
if (user.permissions.includes("create.task")) {
  // Create your task here
}

/* Or maybe you were used a constant instead a literal... */

if (user.permissions.includes(PERMISSIONS.CREATE_TASK)) {
  // Create your task in a better way, but not enougth...
}
```

### Proposed solution

PermissionsManager.ts proposes a cleaner, more pleasant and automatic way to perform this same validation. How? As easy as this:

```JavaScript
if (canCreateTask()) {
  // Create the most awesome task ever!
}
```

I know it, beatiful. But lets see how to get that awesome function, I promise it's much easier than you think.

## Initialization

Simply import the definePermissions function, then define the list of permissions of your system (or import it) and finaly pass it straingh to definePermissions.

```TypeScript
import definePermissions from "permissions-manager-ts";

const systemPermissions = [
  'list.tasks',
  'create.tasks',
  'update.tasks',
  'delete.tasks',
  // ...other permissions
] as const;

const permissionsManager = definePermissions(systemPermissions);
```

And thas all to define the manager. In the next step, lets see for what we can use it.

## Basic Usage

With the manager defined, the only we need are the permissions that the user of our system are currently in possesion.

```TypeScript
const permissions = permissionsManager.grant(user.permissions);
```

Boalá, now we have access to a list of functions that represents our inicial set of permissions (systemPermissions). What's the best part?

### It comes with fully TypeScript recomendations!

```TypeScript
permissions.canListTasks();
permissions.canCreateTasks();
permissions.canUpdateTasks();
permissions.canDeleteTasks();
```

Yeah, you now can just type "permissions." and get all those functions as typescript recomendations.

## Full code example

Here is the full example, shorted in someways.

```TypeScript
import definePermissions from "permissions-manager-ts";

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
