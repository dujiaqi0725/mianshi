"use server";
import "./index.css";
import { Flex, Menu, message } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Title from "antd/es/typography/Title";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import type { MenuProps } from "antd";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link"; // 导入MenuProps类型

// 定义 params 的类型接口
interface BankPageParams {
  questionBankId: string;
  questionId: string;
}

/**
 * 题目详情页面
 * @constructor
 */
export default async function BankQuestionPage({ params }: { params: BankPageParams }) {
  const { questionBankId , questionId } = params;
  let bank = undefined;
  let question= undefined;

  // 获取题库详情
  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: questionBankId,
      needQueryQuestionList: true,
      pageSize: 200,
    });
    bank = res.data as API.QuestionBankVO;
  } catch (e) {
    if (e instanceof Error) {
      message.error(`获取题库详情失败：${e.message}`);
    } else {
      message.error("获取题库详情失败：发生未知错误");
    }
  }
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>;
  }

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

  // 明确指定菜单项目类型
  const questionMenuItemList: MenuProps["items"] = (bank.questionPage?.records || []).map((item) => {
    return {
      label: <Link href={`/bank/${questionBankId}/question/${item.id}`}>{item.title}</Link>,
      key: item.id?.toString() || '',
      type: 'item',
    };
  });

  return (
    <div id="bankQuestionPage" >
      <Flex gap={24}>
        <Sider width={240} theme={"light"} style={{padding:'24px 0'}}>
          <Title level={4} style={{padding : "0 20px"}}>{bank.title}</Title>
          <Menu items={questionMenuItemList} selectedKeys={[String(question.id)]}/>
        </Sider>
        <Content>
          <QuestionCard question={question} />
        </Content>
      </Flex>
    </div>
  );
}
