const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const SocksProxyAgent = require('socks-proxy-agent')
const staticFIles = require("koa-static")


const download = require('download')

const picRouter = new Router({prefix:"/sister"})

let pic = fs.readFileSync("./url.txt").toString().split("\n")

let global = ""

const httpsAgent = new SocksProxyAgent.SocksProxyAgent('socks5://127.0.0.1:7890')
function MyAxios(url){
    return new Promise((resolve,reject)=>{
        axios.get(url,{
            maxRedirects:5,
            httpsAgent
        }).then(rsp=>{
            resolve(rsp)
        }).catch(err=>{
            reject(err)
        })
    })
}

async function downloadFile(url){
    await download(url,"./pic")
    let temp = url.split("/")
    let temp2 = url.split(".")[url.split(".").length - 1]
    console.log(`./pic/${temp[temp.length - 1]}`)
    temp2 = temp2.substr(0,temp2.length - 1)
    temp[temp.length - 1] = temp[temp.length - 1].substr(0,temp[temp.length - 1].length - 1)
    if(fs.stat(`./pic/1.${temp2}`,err=>{

    }))
    fs.unlink(`./pic/1.${temp2}`)
    fs.rename(`./pic/${temp[temp.length - 1]}`,`./pic/1.${temp2}`,err=>{
    })
    return `https://qrobot.dadiqq.cn/pic/1.${temp2}`
}

setInterval(()=>{
    global = ""
},5000)

picRouter.get("/",async (ctx,next)=>{
    //请求美女网站，下载图片到本地供引用消息进行访问。
    //直接随机取出一个下载到本地，然后返回地址给go，告诉成功，发送引用消息
    let r_list = Math.floor(Math.random() * pic.length)
    if(global == ""){
        let res = await downloadFile(pic[r_list])
        global = res
        //5s更新一次
    }
    ctx.body = global
})
app.use(picRouter.routes())
app.use(staticFIles('./'))
app.use((ctx,next)=>{
    ctx.body = "hello world"
})
app.listen(9000)