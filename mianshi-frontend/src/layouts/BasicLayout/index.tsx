"use client";

import {
  GithubFilled,
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown, Input, message, theme } from "antd";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import "./index.css";
import { menus } from "../../../config/menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import getAccessibleMenus from "@/access/menuAccess";
import MdEditor from "@/components/MdEditor";
import MdViewer from "@/components/MdViewer";
import { userLoginUsingPost, userLogoutUsingPost } from "@/api/userController";
import { setLoginUser } from "@/stores/loginUser";
import { DEFAULT_USER } from "@/constants/user";
import SearchInput from "@/layouts/BasicLayout/components/SearchInput";

interface Props {
  children: React.ReactNode;
}

export default function BasicLayout({ children }: Props) {
  const loginUser = useSelector((state: RootState) => state.loginUser);
  // const [text, setText] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  /**
   * 退出登录
   */
  const userLogout = async () => {
    try {
      await userLogoutUsingPost();
      message.success("已退出登录");
      //保存用户登录状态
      dispatch(setLoginUser(DEFAULT_USER));
      router.push("/user/login");
    } catch (e) {
      if (e instanceof Error) {
        message.error(`操作失败：${e.message}`);
      } else {
        message.error("操作失败：发生未知错误");
      }
    }
  };

  const pathname = usePathname();
  return (
    <div
      id="basicLayout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProLayout
        title={"刷题平台"}
        layout={"top"}
        logo={
          <Image
            src={"/assets/logo.png"}
            height={32}
            width={32}
            alt={"刷题网站"}
          />
        }
        location={{
          pathname,
        }}
        avatarProps={{
          src: loginUser.userAvatar || "/assets/logo.png",
          size: "small",
          title: loginUser.userName || "面试",
          render: (props, dom) => {
            if (!loginUser.id) {
              return (
                <div
                  onClick={() => {
                    router.push("/user/login");
                  }}
                >
                  {dom}
                </div>
              );
            }
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "userCenter",
                      icon: <UserOutlined />,
                      label: "个人中心",
                    },
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "退出登录",
                    },
                  ],
                  onClick: async (event: { key: React.Key }) => {
                    const { key } = event;
                    if (key === "logout") {
                      userLogout();
                    }else if (key === "userCenter"){
                      router.push("/user/center")
                    }
                  },
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];

          //判断当前是否在题目页面。如果是则不显示全局搜索框
          const isQuestionsPage = pathname === '/questions' || '/admin';

          return [
            !isQuestionsPage && <SearchInput key="search" />,
            <a key="github" href="https://github.com/" target="_blank">
              <GithubFilled key="GithubFilled" />
            </a>,
          ].filter(Boolean);
        }}
        headerTitleRender={(logo, title, _) => {
          return (
            <a>
              {logo}
              {title}
            </a>
          );
        }}
        //渲染底部栏
        footerRender={(props) => {
          return <GlobalFooter />;
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuDataRender={() => {
          return getAccessibleMenus(loginUser, menus);
        }}
        //定义了菜单项如何渲染
        menuItemRender={(item, dom) => (
          <Link href={item.path || "/"} target={item.target}>
            {dom}
          </Link>
        )}
      >
        {/*<MdEditor value={text} onChange={setText} />*/}
        {/*<MdViewer value={text} />*/}
        {children}
      </ProLayout>
    </div>
  );
}
