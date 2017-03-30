# study_electron

- [https://github.com/electron/electron/blob/master/docs-translations/ko-KR/tutorial/quick-start.md]()
- [http://proinlab.com/archives/1928]()

electron 제작해 보기

#배포 가이드

- [배포가이드](https://github.com/electron/electron/blob/master/docs-translations/ko-KR/tutorial/application-distribution.md)

## 어플리케이션 패키징: electron-pacakger

Electron 프로그램을 .app 또는 .exe 와 같은 실행 파일로 만들기 위해서 electron-packager 모듈을 사용하면 편리하다. electron-packager 문서에서는 이 모듈을 사용하기 위해서는 Node.js 4.0 보다 높은 버전을 사용하는 것을 권장한다. Electron 또한 LTS 버전(4 버전 대)을 사용하여 제작되었기 때문에 LTS 버전을 사용하는 것이 좋다. Node.js 재단과 io.js가 통합되면서 기존 Node.js 버전은 LTS로 지원되고 io.js의 버전은 Stable 버전으로 제공되고있는데, 의존성 패키지 관리 방법 등이 차이가 있기 때문에 LTS 버전에 맞추어 하는 것이 안전하다.

```
$ npm install electron-packager --save-dev # npm 스크립트로 사용
$ npm install electron-packager -g # 전역 모듈로 설치
```

electron-pacakger 설치는 위와 같이 할 수 있다. 전역 모듈로 설치하여 cli 버전을 사용할 수도 있고 스크립트로 작성하여 실행 할 수도 있다. 사용하는 옵션에 대한 설명은 https://github.com/electron-userland/electron-packager/blob/master/usage.txt 에서 자세히 나와있다.

```
electron-packager ./ myApp --platform=win32 --arch x64 \
--out dist \
--prune
```

위의 명령어는 패키징을 위해 사용하는 명령어 예시이다. windows 64비트 운영체제용 실행 파일을 dist 폴더 안에 생성하는데, --prune 옵션을 사용하여 package.json의 devDependencies에 기술된 모듈은 제외하고 패키징을 해준다. –prune 옵션을 사용하지 않아도 기본적으로 패키징할 때 node_modules/electron-prebuilt 폴더는 예외처리 되어있다. –prune 옵션을 사용하지 않고 의존성 파일을 모두 패키징하면 개발시에만 사용하는 gulp와 같은 모듈도 모두 패키징하여 용량이 커지기 때문에 이 옵션을 사용하여 패키징하는것이 좋다. devDependencies 이외에도 패키징 예외파일을 지정하기 위해서는 –ignore 옵션을 사용하면된다.

## 어플리케이션 패키징: asar

electron으로 제작한 프로그램을 사용하기 위해서는, node_modules 을 포함한 모든 파일을 옮겨주어야 한다. 간혹 Windows에서 node_modules 등에서 긴 경로 이름으로 인해 복사가 안되는 오류가 발생하는데 이와 같은 문제를 완화하기 위해 electron 어플리케이션 패키징을 할 때는 asar 아카이브로 패키징한다.

asar를 사용하는 또 다른 이유는 소스코드 전체를 복사해서 배포하는 것과 별개로 asar 아카이브를 통해 어플리케이션 소스 코드가 사용자에게 노출되는 것을 방지 할 수 있기 때문이다. asar가 tar과 비슷한 포맷이기 때문에 내부 소스가 암호화되어 패키징 되는 것은 아니어서 코드를 보려면 어렵지않게 확인 할 수 있지만, 소스코드 전체를 폴더구조로 공유하는 것 보다는 좋다.
```
$ npm install -g asar
$ asar pack your-app app.asar
```
asar를 통해 소스코드를 패키징 하는 것은 위와 같다. asar 사용과 관련되어 더 자세한 것은 electron 문서에서 확인할 수 있다. electron에서는 app.asar 파일이 있을 경우 폴더 접근을 하지 않고 app.asar로 접근을 하여 프로그램을 실행하기 때문에, 배포용 프로그램으로 패키징 할 때는 단순히 resources/app 폴더를 resource/app.asar 파일로 대체하면 된다. electron-packager를 통해 패키징된 실행 파일에서는 생성된 경로에서 resources 폴더 안의 app 폴더를 app.asar 파일로 대체하여주면된다.

## 설치파일 만들기: Windows

- https://github.com/electron/windows-installer

electron에서 제공하는 윈도우 인스톨러를 사용하여 electron-packager를 통해 생성된 실행 파일을 설치파일로 만들 수 있다.
```
$ npm install --save-dev electron-winstaller
```
먼저 위의 명령어로 npm으로부터 electron-winstaller 모듈을 설치한 후, 프로젝트 경로에 installer.js 파일을 아래와 같이 만들어준다.
```
var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './dist/myApp-win32-x64',
    outputDirectory: './dist/installer-win32-x64',
    exe: 'myApp.exe',
    setupExe: 'MyAppSetup.exe'
});

resultPromise.then(function () {
    console.log("It worked!");
}, function (e) {
    console.log('No dice: ' + e.message);
});
```
appDirectory에 electron-packager를 통해 생성된 폴더의 경로와, exe 파일의 이름을 작성한 후, node installer.js 명령어를 실행하여 설치파일을 생성해주면 된다. 설치시 표시될 gif, 아이콘 등을 옵션을 통해 지정할 수 있는데, 이와 관련된 내용은 문서를 보면 나와있다.

electron 으로 만들어진 아톰을 설치해보면, 설치 파일을 실행할때 로딩 이미지만 나오다가 설치가 완료되는 것을 볼 수있다. 또한 업데이트도 사용자가 모르는 사이에 자동으로 되는 것을 볼 수 있는데, 이는 electron에서 squirrel를 사용하여 설치 및 업데이트를 간결하게 해놓았기 때문이다. squirrel 이벤트 관리와 관련된 내용도 문서에 나와있다.

## 설치파일 만들기: Mac

- https://www.npmjs.com/package/electron-installer-dmg

맥에서는 electron-packager를 통해 패키징을 하면 .app 과 같이 단일 파일로 실행 파일이 생성되기 때문에 굳이 설치 파일을 만들 필요가 없지만, 사람들에게 배포하기 위해 설치용 dmg  파일로 만들기 위해서는 위의 모듈을 사용하면 된다. 설치파일 배경, 아이콘, 아이콘 사이즈 등을 설정할 수 있는데 위의 문서에서 보면 된다. 간단한 사용 방법은 아래와 같다.
```
electron-installer-dmg ./dist/myApp-darwin-x64/myApp.app myApp --out=./dist
```
electron-packager를 통해 생성된 .app 파일의 경로와 myApp 대신에 자신의 프로그램 명을 쓰면된다.

## 패키징 관련 정리

installer.js 까지 작성을 해놓았다면, 프로젝트에 아래와같이 쉘스크립트를 작성해놓고 사용하면 편리하다.
```
# delete older files
rm -rf dist

# windows exe pacakaging
electron-packager ./ myApp --platform=win32 --arch x64 --out dist --prune
# asar packaging
asar pack ./dist/myApp-win32-x64/resources/app ./dist/myApp-win32-x64/resources/app.asar
# delete source dir
rm -rf ./dist/myApp-win32-x64/resources/app
# create installer
node installer.js

# create mac app and dmg
electron-packager ./ myApp --platform=darwin --arch x64 --out dist --prune
electron-installer-dmg ./dist/myApp-darwin-x64/myApp.app myApp --out=./dist
```

#파일을 윈도우 밖으로 드래그할 수 있도록 만들기

파일을 조작하는 특정 종류의 애플리케이션들에서 파일을 Electron에서 다른 애플리케이션으로 드래그할 수 있는 기능은 중요합니다. 이 기능을 구현하려면 애플리케이션에서 ondragstart 이벤트가 발생했을 때 webContents.startDrag(item) API를 호출해야 합니다:

웹 페이지에서:
```
<a href="#" id="drag">item</a>
<script type="text/javascript" charset="utf-8">
  document.getElementById('drag').ondragstart = (event) => {
    event.preventDefault()
    ipcRenderer.send('ondragstart', '/path/to/item')
  }
</script>
```
메인 프로세스에서:
```
const {ipcMain} = require('electron')
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png'
  })
})
```

# eletron 으로 만들어진 어플

- Atom
- Slack
- Visual Studio Code
- Wagon (modern SQL editor)
- Postman (API 개발에 특화)
- Nylas N1 (이메일)
- Speak(화상채팅 프로그램)
- Jibo (family social robot)
- [기타 유용한 프로그램들](https://github.com/sindresorhus/awesome-electron)

## recommend tools

- electron-debug
- electron-reload
- electron-packager
- electron-builder
- electron-mocha
- devtron

## boilerplate Projects

- electron-boilerplate
- electron-react-boilerplate

## modules available to both

- clipboard
- crash-reporter

# recomand Editor

## Atom
```
apm install editorconfig es6-javascript atom-ternjs javascript-snippets linter linter-eslint language-babel autocomplete-modules file-icons
```
## VSCode

- Editorconfig
- ESLint
- Flow
- Babel
- Jest
- ES6 Snippets
- React Snippets 💡 If you are using the flow-for-vscode plugin, make sure to disable the flowtype-errors/show-errors eslint rule in the .eslintrc by setting it to 0

## Sublime

- Editorconfig Integration
- Linting
- ESLint Integration
- Syntax Highlighting
- Autocompletion
- Node Snippets
- ES6 Snippets

## Other

- Editorconfig
- ESLint
- Babel Syntax Plugin