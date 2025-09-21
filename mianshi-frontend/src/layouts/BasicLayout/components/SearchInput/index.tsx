import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import "./index.css";
import { Input } from "antd";
import { useRouter } from "next/navigation";


interface Props {
}

/**
 * 搜索组件
 * @constructor
 */
const SearchInput = (props : Props) => {
  const router = useRouter();

  return (
    <div className="search-input"
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        marginInlineEnd: 24,
      }}
    >
      <Input.Search
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
        }}
        placeholder="搜索题目"
        onSearch={(value) => {
          router.push(`/questions?q=${value}`);
        }}
      />
    </div>
  );
};
export default SearchInput;
