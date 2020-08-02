#!/usr/bin/env sh

hash=`git rev-parse --short HEAD`
package_name=webpack_benchmark_$hash.zip
user=lishunyang
host=dev.lishunyang.com

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 打包压缩
zip -rq $package_name public

scp $package_name $user@$host:~/

ssh $user@$host "nohup ./deploy_webpack_benchmark.sh $package_name"

rm $package_name

cd -
