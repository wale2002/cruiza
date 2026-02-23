exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.handleError = (res, err, status = 500) => {
  res.status(status).json({ msg: err.message });
};
