import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generalAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "30d" }
  );

  return access_token;
};

export const generalRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );

  return refresh_token;
};

export const refreshTokenJwt = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "ERR",
            message: "The authentication",
          });
        }
        const access_token = await generalAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        resolve({
          status: "OK",
          message: "Successful",
          data: user,
          access_token,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
