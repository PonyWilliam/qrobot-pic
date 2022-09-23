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

let picpath = path.join(__dirname,'pic','pic')


if(!fs.statSync(path.join(__dirname,'pic'))){
    fs.mkdir(path.join(__dirname,'pic'),_=>{
        if(!fs.statSync(path.join(__dirname,'pic','pic'))){
            fs.mkdir(path.join(__dirname,'pic','pic'),err=>{
                if (err != null){
                    console.error(err)
                    
                }else{
                   
                }
            })
        }
    })
}


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
    await download(url,path.join(__dirname,'pic','pic'))
    let temp = url.split("/")
    let temp2 = url.split(".")[url.split(".").length - 1]
    temp2 = temp2.substr(0,temp2.length - 1)
    temp[temp.length - 1] = temp[temp.length - 1].substr(0,temp[temp.length - 1].length - 1)
    fs.unlink(`${picpath}/1.${temp2}`,_=>{})
    fs.rename(`${picpath}/${temp[temp.length - 1]}`,`${picpath}/1.${temp2}`,err=>{
    })
    return `https://qrobot.dadiqq.cn/pic/1.${temp2}`
}

setInterval(()=>{
    global = ""
},5000)

app.use(picRouter.routes())
app.use(staticFIles(path.join(__dirname,'pic')))
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