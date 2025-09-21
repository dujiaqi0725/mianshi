"use client";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import "./index.css";
import { Avatar, Card, List, Typography } from "antd";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";

interface Props {
  question?: API.QuestionVO;
}
const plugins = [gfm(), highlight()];
/**
 * Markdown 题库列表组件
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { question } = props;

  //签到
  useAddUserSignInRecord();

  return (
    <div className="question-card">
      <Card>
        <Title level={1} style={{fontSize : 24}}>{question?.title}</Title>
        <TagList tagList={question?.tagList}/>
        <div style={{marginBottom : 16}}/>
        <MdViewer value={question?.content}/>
      </Card>
      <Card title="推荐答案">
        <MdViewer value={question?.answer}/>
      </Card>
    </div>
  );
};
export default QuestionCard;
