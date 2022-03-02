const jwt = require("jsonwebtoken");
const refreshModel = require("../models/refresh-model");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const RefreshModel = require("../models/refresh-model");

class TokenServise {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token, userId) {
    try {
      await RefreshModel.create({
        token,
        userId,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, accessTokenSecret);
  }

  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenSecret);
  }

  async findRefreshToken(userId, refreshToken) {
    return await RefreshModel.findOne({
      userId: userId,
      token: refreshToken,
    });
  }
  async updateRefreshToken(userId, refreshToken) {
    return await RefreshModel.updateOne(
      { userId: userId },
      { token: refreshToken }
    );
  }
  async removeToken(refreshToken) {
    return await refreshModel.deleteOne({ token: refreshToken });
  }
}
module.exports = new TokenServise();
