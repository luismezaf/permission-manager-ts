import { expect, test } from "vitest";

import definePermissions from "..";

// Define a constant list of permissions that are expected to be managed by the system.
// Remember to always use "as const" in your list of permissions to allow typescript infer correctly the result types.
const allPermissions = [
  "list.user",
  "create-user",
  "update_user",
  "delete@users",
  "list@tasks",
  "add.tasks",
  "update.tasks",
  "this is an unexpected permission",
  "i can create tasks",
] as const;

test("Permission functions are correctly generated", () => {
  // Initialize permissions manager with all permissions as active to test function generation.
  const permissionsManager = definePermissions(allPermissions).grant([
    ...allPermissions,
  ]);

  // Ensuring the permissions manager contains the correct number of permission functions.
  expect(Object.keys(permissionsManager).length).toBe(allPermissions.length);

  // Validate that all expected permission checking functions are defined.
  const expectedKeys = [
    "canCreateUser",
    "canDeleteUsers",
    "canListUser",
    "canUpdateUser",
    "canListTasks",
    "canAddTasks",
    "canUpdateTasks",
    "canThisIsAnUnexpectedPermission",
  ];
  expectedKeys.forEach((key) => expect(permissionsManager).toHaveProperty(key));
});

test("Permissions evaluation validates active permissions correctly", () => {
  // Setup permissions manager with a subset of permissions to test conditional access.
  const permissionsManager = definePermissions(allPermissions).grant(
    allPermissions.slice(0, 4)
  ); // Activating only the first four permissions.

  // Check that the permissions functions return expected results based on active permissions.
  expect(permissionsManager.canListUser()).toBeTruthy();
  expect(permissionsManager.canCreateUser()).toBeTruthy();
  expect(permissionsManager.canUpdateUser()).toBeTruthy();
  expect(permissionsManager.canDeleteUsers()).toBeTruthy();
  expect(permissionsManager.canListTasks()).toBeFalsy();
  expect(permissionsManager.canAddTasks()).toBeFalsy();
  expect(permissionsManager.canUpdateTasks()).toBeFalsy();
  expect(permissionsManager.canThisIsAnUnexpectedPermission()).toBeFalsy();
});

test("Group permissions apply correctly", () => {
  // Test group permissions by setting a group as active and verifying that all included permissions are granted.
  const permissionsManager = definePermissions(allPermissions, {
    groups: {
      "users.all": ["list.user", "create-user", "update_user", "delete@users"],
    },
  }).grant(["users.all"]);

  // Verify individual permissions are correctly inferred from the active group.
  expect(permissionsManager.canListUser()).toBeTruthy();
  expect(permissionsManager.canCreateUser()).toBeTruthy();
  expect(permissionsManager.canUpdateUser()).toBeTruthy();
  expect(permissionsManager.canDeleteUsers()).toBeTruthy();
  expect(permissionsManager.canAddTasks()).toBeFalsy();
  expect(permissionsManager.canUpdateTasks()).toBeFalsy();
  expect(permissionsManager.canThisIsAnUnexpectedPermission()).toBeFalsy();
});

test("Alias mapping for permissions functions correctly", () => {
  // Setup permissions with aliases and test if activating the alias grants the expected permissions.
  const permissionsManager = definePermissions(allPermissions, {
    alias: {
      "add.tasks": "module:tasks-action:create",
      "update.tasks": "module:tasks-action:update",
    },
  }).grant(["module:tasks-action:create", "module:tasks-action:update"]);

  // Verify that the permissions are granted through alias mappings.
  expect(permissionsManager.canAddTasks()).toBeTruthy();
  expect(permissionsManager.canUpdateTasks()).toBeTruthy();
});
