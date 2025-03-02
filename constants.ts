export enum USER_ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const STATUS_CODE = {
  CREATED: 201,
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const ERROR_MESSAGE = {
  UNAUTHORIZED: "User unauthorized",
  FORBIDDEN: "Permission not allowed for this user!",
  SERVER_ERROR: "Internal server error!",
};

export enum INTERACTION_TYPE {
  VISIT = "VISIT",
  COMMENT = "COMMENT",
}
