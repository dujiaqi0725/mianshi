"use client";

import { Form, message, Modal, Select } from "antd";
import React, { useEffect } from "react";
import {
  addQuestionBankQuestionUsingPost,
  listQuestionBankQuestionVoByPageUsingPost,
  removeQuestionBankQuestionUsingPost,
} from "@/api/questionBankQuestionController";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";

interface Props {
  questionId?: number;
  visible: boolean;
  onCancel: () => void;
}

/**
 * 更新题目所属题库弹窗
 * @param props
 * @constructor
 */
const UpdateBankModel: React.FC<Props> = (props) => {
  const { questionId, visible, onCancel } = props;
  const [form] = Form.useForm();
  const [questionBankList, setQuestionBankList] = React.useState<
    API.QuestionBankVO[]
  >([]);

  //获取所属题库列表
  const getCurrentQuestionBankIdList = async () => {
    try {
      const res = await listQuestionBankQuestionVoByPageUsingPost({
        questionId,
        pageSize: 20,
      });
      const questionBankQuestion = res.data as API.PageQuestionBankQuestionVO_;
      const list = (questionBankQuestion.records ?? []).map(
        (item) => item.questionBankId,
      );

      form.setFieldValue("questionBankIdList", list);
    } catch (e) {
      if (e instanceof Error) {
        message.error(`获取题目所属题库列表失败：${e.message}`);
      } else {
        message.error("获取题目所属题库列表失败：发生未知错误");
      }
    }
  };

  useEffect(() => {
    if (questionId) {
      getCurrentQuestionBankIdList();
    }
  }, [questionId]);

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

  if (!questionId) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={"更新"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <Form form={form} style={{ marginTop: 24 }}>
        <Form.Item label="所属题库" name="questionBankIdList">
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              };
            })}
            onSelect={async (value) => {
              const hide = message.loading("正在更新");
              try {
                await addQuestionBankQuestionUsingPost({
                  questionId,
                  questionBankId: value,
                });
                hide();
                message.success("绑定题库成功");
              } catch (error: any) {
                hide();
                message.error("绑定题库失败，" + error.message);
              }
            }}
            onDeselect={async (value) => {
              const hide = message.loading("正在更新");
              try {
                await removeQuestionBankQuestionUsingPost({
                  questionId,
                  questionBankId: value,
                });
                hide();
                message.success("取消绑定题库成功");
              } catch (error: any) {
                hide();
                message.error("取消绑定题库失败，" + error.message);
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UpdateBankModel;
