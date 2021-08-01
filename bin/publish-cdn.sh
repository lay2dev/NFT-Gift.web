
echo "NODE_ENV = ${NODE_ENV}"

if [ -f ".env.${NODE_ENV}" ]
then
  export $(cat .env.${NODE_ENV} | sed 's/#.*//g' | xargs)
  rm .env
  ln -s .env.${NODE_ENV} .env
fi

# 打包
# yarn build
# 上传cdn
node bin/publish-cdn.js
