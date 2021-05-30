# web 前端
# web 前端 编译并上传
# 编译

echo "NODE_ENV = ${NODE_ENV}"

if [ -f ".env.${NODE_ENV}" ]
then
  export $(cat .env.${NODE_ENV} | sed 's/#.*//g' | xargs)
fi

TARGET="$SSH_USER@$SSH_DOMAIN"
echo "target is $TARGET"


# yarn build
# 打包
tar -czf dist.tgz dist
# 删除
ssh -t -p 22 $TARGET "cd /var/www/$SSH_DOMAIN/NFT-Gift.web && rm -rf ./dist/*"
# 上传到目录
scp dist.tgz $TARGET:/var/www/$SSH_DOMAIN/NFT-Gift.web
# 解压
ssh -t -p 22 $TARGET "cd /var/www/$SSH_DOMAIN/NFT-Gift.web && tar -zxf dist.tgz; rm dist.tgz"
# 覆盖
ssh -t -p 22 $TARGET "cd /var/www/$SSH_DOMAIN/NFT-Gift.web &&mv dist/* ../$SSH_DOMAIN/NFT-Gift.web"
# 删除
rm dist.tgz
# 上传cdn
node bin/publish-cdn.js

# 备注：上传公钥命令
#  ssh-copy-id -i ~/.ssh/id_rsa.pub user@domain.com