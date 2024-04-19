# 是否`Bool`

## 值

是为`true`, 否为`false`.

## 属性

`Bool`只有一个`rev`属性, 相当于`!`运算符. 

```ks
// true
log(true.rev == !true);
// true
log(true.rev == false);
```

## 方法

`Bool`只有一个`then`方法, 传入一个函数, 并在自己是`true`时运行并返回该函数的返回值. 

`false`则返回`uninit`.

```ks
true.then(||:233) == 233;
false.then(||:233) == ();
```
