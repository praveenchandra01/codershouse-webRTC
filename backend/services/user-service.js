const UserModle = require("../models/user-model");
class UserService {
  async findUser(filter) {
    const user = await UserModle.findOne(filter);
    return user;
  }
  async createUser(data) {
    const user = await UserModle.create(data);
    return user;
  }
}
module.exports = new UserService();
