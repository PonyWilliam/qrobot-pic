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

let picpath = '/mnt/pic/pic'


// if(!fs.statSync(path.join(__dirname,'pic'))){
//     fs.mkdirSync(path.join(__dirname,'pic'))
//     if(!fs.statSync(path.join(__dirname,'pic','pic'))){
//         fs.mkdirSync(path.join(__dirname,'pic','pic'))
//     }
// }
//修改目录权限
// fs.chmodSync(path.join(__dirname,'pic','pic'),777)
// fs.chmodSync(path.join(__dirname,'pic'),777)



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
    await download(url,picpath)
    let temp = url.split("/")
    let temp2 = url.split(".")[url.split(".").length - 1]
    temp2 = temp2.replace("\r","")
    temp[temp.length - 1] = temp[temp.length - 1].replace("\r","")
    fs.unlink(`${picpath}/1.${temp2}`,_=>{})
    fs.rename(`${picpath}/${temp[temp.length - 1]}`,`${picpath}/1.${temp2}`,err=>{
    })
    return `https://qrobot.dadiqq.cn/pic/1.${temp2}`
}

setInterval(()=>{
    global = ""
},5000)

app.use(picRouter.routes())
app.use(staticFIles('/mnt/pic'))
app.use(async (ctx,next)=>{
    let r_list = Math.floor(Math.random() * pic.length)
    if(global == ""){
        let res = await downloadFile(pic[r_list])
        global = res
        //5s更新一次
    }
    ctx.body = global
})
app.listen(9000)
module.exports = app