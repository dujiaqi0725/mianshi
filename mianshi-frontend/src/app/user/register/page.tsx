"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  userRegisterUsingPost,
} from "@/api/userController";
import { message } from "antd";
import { ProForm } from "@ant-design/pro-form/lib";
import { useRouter } from "next/navigation";
import "./index.css";


/**
 * 用户登录页面
 * @constructor
 */
const UserRegisterPage: React.FC = () => {
  const [form] = ProForm.useForm();
  const router = useRouter();

  /**
   * 提交
   */
  const doRegister = async (values: API.UserRegisterRequest) => {
    try {
      const res = await userRegisterUsingPost(values);
      if (res.data) {
        message.success("注册成功");
        //保存用户登录状态;
        router.replace("/user/login");
        form.resetFields();
      }
    } catch (e) {
      if (e instanceof Error) {
        message.error("注册失败: " + e.message);
      } else {
        message.error("注册失败: 发生未知错误");
      }
    }
  };

  return (
    <div id="userRegisterPage">
      <LoginForm
        form={form}
        logo={
          <Image src="/assets/logo.png" alt="面试鸭" height={44} width={44} />
        }
        title="面试鸭 - 用户注册"
        subTitle="程序员面试刷题网站"
        onFinish={doRegister}
        submitter={{
          searchConfig: {
            submitText: "注册",
          },
        }}
      >
        <ProFormText
          name="userAccount"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined />,
          }}
          placeholder={"请输入用户账号"}
          rules={[
            {
              required: true,
              message: "请输入用户账号!",
            },
          ]}
        />
        <ProFormText.Password
          name="userPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={"请输入密码"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <ProFormText.Password
          name="checkPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={"请输入确认密码"}
          rules={[
            {
              required: true,
              message: "请输入确认密码！",
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
            textAlign: "end",
          }}
        >
          已有账号
          <Link href={"/user/login"}>去登录</Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default UserRegisterPage;
