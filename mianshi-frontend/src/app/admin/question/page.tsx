"use client";

import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  batchDeleteQuestionsUsingPost,
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Table, Typography } from "antd";
import React, { useRef, useState } from "react";
import MdEditor from "@/components/MdEditor";
import TagList from "@/components/TagList";
import UpdateBankModel from "@/app/admin/question/components/UpdateBankModel";
import BatchAddQuestionsToBankModel from "@/app/admin/question/components/BatchAddQuestionsToBankModel";
import batchAddQuestionsToBankModel from "@/app/admin/question/components/BatchAddQuestionsToBankModel";
import questionBankList from "@/components/QuestionBankList";
import BatchRemoveQuestionsToBankModel from "@/app/admin/question/components/BatchRemoveQuestionsFromBankModel";

/**
 * 题目管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 是否显示更新题目所属题库窗口
  const [updateBankModelVisible, setUpdateBankModalVisible] =
    useState<boolean>(false);
  // 是否显示批量向题库添加题目窗口
  const [batchAddQuestionsToBankVisible, setBatchAddQuestionsToBankVisible] =
    useState<boolean>(false);
  // 是否显示批量从题库移除题目窗口
  const [
    batchRemoveQuestionsToBankVisible,
    setBatchRemoveQuestionsToBankVisible,
  ] = useState<boolean>(false);
  // 当前选中的题目 id 列表
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
    number[]
  >([]);
  const actionRef = useRef<ActionType>();
  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Question) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteQuestionUsingPost({
        id: row.id as any,
      });
      hide();
      message.success("删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
      return false;
    }
  };

  /**
   * 批量删除节点
   *
   * @param row
   */
  const handleBatchDelete = async (questionIdList: number[]) => {
    const hide = message.loading("正在操作");
    try {
      await batchDeleteQuestionsUsingPost({
        questionIdList,
      });
      hide();
      message.success("操作成功");
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "所属题库",
      dataIndex: "questionBankId",
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
    },
    {
      title: "内容",
      dataIndex: "content",
      valueType: "text",
      hideInSearch: true,
      width: 240,
      renderFormItem: (item, fieldProps, form) => {
        return <MdEditor {...fieldProps} />;
      },
    },
    {
      title: "答案",
      dataIndex: "answer",
      valueType: "text",
      hideInSearch: true,
      width: 640,
      renderFormItem: (item, fieldProps, form) => {
        return <MdEditor {...fieldProps} />;
      },
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      render: (_, record: API.Question) => {
        const tagList = JSON.parse(record.tags || "[]");
        return <TagList tagList={tagList} />;
      },
    },
    {
      title: "创建用户",
      dataIndex: "userId",
      valueType: "text",
      hideInForm: true,
    },

    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "编辑时间",
      sorter: true,
      dataIndex: "editTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateBankModalVisible(true);
            }}
          >
            修改题目所属题库
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Question>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        scroll={{
          x: true,
        }}
        search={{
          labelWidth: 120,
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [1],
        }}
        tableAlertOptionRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          return (
            <Space size={16}>
              <Button
                onClick={() => {
                  setSelectedQuestionIdList(selectedRowKeys as number[]);
                  setBatchAddQuestionsToBankVisible(true);
                }}
              >
                批量向题库添加题目
              </Button>
              <Button
                onClick={() => {
                  setSelectedQuestionIdList(selectedRowKeys as number[]);
                  setBatchRemoveQuestionsToBankVisible(true);
                }}
              >
                批量从题库移除题目
              </Button>
              <Popconfirm
                title="确认删除"
                description="确定要删除这些题目吗？"
                onConfirm={() => {
                  //批量删除
                  handleBatchDelete(selectedRowKeys as number[]);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button danger onClick={() => {}}>
                  批量删除题目
                </Button>
              </Popconfirm>
            </Space>
          );
        }}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data } = await listQuestionByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest);

          const pageQuestion = data as API.PageQuestion_;
          const baseResponsePageQuestion = (await listQuestionByPageUsingPost(
            {},
          )) as API.BaseResponsePageQuestion_;

          return {
            success: baseResponsePageQuestion.code === 0,
            data: pageQuestion?.records || [],
            total: Number(pageQuestion?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
      <UpdateBankModel
        visible={updateBankModelVisible}
        questionId={currentRow?.id}
        onCancel={() => {
          setUpdateBankModalVisible(false);
        }}
      />
      <BatchAddQuestionsToBankModel
        visible={batchAddQuestionsToBankVisible}
        questionIdList={selectedQuestionIdList}
        onSubmit={() => {
          setBatchAddQuestionsToBankVisible(false);
        }}
        onCancel={() => {
          setBatchAddQuestionsToBankVisible(false);
        }}
      />
      <BatchRemoveQuestionsToBankModel
        visible={batchRemoveQuestionsToBankVisible}
        questionIdList={selectedQuestionIdList}
        onSubmit={() => {
          setBatchRemoveQuestionsToBankVisible(false);
        }}
        onCancel={() => {
          setBatchRemoveQuestionsToBankVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default QuestionAdminPage;
