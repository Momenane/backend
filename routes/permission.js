
function roleChecker(role = [], msg = '/login first') {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (req.user) {
      if (role.indexOf(req.user.role) != -1)
        next();
      else
        res.status(401).json({ msg: 'permission denied for ' + req.user.id });
    }
    else
      res.status(401).json({ msg: 'login first' });
  };
}

function roleOrUserIdChecker(role = [], msg = '/login first') {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (req.user &&
      ((req.params && req.params.id == req.user.id) ||
        role.indexOf(req.user.role) != -1))
      next();
    else
      res.status(401).json({ msg });
  };
}

module.exports = roleChecker;
