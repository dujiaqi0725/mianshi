import { menus } from "../../config/menu";
import checkAccess from "@/access/checkAccess";

const getAccessibleMenus = (loginUser: API.LoginUserVO , menuItems = menus) =>{
  return menuItems.filter((menuItem) => {
    if (!checkAccess(loginUser,menuItem.access)){
      return false;
    }
    if (menuItem.children){
      menuItem.children = getAccessibleMenus(loginUser,menuItem.children);
    }
    return true;
  })
}

export default getAccessibleMenus;