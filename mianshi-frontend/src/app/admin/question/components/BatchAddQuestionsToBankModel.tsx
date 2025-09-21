"use client";

import { Button, Form, message, Modal, Select } from "antd";
import React, { useEffect } from "react";
import {
  addQuestionBankQuestionUsingPost,
  batchAddQuestionToBankUsingPost,
  listQuestionBankQuestionVoByPageUsingPost,
  removeQuestionBankQuestionUsingPost,
} from "@/api/questionBankQuestionController";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";

interface Props {
  questionIdList?: number[];
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * 批量向题库添加题目弹窗
 * @param props
 * @constructor
 */
const BatchAddQuestionsToBankModel: React.FC<Props> = (props) => {
  const { questionIdList = [], visible, onSubmit ,onCancel } = props;
  const [form] = Form.useForm();
  const [questionBankList, setQuestionBankList] = React.useState<
    API.QuestionBankVO[]
  >([]);

  /**
   * 提交
   *
   * @param row
   */
  const doSubmit = async (values: API.QuestionBankQuestionBatchAddRequest) => {
    const hide = message.loading("正在操作");
    const questionBankId = values.questionBankId;
    if (!questionBankId) return;
    try {
      await batchAddQuestionToBankUsingPost({
        questionBankId,
        questionIdList,
      });
      hide();
      message.success("操作成功");
      onSubmit?.();
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
    }
  };

  //获取题库列表
  const getQuestionBankList = async () => {
    const pageSize = 200;
    try {
      const res = await listQuestionBankVoByPageUsingPost({
        pageSize,
        sortField: "createTime",
        sortOrder: "descend",
      });
      const questionBankQuestion = res.data as API.PageQuestionBankQuestionVO_;
      setQuestionBankList(questionBankQuestion.records ?? []);
    } catch (e) {
      if (e instanceof Error) {
        message.error(`获取题库列表失败：${e.message}`);
      } else {
        message.error("获取题库列表失败：发生未知错误");
      }
    }
  };

  useEffect(() => {
    getQuestionBankList();
  }, []);

  if (!questionIdList) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={"批量向题库添加题目"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item label="选择题库" name="questionBankId">
          <Select
            style={{ width: "100%" }}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              };
            })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default BatchAddQuestionsToBankModel;
