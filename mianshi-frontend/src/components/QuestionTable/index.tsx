"use client";

import {
  listQuestionByPageUsingPost,
  listQuestionVoByPageUsingPost,
  searchQuestionVoByPageUsingPost,
} from "@/api/questionController";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import React, { useRef, useState } from "react";
import MdEditor from "@/components/MdEditor";
import TagList from "@/components/TagList";
import Link from "next/link";

interface Props {
  //默认值(用于展示服务端渲染数据)
  defaultQuestionList?: API.QuestionVO[];
  defaultTotal?: number;
  //默认搜索条件
  defaultSearchParams?: API.QuestionQueryRequest;
}

/**
 * 题目表格组件
 *
 * @constructor
 */
const QuestionTable = (props: Props) => {
  const actionRef = useRef<ActionType>();
  const { defaultQuestionList, defaultTotal , defaultSearchParams = {}} = props;

  //题目列表
  const [questionList, setQuestionList] = useState<API.QuestionVO[]>(
    defaultQuestionList || [],
  );
  //题目总数
  const [total, setTotal] = useState<number>(defaultTotal || 0);
  //用于判断是否首次加载
  const [init , setInit] = useState<boolean>(true);

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: "搜索",
      dataIndex: "searchText",
      valueType: "text"
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
      hideInSearch: true,
      render: (_, record: API.QuestionVO) => {
        return <Link href={`/question/${record.id}`}>{record.title}</Link>;
      },
    },
    {
      title: "标签",
      dataIndex: "tagList",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      render: (_, record: API.QuestionVO) => {
        return <TagList tagList={record.tagList} />;
      },
    },
  ];
  return (
    <div className="question-table">
      <ProTable<API.QuestionVO>
        actionRef={actionRef}
        size="large"
        search={{
          labelWidth: "auto",
        }}
        form={{
          initialValues: defaultSearchParams,
        }}
        dataSource={questionList}
        pagination={{
          pageSize: 12,
          showTotal: (total) => `总共${total}条`,
          showSizeChanger: false,
          total,
        }}
        request={async (params, sort, filter) => {
          //首次请求
          if (init){
            setInit(false);
            //如果外层已经传来数据就不用请求了
            if (defaultQuestionList && defaultTotal){
              return {};
            }
          }

          const sortField = Object.keys(sort)?.[0] || "createTime";
          const sortOrder = sort?.[sortField] ?? "descend";

          const { data } = await searchQuestionVoByPageUsingPost({
            ...params,
            sortField : "_score",
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest);

          const pageQuestion = data as API.PageQuestion_;
          const baseResponsePageQuestion = (await searchQuestionVoByPageUsingPost(
            {},
          )) as API.BaseResponsePageQuestion_;

          //更新结果
          const newData = pageQuestion?.records || [];
          const newTotal = pageQuestion?.total || 0;
          //更新状态
          setQuestionList(newData);
          setTotal(newTotal);

          return {
            success: baseResponsePageQuestion.code === 0,
            data: newData,
            total: newTotal,
          };
        }}
        columns={columns}
      />
    </div>
  );
};
export default QuestionTable;
