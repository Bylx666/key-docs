# Key语言入门

## 安装

Key语言目前不提供安装器, 因此你需要下载`key-lang`可执行文件如`exe`, 并将其改名为`key`, 放置于`PATH`. 

下载`key-lang`: (Windows用户请下载`exe`后缀的文件)

- [直接下载exe](/asset/download/key.exe)
- [蓝奏云](https://www.lanzoub.com/b0mai7b2b) 密码`0x00`
- [Github](https://github.com/Bylx666/key-lang/releases/tag/0.1.6)

对于Windows用户, 下载完成后, 自己找一个或新建一个文件夹, 比如`D:\key-lang`, 将下载的`exe`放进去, 并将该`exe`的文件名改为`key`(该名字将是你命令行中会用的指令). 

之后将这个文件夹(以`D:\key-lang`为例)的路径, 写进`PATH`. 

写`PATH`的方法: Win10以上版本可以点击开始, 找到搜索框并搜索`path`, 点击`编辑系统环境变量`, 在弹出的窗口点击右下角的`环境变量`键: 

![修改path](/asset/imgs/guide.1.jpg)

弹出的窗口中, 双击`xxx的用户变量`下的`Path`栏, 在弹出的`Path`编辑窗口中点击右上角的`新建`

![修改path](/asset/imgs/guide.2.jpg)

在出现的输入框中输入放了`key.exe`的**文件夹**的路径, 如`D:\key-lang`, 之后点击确定. 或许此时需要重启才能生效. 

这时候我们应该有`key`命令了. 

```cmd
....> key
> Key Lang
  version: 100006
  by: Subkey
```

## hello world

Key语言使用`ks`文件名后缀. 

我们新建一个文件, 就叫它`a.ks`好了, 在其中写入如下内容: 

```ks
log("hello world!")
```

我们在该文件夹下打开控制台, 或打开`cmd`后使用`cd`到达此文件夹, 运行`key a.ks`命令, 即可看到输出`hello world!`. 

全局函数中最常用的莫过于`log`和`debug`, 他们用来向控制台打印消息. 

你还可以用`fmt`把第一个字符串参数的`{}`替换为后续参数. 

```ks
log(fmt("我的名字是:{}", "芙卡洛斯"));
```

更有趣的是, 你可以使用反引号``` `` ```包裹的字符串配合`{}`来捕获变量. 

```ks
let a = 5;
log(`a的值是:{a+5}`);
// a的值是:10
```

## 提示

如果你使用的是电脑或带有键盘的平板, 请试着点击各个代码右上角的`>`运行按钮, 跳转到演武场`Key Playground`进行在线尝试! 别忘了跳转后打开你的控制台(`F12`)来查看运行结果. 

该文档中你可以在一篇文章读完后**继续向下滚动**, 即可自动跳转到下一篇 (上翻同理). 屏幕左上方的**返回键**或许也能对你有所帮助. 

我隐藏了浏览器的滚动条, 对于左右溢出的内容, 别忘了可以`shift`键+`滚动`来左右滚动哦. 

下一篇: <jmp to="guide/1.let/">变量声明</jmp>

全局函数参见<jmp to="/prim/global">全局函数</jmp>.

原生开发参见:<jmp to="/native">原生模块开发指南</jmp>. 
