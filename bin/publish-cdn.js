// https://blog.csdn.net/zuggs_/article/details/84768489
const fs = require('fs')
const OSS = require('ali-oss')
const OSSConfig = {
  // 地域节点
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  // 域名
  bucket: '',
}
const client = new OSS(OSSConfig)
// 上传文件 src = 本地路径 dist = 云端路径
const uploadFile = (src, dist) => {
  client
    .put(dist, src)
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log('上传成功', res.name)
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.log('上传失败', src)
    })
}
// 上传目录 src = 本地路径, dist 云端目录
const uploaDirectory = (src, dist) => {
  if (fs.existsSync(src) === false) {
    // eslint-disable-next-line no-console
    console.log('请先打包 dict')
    return
  }
  const docs = fs.readdirSync(src)
  for (const doc of docs) {
    const _src = src + '/' + doc
    const _dist = dist + '/' + doc
    const st = fs.statSync(_src)
    // 判断是否为文件
    if (st.isFile() && !['.DS_Store', '.nojekyll'].includes(doc)) {
      uploadFile(_src, _dist)
    } else if (st.isDirectory()) {
      // 如果是目录则递归调用自身
      uploaDirectory(_src, _dist)
    }
  }
}
// https://help.aliyun.com/document_detail/111408.htm?spm=a2c4g.11186623.2.15.61937ff0oYacAG
// 删除文件
const deleteFile = async (name) => {
  try {
    await client.delete(name)
    return name
  } catch (error) {
    error.failObjectName = name
    return error
  }
}
// 删除目录
const deleteDirectory = async (prefix) => {
  const list = await client.list({
    prefix,
  })

  list.objects = list.objects || []
  const result = await Promise.all(list.objects.map((v) => deleteFile(v.name)))
  // eslint-disable-next-line no-console
  console.log('删除完成', result)
}

const main = async () => {
  if (!OSSConfig.accessKeySecret) {
    // eslint-disable-next-line no-console
    console.log('请填写 OSSConfig')
    return
  }
  // 删除
  await deleteDirectory('')
  // 上传
  uploaDirectory(process.cwd() + '/dist', '')
}
main()
