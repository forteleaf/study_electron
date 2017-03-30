const {
    app,
    BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')

// 윈도우 객체를 전역에 유지.
// Cuz, 자바스크립트 GC가 일어날 때 창이 멋대로 닫힘
let win
let onlineStatusWindow

// 드레그앤드롭에 대한 이벤트
app.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: filePath,
        icon: '/path/to/button.png'
    })
})

function createWindow() {
    // make new browser
    win = new BrowserWindow({
        width: 800,
        height: 600
    })

    // and load index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))
    // open developer tools
    win.webContents.openDevTools()
    // thumbnail button 설정하기
    win.setThumbarButtons([{
        tooltip: 'button1',
        icon: path.join(__dirname, 'button.png'),
        click() {
            console.log('button1 clicked')
        }
    }, {
        tooltip: 'button2',
        icon: path.join(__dirname, 'button.png'),
        flags: ['enabled', 'dismissonclick'],
        click() {
            console.log('button2 clicked.')
        }
    }])

    // when close window, call
    win.on('closed', () => {
        // 윈도우 객체의 참조를 삭제. 보통 멀티 윈도우 지원을 위해
        // 윈도우 객체를 배열에 저장하는 경우가 있는데 이 경우 해당하는 모든 윈도우
        // 객체의 참조를  삭제해 주어야 합니다.
        win = null
    })
    console.log(__filename)
}

// Electron 초기화 끝나면 실행되며, 브라우저 우니도우를 생성할 수 있다. 몇몇 API 는 이 이벤트 이후에만 사용할 수 있다.

app.on('ready', createWindow)

// 모든 창이 닫히면 애플리케이션 종료
app.on('window-all-closed', () => {
    // macOS의 대부분 애플리케이션은 유저가 cmd+q 로 종료하기 전까지 메뉴바에 남아 계속 실행
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win == nill ) {
        createWindow()
    }
})