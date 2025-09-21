import { useEffect, useState } from "react";
import { message } from "antd";
import { addUserSignInUsingPost, getUserSignInRecordUsingGet } from "@/api/userController";

/**
 * 添加用户刷题记录钩子
 * @param props
 * @constructor
 */
const CalenderChart = () => {
  //签到日期列表([1,200]，表示第1和第200天有签到记录)
  const [loading, setLoading] = useState<boolean>(true);

  //请求后端执行签到
  const doFetch = async () => {
    setLoading(true);
    try {
      await addUserSignInUsingPost({});
    } catch (e) {
      if (e instanceof Error) {
        message.error(`获取题库列表失败：${e.message}`);
      } else {
        message.error("获取题库列表失败：发生未知错误");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    doFetch();
  }, []);

  return { loading };
};
export default CalenderChart;
