export interface Result {
  acceptance_id: number;
  project_id: string;
  subjects_id: string[];
}

function GetCategoryTree(category: string, result: any, id: number){
  const temp = category.split('.');
  let str = temp[0];
  if (temp.length > 1) {
    temp.shift();
    if (result.hasOwnProperty(str)){
      result[str].push(GetCategoryTree(temp.join('.'), {}, id));
    }
    else {
      result[str] = [];
      result[str].push(GetCategoryTree(temp.join('.'), {}, id));
    }
  }
  else {
    result[str] = {category_id: String(id)};
  }
  return result;
}

export function GetCategory(origin_data: any[]){
  const category_str: string[] = [];
  const category: any[] = [];
  origin_data.map((value, index) => {// 先提取外层
    const temp = {
      path: value.name,
      category_id: value.category_id,
    };
    if (!category_str.includes(value.name)){
      category_str.push(value.name);
      category.push(temp);
    }
  });
  let category_list = {};
  category.map((item) => {
    GetCategoryTree(item.path, category_list, item.category_id);
  });
  return category_list;
}
