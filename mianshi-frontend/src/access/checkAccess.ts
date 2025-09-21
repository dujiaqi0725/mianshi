import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @return boolean 有无权限
 */
const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = ACCESS_ENUM.NOT_LOGIN,
) => {
  //获取当前登录用户具有的权限
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;

  //判断当前页面需要什么权限
  //不需要任何权限
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }

  //需要登录权限访问
  if (needAccess === ACCESS_ENUM.USER) {
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }

  //需要管理员权限访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    if (loginUserAccess != ACCESS_ENUM.ADMIN) {
      return false;
    }
  }

  return true;
};

export default checkAccess;