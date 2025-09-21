"use server";
import "./index.css";
import Title from "antd/es/typography/Title";
import { Flex, message } from "antd";
import {
  listQuestionVoByPageUsingPost,
  searchQuestionVoByPageUsingPost,
} from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";

// 定义searchParams的类型
interface SearchParams {
  q?: string; // 搜索关键词参数，可选
}

// 定义页面组件的props类型
interface Props {
  searchParams?: SearchParams;
}

/**
 * 题库列表页面
 * @constructor
 */
export default async function QuestionsPage({
  searchParams,
}: Props) {
  // 获取url的查询参数，添加容错处理
  const { q: searchText } = searchParams || {};

  // 题目列表和题目数量
  let questionList: API.QuestionVO[] = [];
  let total = 0;

  // 获取题库列表
  try {
    const res = await searchQuestionVoByPageUsingPost({
      searchText,
      pageSize: 12,
      sortField: "_score",
      sortOrder: "descend",
    });
    const data = res.data as API.PageQuestionVO_;
    questionList = data.records ?? [];
    total = data.total ?? 0;
  } catch (e) {
    if (e instanceof Error) {
      message.error(`获取题库列表失败：${e.message}`);
    } else {
      message.error("获取题库列表失败：发生未知错误");
    }
  }

  return (
    <div id="questionsPage" className="max-width-content">
      <Flex justify="space-between" align="center">
        <Title level={3}>题目大全</Title>
      </Flex>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
        }}
      />
    </div>
  );
}
