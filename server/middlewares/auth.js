import jwt from "jsonwebtoken";
import "dotenv/config";

const userAuth = async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return res.json({
      success: false,
      message: "Not Authorized, Login again",
    });
  }

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    if (decodedToken.id) {
      req.body.userId = decodedToken.id;
    } else {
      return res.json({
        success: false,
        message: "Not authorized, Login again",
      });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
