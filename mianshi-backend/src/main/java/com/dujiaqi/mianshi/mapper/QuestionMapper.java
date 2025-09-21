package com.dujiaqi.mianshi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.dujiaqi.mianshi.model.entity.Question;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

/**
* @author Lenovo
* @description 针对表【question(题目)】的数据库操作Mapper
* @createDate 2025-09-04 15:59:59
* @Entity model.entity.Question
*/
public interface QuestionMapper extends BaseMapper<Question> {

    /**
     * 查询题目列表(包括已经删除的数据)
     * @param minUpdateTime
     * @return
     */
    @Select("select * from question where updateTime >= #{minUpdateTime}")
    List<Question> listQuestionWithDelete(Date minUpdateTime);

}




