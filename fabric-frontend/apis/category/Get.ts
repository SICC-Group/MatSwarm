import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
import { Category } from '../define/Category';

let rawCategoryCache: Category.Raw[];

async function GetCategoryList(): Promise<Category.Raw[]> {
  if (rawCategoryCache) {
    return rawCategoryCache;
  }
  else {
    rawCategoryCache = await JsonApiFetch<Category.Raw[]>(Urls.api_v1_storage.material_categories);
    return rawCategoryCache;
  }
}

/* 缓存分类的结构 */
let categoryCache: Category[];

// 获取叶子节点的列表
export async function GetLeafCategory(): Promise<Category.Base[]> {
  const list = await GetCategoryList();
  const queryMap: Category.Raw[] = [];
  list.forEach((value) => {
    value.children = [];
    queryMap[value.id] = value;
  });

  list.forEach((value) => {
    if (value.pid || value.pid === 0) {
      queryMap[value.pid].children.push(value);
    }
  });
  // 过滤出children 为空的分类
  const ret =  queryMap.filter((value) => value.children.length === 0);
  return ret.map(value => ({ name: value.name, id: value.id}));
}

export async function GetCategory(): Promise<Category[]> {

  if (categoryCache){
    return categoryCache;
  }

  const list = await GetCategoryList();
  // 列表组合成树

  // 首先根据id映射到数组用于查找
  const queryMap: Category.Raw[] = [];

  list.forEach((value) => {
    value.children = [];
    // queryMap[value.id] = value;
    queryMap.push(value);
  });


  list.forEach((value) => {
    // if (value.pid || value.pid === 0) {
    //   queryMap[value.pid].children.push(value);
    // }
    queryMap.map( (item) => {
      if (value.pid === item.id){item.children.push(value)}
    })
  });
  // 过滤出level为1的分类
  // const ret =  queryMap.filter((value) => value.level === 1);
  const ret =  queryMap.filter((value) => value.level === 1);

  const converter = (value: Category.Raw): Category => {
    return {
      id: value.id,
      name: value.name,
      children: value.children.map(converter),
    };
  };
  categoryCache = ret.map(converter);
  return categoryCache;
}
