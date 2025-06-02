const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      console.error('[catchAsync] Error caught:', err);
      next(err);
    });
  };
};

export default catchAsync;
