//Middleware logic for accessing resources for admin only

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  next();
};

module.exports = { adminOnly };
