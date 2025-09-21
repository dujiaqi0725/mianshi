import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import "./index.css";
import dayjs from "dayjs";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { message } from "antd";
import { getUserSignInRecordUsingGet } from "@/api/userController";
interface Props {

}
/**
 * 刷题日历图
 * @param props
 * @constructor
 */
const CalenderChart = (props: Props) => {
  const {} = props;

  //签到日期列表([1,200]，表示第1和第200天有签到记录)
  const [dataList , setDataList] = useState<number[]>([1,200]);

  //当前年份
  const year = new Date().getFullYear();

  //请求后端获取数据
  const fetchDataList = async () => {
    try {
      const res = await getUserSignInRecordUsingGet({
        year
      });
      setDataList(res.data as number[]);
    } catch (e) {
      if (e instanceof Error) {
        message.error(`获取题库列表失败：${e.message}`);
      } else {
        message.error("获取题库列表失败：发生未知错误");
      }
    }
  }

  useEffect(() => {
    fetchDataList()
  } , [])

  //计算图表所需的数据
  const optionsData = dataList.map((dayOfYear) => {
    //计算日期字符串
    const dateStr = dayjs(`${year}-01-01`)
      .add(dayOfYear - 1, 'day')
      .format('YYYY-MM-DD');
    return [dateStr , 1]
  })

  const options = {
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange : {
        color : ['#efefef' , 'lightgreen']
      }
    },
    calendar: {
      range: `${year}`,
      left : 25,
      cellSize: ['auto',16],
      yearLabel : {
        position : "top",
        formatter : `${year} 年刷题记录`
      }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: optionsData
    }
  };

  return <ReactECharts className="calender-chart" option={options} />;
};
export default CalenderChart;
