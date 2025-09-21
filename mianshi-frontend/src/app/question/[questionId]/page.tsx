"use server";
import "./index.css";
import { message } from "antd";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";

// 定义 params 的类型接口
interface BankPageParams {
  questionId: string;
}

/**
 * 题目详情页面
 * @constructor
 */
export default async function QuestionPage({ params }: { params: BankPageParams }) {
  const { questionId } = params;
  let question= undefined;

  // 获取题目详情
  try {
    const res = await getQuestionVoByIdUsingGet({
      id: questionId,
    });
    question = res.data as API.QuestionVO;
  } catch (e) {
    if (e instanceof Error) {
      message.error(`获取题目详情失败：${e.message}`);
    } else {
      message.error("获取题目详情失败：发生未知错误");
    }
  }
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }


  return (
    <div id="questionPage" >
      <QuestionCard question={question} />
    </div>
  );
}
