# Rust简单入门

## 安装

注意: 由于目前Key语言只发行了64位解释器, 你的电脑也必须是64位才行. 下述安装过程如果中途出现问题, 希望你能善用搜索引擎. 国内我不再推荐百度进行编程知识学习(只剩下AI废话了), `Bing`或许也是更好的选项. 

访问[Rustup](https://rustup.rs/)的网站(比官网下载快太多了), 点击中间的蓝字`rustup‑init.exe`, 下载完成后运行该程序, 无脑enter, 等待其执行完毕后打开命令提示符, 运行`cargo -V`看看能否正常打印`cargo`版本, 如果能的话我们继续. 

访问[MSVC Build Tools](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/), 点击下载生成工具, 启动后勾选使用`C++的桌面开发`, 右侧可选栏中勾选`MSVC...`和`Windows 11 SDK`或者是`Windows 10 SDK`. 安装完成后在命令行中输入`cl`和`link`, 看看能不能找到这两个指令, 能的话继续下一步. (其实这时候你已经可以用`cl`编译`C++`了, rust需要的是`link`, `cl`应该是套餐附赠)

![MSVC安装过程](/asset/imgs/native.1.png "至少我是这么勾选的")

到了此处安装环境应当已经配置完毕.

你有[`VSCode`](https://code.visualstudio.com/)么? 我极力推荐Rust语言使用`Visual Studio Code`程序进行编程, 因为Rust官方为`VSCode`专门做了插件, 使用体验不亚于ide. `Jetbrain`正在推出体验版的`RustRover`, 如果你是`Jetbrain`的粉丝的话或许可以考虑使用. 

`Vscode`的安装我不再赘述. 在`Vscode`安装完成后, 点击扩展, 搜索`rust-analyzer`并安装, 从此编程环境配置完成. 

## Hello, Rust!

我假设你的电脑上有这样的路径(我也推荐你在电脑上这样建立文件夹): `D:/code/rust/`, 我们在`rust`文件夹下新建一个`tst`文件夹好了(`test`的名字rust不让用). 打开`VSCode`, 点击菜单里的`文件`->`打开文件夹`, 并选择`D:/code/rust/tst`文件夹(也可以直接把这个`tst`文件夹拖进`VSCode`). 按下` ctrl + shift + ~(esc下面的反引号)` (或者`终端->新建终端`)会发现底下弹出来一个命令行.

此终端会自动定位(`cd`)到刚创建的`tst`文件夹, 此时输入`cargo init`, 就会发现目录里多了一个`src`文件夹和`Cargo.toml`, 此时你直接运行`cargo run`便会打印`hello world!`. 

## `println!`

`println!()`是什么玩意? 这个长得像函数, 但带个感叹号的叫声明宏, 不用太在意怎么声明, 我们先考虑`println!`的用法:

`println!`第一个参数必须是字符串, 中间可以写`{}`用于格式化. 

```rust
let a = 20;
println!("a is {}", a); // 打印 a is 20
println!("a is {a}"); // 新版rust还支持这样的语法
```

有一些时候, 你的变量比较复杂, 直接格式化会报错. 只要在大括号里加上`:?`就能正常运行. 

```rust
let a = [1u8,3,5]; // 告诉Rust第一个数字是无符号8位整型
                   // Rust就能自动推断, 断言这是一个u8的数组([u8;3])
println!("oh no: {}", a); // 报错xx doesn't implement `std::fmt::Display`
println!("oh yes: {:?}", a); // [1, 3, 5]
```

## 函数和闭包

使用一个函数:

```rust
fn a(s:&str)-> String {
  String::from(s)
}

fn main() {
  println!("{}", a("芙卡洛斯"));
}
```

? `str`和`String`怎么同时出现了, 这函数也不写个`return`? 

1. 在Rust中, `&str`代表一个字符串的引用(`"xxx"`的字面量类型为`&str`), `String`代表拥有所有权的`str`. 简单说就是, `String`比`&str`更实用, 如果发现`&str`过不去编译就把它`String::from`一下往往就能过编译了. 
2. Rust的任何块(`{}`)中的最后一个语句如果没有分号, 就是这个块的返回值. 举个例子:

```rust
let a = if 1>0 {true} else {false};
assert!(a==true); // assert就是判断的意思, 如果判断失败就会报错
                  // 各个程序中经常使用assert_eq!(a,b)来告诉你a和b相等.
```

Rust中的块都是有返回值这一说的, 所以分号在Rust中格外重要. 

有个非常重要的事情, Rust的函数是无法捕获环境变量的. 此时你需要使用闭包来解决问题. 

```rust
fn main() {
  let a = 5;
  fn f() {
    println!("{a}"); // 错误
  }
  let f = || println!("{a}"); // 可行
}
```

另外, 闭包的声明如果没有捕获环境变量, 是可以隐式转换成普通函数的. 

```rust
let f:fn()-> u8 = ||20; // 可行
// 等价于
fn f()-> u8 {20}
```

## 报错

Rust中使用`panic`声明宏来报错, 语法和`println!`一样. 

```rust
panic!("oh no, I'm panicking");
println!("我无法被运行到");
```

## 最后

关于引用, 指针, `enum`, `struct`, 可变性, `unsafe`系列(含`transmute`的使用)等基础知识, 我推荐阅读[Rust 语言圣经](https://course.rs/). 如果你喜欢按部就班的心情学, 就按照该网站的序号一步一步来即可. 如果你是喜欢效率, 喜欢探寻本质的心情, 就直接以[实现一个web服务器](https://course.rs/advance-practice1/intro.html)为线索, 将过程中遇到的概念一点一点补齐. 

不要勉强自己, 走一步算一步, 即使你无法学完该课程, 你仍然可以编译出Key语言原生模块, 仍然可以使用Rust的热门库. 在使用热门库的过程中磨练自己永远是可选项. 但出于上述课程更偏向于基础知识和底层实现相关的教程, 理解该课程的一切只是Rust学习过程的时间问题. 

感谢你能读到这里, 也证明了你对Rust学习的热情. 慢慢来, 时间会证明一切. 
