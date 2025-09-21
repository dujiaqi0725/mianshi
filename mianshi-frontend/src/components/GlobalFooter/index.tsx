import React from "react";
import './index.css'

/**
 * 全局底部栏组件
 */
export default function GlobalFooter() {
    const currentYear = new Date().getFullYear();

    return(
      <div className="global-footer">
        <div>© {currentYear} 面试刷题平台</div>
        <div>
            作者：dujiaqi
        </div>
      </div>
    )
}