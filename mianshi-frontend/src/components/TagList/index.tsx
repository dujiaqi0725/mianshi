import { Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import "./index.css";
import { Tag } from "antd";
interface Props {
  tagList?: string[];
}
const plugins = [gfm(), highlight()];
/**
 * Markdown 浏览器
 * @param props
 * @constructor
 */
const TagList = (props: Props) => {
  const { tagList = [] } = props;
  return (
    <div className="tag-list">
      {tagList.map((tag) => {
        return <Tag key={tag}>{tag}</Tag>;
      })}
    </div>
  );
};
export default TagList;
