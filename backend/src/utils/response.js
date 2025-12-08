export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    ...(errors && { errors })
  };
};

export const paginatedResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

export default { successResponse, errorResponse, paginatedResponse };
