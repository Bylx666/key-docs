# extern

想变成编程大佬么? 一切系统语言的开端都是`extern`, 就连标准库中也全是包装了`extern`的函数. Key语言提供了`extern`语法供用户体验底层编程的乐趣(仅供体验, 脚本语言直接和C底层交互的行为本身是未定义行为). 

该语法不在Key语言标准之内. 

extern的意思是走读生(开玩笑的, 是外部函数的意思), 在Key语言中供用户体验读取 动态链接库(`dll`, `so`, `dylib`诸如此类) 函数的行为

类似`mod`, `extern`使用以下语法(Win32 API环境为例):

```
// 直球, 函数名会直接作变量名
extern kernel32> 
  GetStdHandle(n:Int)

// 别名调用, 前者是变量名, 后者是链接名Link Name(就是实际函数的名字, 也叫Symbol)
extern kernel32> {
  std: GetStdHandle(n:Int)
  write: WriteConsoleW(
    output:HANDLE,
    buffer:LPCVOID,
    charNum:DWORD,
    written:LPDWORD,
    rev
  )
}

let s = "原神, 启动!";
write(std(-11), s.to_utf16(), s.len)
```

简单说就是, `extern 动态链接库的路径>`开头, 无大括号就是只取一个函数, 有大括号就是取多个函数. 

链接名前可以使用`func_name: `前缀代表导出的变量名. 

其中定义的参数仅供用户读, Key语言是不管你写的参数类型的, 所以可以写一些看起来很装很底层的参数类型(也可以留空). 

上述函数打印出`原神, 启动!`, 是Windows系统提供的控制台函数. 你使用过其他语言在Windows上实现的`print`皆是由`GetStdHandle`和`WriteConsoleW`的函数实现的. 见[Win32 WriteConsoleW](https://learn.microsoft.com/zh-cn/windows/console/writeconsole).

值得注意的一点是, 微软文档虽然说函数叫作`WriteConsole`, 但其实在C的宏里面把`WriteConsole`自动转换成了`WriteConsoleW`, `WriteConsoleW`和`WriteConsoleA`的区别还请自行查询. 

上文中写的参数类型我简单介绍一下:

| 参数 | 用途 |
| --- | --- |
|`output: HANDLE`|就是一个指针,不知道指针的话就把他当作一个对象方便理解(其实就是指一个对象在内存里的位置)|
|`buffer: LPCVOID`|..另一个指针,表面意思是无法修改的数据(不可变指针),在WriteConsole中指你写入的字符串|
|`charNum: DWORD`|int32, 原意是32位带符号整数, 这里指Str的字符数量(可以通过s.len获取)|
|`written: LPDWORD`|int64, 不重要,可以去读上文提到的文档了解|

你甚至可以创建一个线程(见[Win32 CreateThread](https://learn.microsoft.com/zh-cn/windows/win32/api/processthreadsapi/nf-processthreadsapi-createthread)):

```
// 警告: 代码仅供实验, 不要在生产环境依赖extern
extern kernel32> {
  CreateThread(a,b,c,d,e,f)
  WaitForSingleObject(a,b)
}
let f(a) {
  print(a)
}
let thread_handle = CreateThread(,,f,22,,); // 类似thread.spawn
WaitForSingleObject(thread_handle,99999)    // 类似thread.join, 第二个参数是超时时间
```

在`extern`函数中传入Key语言的函数本身是未定义行为. 我的实现中只允许传入一个Key函数, 如果为任何`extern`函数传入了第二个Key函数将会导致原来的函数丢失, 导致第一个`extern`函数和第二个`extern`函数都指向后来的Key函数(这不是bug, 是原理上就实现不了).

别忘了`extern`后面是能填绝对路径的, 只有系统内置的库才不需要路径. 

## 技术底细

`extern`本质上只是**假设**所有的参数都是指针长度(64位系统上就是64位,8字节长), 返回值也是指针长度, 然后允许你把动态链接库中得到的函数直接通过解释器的参数转换而调用. 

参数转换的行为大致如下(一致转为指针长度的数值):

|type|behavior|
| --- | --- |
|`uninit`|`0`|
|`Uint`|直接传入|
|`Int`|直接传入|
|`Float`|直接传入(Key语言使用双浮点, 如果是32位系统需要转换)|
|`Bool`|`true:1`, `false:0`|
|`Str`|传入字符串指针, 不会自动在字符结尾补`\0`, 可能需要你手动加`\0`|
|`Buf`|直接传其指针(`buf.ptr`)|
|`Func`|将函数包装成`extern "C" fn`, 把函数指针存在全局变量(这一步就是导致不可能出现第二个Key函数传参的根本原因), 将该`extern`函数传参|
|`_`|不可将带有Key语言值的复杂类型传进`extern`函数|

导出的`Func`最多有`7`个参数, 导入的`extern`函数最多有`15`个参数. 
