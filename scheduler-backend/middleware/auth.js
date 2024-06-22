const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ error: "User ID not provided" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authMiddleware;
