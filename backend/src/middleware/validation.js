export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          errors
        });
      }

      req.body = value;
      next();
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Validation error'
      });
    }
  };
};

export default { validateRequest };
