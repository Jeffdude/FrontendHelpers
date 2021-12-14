export const AUTH_STATE = {
  NONE: 0,
  READONLY: 1,
  READWRITE: 5,
  ADMIN: 500,
};

export const authStateToString = ( state ) => (
  {
    0: "None",
    1: "Read Only",
    5: "Read Write",
    500: "Admin",
  }[state]
);

export const permissionLevelToAuthState = (permissionLevel) => (
  {
    "none": AUTH_STATE.NONE,
    "user": AUTH_STATE.READONLY,
    "ambassador": AUTH_STATE.READWRITE,
    "admin": AUTH_STATE.ADMIN,
  }[permissionLevel]
);