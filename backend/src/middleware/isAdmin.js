// backend/src/middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
};