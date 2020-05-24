
function roleChecker(role, msg = '/login first') {
  if (Array.isArray(role))
    return (req, res, next) => {
      if (req.user) {
        if (role.indexOf(req.user.role) != -1)
          next();
        else
          res.status(401).json({ msg: 'permission denied ' + req.user.id });
      }
      else
        res.status(401).json({ msg: 'login first' });
    };
  return (req, res, next) => {
    if (req.user) {
      if (req.user && req.user.role === role)
        next();
      else
        res.status(401).json({ msg: 'permission denied ' + req.user.id });
    }
    else
      res.status(401).json({ msg: 'login first' });
  };
}

function roleOrUserIdChecker(role, msg = '/login first') {
  if (Array.isArray(role))
    return (req, res, next) => {
      if (req.user &&
        ((req.params && req.params.id == req.user.id) ||
          role.indexOf(req.user.role) != -1))
        next();
      else
        res.status(401).json({ msg });
    };
  return (req, res, next) => {
    if (req.user && req.user.role === role)
      next();
    else
      res.status(401).json({ msg });
  };
}

module.exports = roleChecker;
