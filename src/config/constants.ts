export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ErrorMessages = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  PRODUCT_NOT_FOUND: 'Product not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  ORDER_NOT_FOUND: 'Order not found',
  INSUFFICIENT_STOCK: 'Insufficient stock',
  INVALID_TOKEN: 'Invalid or expired token',
  SOMETHING_WENT_WRONG: 'Something went wrong',
} as const;

export const SuccessMessages = {
  USER_CREATED: 'User created successfully',
  USER_LOGGED_IN: 'Logged in successfully',
  USER_LOGGED_OUT: 'Logged out successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order status updated successfully',
} as const;
