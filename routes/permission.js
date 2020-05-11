
function roleChecker(role, redirect = '/login') {
  if (Array.isArray(role))
    return (req, res, next) => {
      if (req.user && role.indexOf(req.user.role) != -1)
        next();
      else
        res.status(401).redirect(redirect);
    };
  return (req, res, next) => {
    if (req.user && req.user.role === role)
      next();
    else
      res.status(401).redirect(redirect);
  };
}

function roleOrUserIdChecker(role, redirect = '/login') {
  if (Array.isArray(role))
    return (req, res, next) => {
      if (req.user &&
        ((req.params && req.params.id == req.user.id) ||
          role.indexOf(req.user.role) != -1))
        next();
      else
        res.status(401).redirect(redirect);
    };
  return (req, res, next) => {
    if (req.user && req.user.role === role)
      next();
    else
      res.status(401).redirect(redirect);
  };
}

module.exports = roleChecker;
