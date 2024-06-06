# 使用官方 Node.js 14 镜像作为基础镜像
FROM node:14

# 配置npm的镜像源为淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org/

# 设置工作目录
WORKDIR /app

# 将本地项目文件复制到容器中的工作目录
COPY . /app

# 安装项目依赖
RUN npm install

# 运行npm脚本，例如npm run dll 和 npm run start
CMD npm run dll && npm run start