import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { usePathname } from "next/navigation";
import { findAllMenuItemByPath } from "../../config/menu";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import Forbidden from "@/app/forbidden";

/**
 * 统一权限校验拦截器
 * @param children
 * @constructor
 */
const AccessLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const pathName = usePathname();
  //当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser);
  //获取当前路径需要的权限
  const menu = findAllMenuItemByPath(pathName);
  const needAccess = menu?.access ?? ACCESS_ENUM.NOT_LOGIN;
  //检验权限
  const canAccess = checkAccess(loginUser, needAccess);
  if (!canAccess) {
    return <Forbidden />;
  }

  return children;
};

export default AccessLayout;
