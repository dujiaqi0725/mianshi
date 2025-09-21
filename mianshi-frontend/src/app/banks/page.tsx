"use server";
import "./index.css";
import Title from "antd/es/typography/Title";
import {Flex, message } from "antd";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import QuestionBankList from "@/components/QuestionBankList";

/**
 * 题库列表页面
 * @constructor
 */
export default async function BanksPage() {
  let questionBankList: API.QuestionBankVO[] = [];
  //题库数量不多，直接全量获取
  const pageSize = 200
  //获取题库列表
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize,
      sortField: "createTime",
      sortOrder: "descend",
    });
    const data = res.data as API.PageQuestionBankVO_;
    questionBankList = data.records ?? [];
  } catch (e) {
    if (e instanceof Error) {
      message.error(`获取题库列表失败：${e.message}`);
    } else {
      message.error("获取题库列表失败：发生未知错误");
    }
  }

  return (
    <div id="banksPage" className="max-width-content">
      <Flex justify="space-between" align="center">
        <Title level={3}>题库大全</Title>
      </Flex>
      <QuestionBankList questionBankList={questionBankList} />
    </div>
  );
}
