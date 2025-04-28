import User from "../Models/User.js";

const checkEmailExist = async (email) => {
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    return true;
  }
  return false;
};

export default checkEmailExist;
