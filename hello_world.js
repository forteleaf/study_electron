var sys = require('sys')

// // setTimeout(() => {
// //     sys.puts('world')
// // },4000)
// // sys.puts('hello')

// setTimeout( function() {
//     sys.puts('world')
// },2000)
// sys.puts('hello')

// net = require('net')

// var s = net.createServer()
// s.addListener('connection', (c)=>{
//     c.end('hello!\n')
// })

// s.listen(8000)

// 파일의 수정 날짜를 확인
// var stat = require('fs').stat,
var gets = require('sys').gets,
    puts = require('sys').puts

// stat('./index.html', (e,s)=>{
//     if (e) throw e
//     puts('modified:'+ s.mtime)
// })

puts('please enter your name')
gets((green_name)=>{
    puts('your green name is '+green_name)
})