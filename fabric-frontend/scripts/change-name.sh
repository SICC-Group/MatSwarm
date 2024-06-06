#!/bin/bash
 
file="static_src/database_config.js"
if [ ! -f "$file" ]; then
 content=' let data = [ { "name": "Material Database"}]
export default data;'
 touch "$file"
 echo "$content" > "$file"
fi
echo "请输入数据库名称,默认为Material Database"
read name
if [ -z "$name" ]; then
    name="Material Database"
fi

new_content=' let data = [{"name": "'${name}'"}]
export default data;'
echo "$new_content" > "$file"

