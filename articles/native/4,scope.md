# 作用域

值得注意的是, Key语言对`上下文context`和`作用域scope`这两个词的含义不作明确区分, 因为Key语言只扫描一次源码, 且过程中并不会和上下文产生任何联系(就连实际的`class`也是动态创建的), 因此上下文和作用域均为运行时期(`runtime`)的环境, 无需区分其区别, 因此你把作用域的参数写成`cx: Scope`(`cx`是`context`缩写`)并无歧义. 

## 变量和类

原生模块中, 你在一个作用域可以*读取*(`find`), *锁定*(`const`)和*创建*(`let`)变量. 

## 读取和锁定

试着使用`Scope`:

```rust
use key_native::prelude::*;

// 我们创建一个 变量名对应的变量 变为常量 的函数
fn lock(args:Vec<LitrRef>, cx:Scope)-> Litr {
  // 使用get_arg宏要求使用者第一个参数传入Str类型
  let id = get_arg!(args[0]:Str);
  // 我们先试着找到这个变量, 判断它到底存不存在
  let val = cx.find_var(id).expect(&format!("lock失败!该作用域没有{}变量",id));
  println!("找到{}变量:{:?}", id, val);
  // 调用cx.const_var将其锁定, 变成常量
  // 需要注意的是如果找不到这个变量会由Key解释器自动报错
  cx.const_var(id);
  Litr::Uninit
}

#[no_mangle]
fn main(m: &mut NativeModule) {
  m.export_fn("lock", lock);
}
```

让我们试试`lock`一个不存在的`ohno`变量: 

```
mod ...> m;
m-.lock("ohno");
```

顺利得到我们设置的报错(别忘了如果你不打算报错, 也可以直接在知道`find_var`得到`None`时返回`Litr::Uninit`):

```plain
> lock失败!该作用域没有ohno变量
...
```

看看`lock`成功的效果: 

```
let ohno = 20;
m-.lock("ohno"); // 打印:找到ohno变量:Int(20)
ohno = 30; // 报错:'ohno'已被锁定
```

### 创建变量

在原生模块中使用`let_var`和在Key语言中正常`let`行为一致(也能覆盖已有变量). 

`let_var`我认为最实用的场景莫过于`prelude`行为, 为一个作用域自动生成一系列函数, 变量或类供用户使用. 

```

```

// todo: wait_for_me()让主线程等待执行完毕