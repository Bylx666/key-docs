# 数组`Buf`

熟练使用数组`Buf`不是件容易事. 如果是编程入门者, 希望你在熟悉`List`的使用后再考虑`Buf`. 

## 属性

|属性|用途|
|--|--|
|`len`|获取实际字节数|
|`capacity`|获取内存占用字节数|
|`ptr`|获取自己的指针|

3个属性皆返回`Uint`类型. 

`Buf`可以使用整数作为索引读写索引处的值`Uint`, 若数字超出数组范围则返回`uninit`. 写入索引处的值时若索引超出范围则什么也不做. 

## 实例方法

### --数字读写--

### `read`

在指定索引读取一个值, 可选3个参数:

|序号|参数|类型|默认值|用途|
|--|--|--|--|--|
|0|index|`Uint\|Int`|`0`|内存偏移量|
|1|type|`Uint\|Int`|`8`|`8`,`16`,`32`,`64`之一, 读取的bit长度|
|2|rev|`Bool`|`false`|反转字节序|

返回`Uint`, 若读取位置超出了数组范围则返回`0`. 

```ks
let a = '{04 79}';
// 在索引0处以大字端(如果你是小字端cpu的话)读取u16
log(a.read(0, 16, true)); // 1145
```

### `read_float`

在指定索引处读取一个双浮点. 可选2个参数. 

|序号|参数|类型|默认值|用途|
|--|--|--|--|--|
|0|index|`Uint\|Int`|`0`|内存偏移量|
|1|rev|`Bool`|`false`|反转字节序|

返回`Float`(双浮点), 如果(索引+8)超出数组范围则返回`0`

```ks
let a = '{1F 85 EB 51 B8 1E 09 40}';
// 在索引0处以小字端读取一个double
log(a.read_float(0)); // 3.14
```

### `write`

在指定索引处写入一个`Buf`, 如果传入`List`则自动转换. 

需要传入2个参数: 

|序号|参数|类型|用途|
|--|--|--|--|
|0|index|`Uint\|Int`|内存偏移量|
|1|buf|`Buf\|List`|写入值|

无返回值, 若写入值长度超出了数组长度, 则只写到数组结束, 写入值剩余部分被忽略. 

```ks
let a = '{00 00}';
// 将Uint值1145转为16位数组并反转, 写入a
let to_write = 1145u.as16();
to_write.rev();
a.write(0, to_write);
log(a); // Buf[04, 79]
```

### --修改--

### `pop` `pop_front`

无参数, 删除最后一个数字并返回`Uint`. 

可传入一个整数作为数量`n`, 像是`split`的行为, 将从最后开始的`n`个元素切出来并返回`Buf`. `n`值必须小于等于数组长度. 

`pop_front`则从开头删除或切割. 

```ks
let a = '{11 45 14}';
// 把最后两个元素切出来
log(a.pop(2), a); // Buf[45, 14] Buf[11]
```

### `push` `push_front`

将一个整数**或数组**推进数组的最后. 若传入列表则会自动转换为数组. 无返回值. 

`push_front`将其推至开头, 原来的数据向后平移. 

### `copy_within`

在数组内就地复制. 需要3个参数, 无返回值.

|序号|参数|类型|用途|
|--|--|--|--|
|0|start|`Uint\|Int`|开始索引(包含)|
|1|end|`Uint\|Int`|结束索引(不包含)|
|2|to|`Uint\|Int`|目的地索引|

所选部分移动至目的地索引时如果超出了数组范围, 则超出范围被忽略, 只写入未超出部分. 

```ks
let a = '{00 00 00 11 22 33}';
// 将索引3-6的部分复制到索引0处
a.copy_within(3, 6, 0);
log(a); // Buf[11, 22, 33, 11, 22, 33]
```

### `repeat`

传入一个整数`n`, 返回一个**新的**将已有数组重复`n`次的数组. 

### `insert`

需要2个参数: 第一个是整数的插入索引`i`, 第二个参数决定该函数的行为: 

1. 列表或数组: 在`i`处插入整个数组, 列表会自动转换为数组. 
2. 整数: 在`i`处插入单个数字
3. 其他类型会导致直接在`i`处插入一个`0`.

### `remove`

需要传入一个整数作为删除索引, 返回被删除的值. 

可选传入第二个整数作为删除数量, 返回被删除的数组内容. 

```ks
let a = '{11 45 14 19 19}';
// 从索引2开始切出2个元素
log(a.remove(2, 2), a);
// Buf[14, 19] Buf[11, 45, 19]
```

### `splice`

需要3个参数: 

|序号|参数|类型|用途|
|--|--|--|--|
|0|start|`Uint\|Int`|开始索引(包含)|
|1|end|`Uint\|Int`|结束索引(不包含)|
|2|insert|`Uint\|Int\|Buf\|List`|插入值|

行为是删除索引`start`到索引`end`的元素, 并在删除的地方插入`insert`值. 如果是`Buf`和`List`会直接整组插入, 如果是整数则会插入单个整数, 传入其他类型则会导致在此处插入一个`0`. 

返回值为被删除的元素组成的数组`Buf`. 

### `fill`

可选3个参数: 

|序号|参数|类型|默认值|用途|
|--|--|--|--|--|
|0|val|`Uint\|Int`|`0`|填充值|
|1|start|`Uint\|Int`|`0`|开始填充点(包含)|
|2|end|`Uint\|Int`|`buf.len`|结束填充点(不含)|

无返回值, 将索引`start`到`end`填充为`val`值. 

```ks
let a = '{11 45 14 19 19}';
// 将索引2-4的部分填充为0
a.fill(0, 2, 4);
log(a);
// Buf[11, 45, 00, 00, 19]
```

### `rotate`

向右旋转数组, 可选2个参数: 

|参数|类型|默认值|用途|
|--|--|--|--|
|n|`Uint\|Int`|`0`|旋转格数|
|left|`Bool`|`false`|向左旋转|

若旋转格数大于数组长度, 则对其取余得到小于数组长度的旋转格数. 若`left`为`true`, 则向左旋转, 否则向右旋转. 

旋转的行为就是将所有元素向右平移`n`格, 并将溢出的元素放回左侧. 

### `rev`

反转整个数组. 无参数, 无返回值. 

### `slice`

可选2个参数(皆为整数): 

|参数|默认值|用途|
|--|--|--|
|start|`0`|起始索引(包含)|
|end|`buf.len`|结束索引(不含)|

返回数组索引`start`到索引`end`的部分. 

### --迭代--

### `for_each`

需要传入一个函数, 函数接受一个参数作为当前迭代的值(`Uint`). 无返回值. 

个人认为该函数的实用性不如使用`for n:buf`这样的迭代器来得高效. 

### `map`

需要传入一个函数, 接受一个参数作为当前迭代的值`Uint`, 该函数需要返回一个整数(`Uint|Int`), 非整数会当作`0`处理. 

返回一个映射后的数组. 

```ks
let a = '{01 12 23 34}';
log(a.map(|n|:n*2))
// Buf[02, 24, 46, 68]
```

### `fold`

传入一个初始值(不限类型), 传入一个函数(接收初始值和当前迭代的值`Uint`, 返回和初始值类型相同的值, 该返回值会作为下一次迭代时的初始值), 返回初始值最后的样子(该过程中初始值会被频繁复制, 请避免使用复杂类型作为初始值). 

```ks
let a = '{01 03 05 07}';
// 初始值为0, 函数将初始值和当前值不断求和
log(a.fold(0, |init, n|:init + n));
// 16
```

### `dedup`

数组去重, 自动将相邻的重复的元素去除. 和[`sort`](#sort)方法联用效果更佳. 

可传入一个函数, 接受前一个值和当前值(皆为`Uint`), 返回`Bool`决定是否去除(返回`true`则保留, 返回其他值则去除). 

```ks
let a = '{01 05 02 06 03}';
// 将前一位的值大于等于当前值的直接去除
a.dedup(|a, b|:a<b);
log(a); // Buf[01, 05, 06]
```

### `sort`

数组排序, 自动将数组由小到大排序. 可以和[`dedup`](#dedup)方法联用实现全数组去重. 

可传入一个函数, 接受前一个值和当前值(皆为`Uint`), 返回`Bool`决定是否换位(返回`true`则换位, 返回其他值则不动). 

```ks
// 数组完全去重
let a = '{01 05 02 06 02 03 05}';
a.sort();
a.dedup();
log(a);
// Buf[01, 02, 03, 05, 06]
```

```ks
// 通过sort逆序排列
let a = '{02 04 03 05}';
a.sort(|a,b|:a<b);
log(a);
// Buf[05, 04, 03, 02]
```

### `filter`

传入一个接受当前值`Uint`作为参数的函数, 返回一个只包含该函数返回`true`的元素的新数组. 

```ks
let a = '{02 04 06 08}';
log(a.filter(|n|:n>5));
// Buf[06, 08]
```

### `part`

和`filter`使用一样, 但返回过滤结果为`true`的数组, 自己留下的是过滤结果为`false`的数组. 

```ks
let a = '{02 04 06 08}';
log(a.part(|n|:n>5), a);
// Buf[06, 08] Buf[02, 04]
```

### `all`

传入一个函数, 该函数接受一个参数`Uint`作为当前迭代的值, 且该函数应当返回`Bool`作为判断结果. 

返回值为`Bool`, 表达了数组是否全部被传入的函数认定为`true`. 

### --检索--

### `replace`

替换内容并返回替换后的`Buf`. 不修改原`Buf`.

有三个参数: 

|序号|参数|类型|默认值|作用|
|--|--|--|--|--|
|0|search|`Buf\|Str`|不可省略|搜索的`Buf`|
|1|replace|`Buf\|Str`|`''`(空`Buf`)|替换为的`Buf`|
|2|times|`Uint\|Int`|无限|最多替换次数, 不填则是替换所有|

将`search`替换为`replace` `times`次. 

参数传入`Str`时会以`Str`的`utf8`字节码进行搜索和替换. 

```ks
let a = '原龙水龙草龙';
// 将utf8的'龙'替换为utf8的'神' 2次
log(a.replace('龙', '神', 2).as_utf8());
// 原神水神草龙
```

### `includes`

需要一个参数, 返回值为`Bool`. 参数类型影响判断行为: 

1. 若传入了`Str`或`Buf`, 则搜索自己是否存在该`Buf`. `Str`自动转为utf8的`Buf`.
2. 若传入了一个整数, 则判断数组中是否存在该整数. 
3. 其他类型则会被直接判断数组中是否存在`0`. 

```ks
let a = '{AD DE 89 23}';
log(a.includes('{DE 89}')); // true
```

### `index_of` `r_index_of`

传入一个整数`n`, 从左向右寻找第一次出现`n`的索引. 

返回值为`Uint`, 若无结果则返回`uninit`. 

`r_index_of`则从右往左寻找. 

### `min` `max`

无参数, 返回值为`Uint`, 获取数组中最小/大的值. 

若数组为空则返回`0u`. 

### --转换--

以下方法均无参数. 

|方法|返回值|
|--|--|
|`as_utf8`|将数组作为utf8解析为字符串`Str`|
|`as_utf16`|将数组作为utf16转码为utf8字符串`Str`|
|`to_list`|将数组转换为元素皆为`Uint`的列表`List`|

转为字符串的方法中, 错误编码会转成`U+FFFD`而不会报错. 与之对应的<jmp to="/prim/str#from_utf8">`Str::from_utf8`</jmp>和<jmp to="/prim/str#from_utf8">`Str::from_utf16`</jmp>则会在遇到错误时直接抛出. 

### `join`

传入一个分隔符`Str`(可选, 默认为`""`), 将`Buf`内容以**十六进制**的格式拼接为字符串. 

### --本征--

### `last`

无参数, 读取最后一个元素并返回`Uint`. 

### `expand`

传入一个整数, 为`Buf`扩容(如果`buf.capacity`本身足够则可能什么也不做). 

## 静态方法

### `new`

创建一个新的空数组. 

可传入一个整数代表数组长度, 数组内容均被初始化为`0`. 

### `new_uninit`

可传入一个整数作为分配大小, 直接分配一片未初始化的内存, 数组内容可能是任何`u8`数字. 

### `from_list`

传入一个列表, 将其转换为数组. 列表中非整数的元素会直接被替换为`0`. 

### `from_iter`

传入一个可迭代的值, 将其转换为数组. 

```ks
log(Buf::from_iter(5u));
// Buf[00, 01, 02, 03, 04]
```

### `from_ptr`

传入一个指针`Uint`和一个长度`Uint|Int`, **复制**该片内存并创建一个新数组. 

之所以需要复制, 是因为我不建议直接在ks中直接获取一片内存的所有权, 因为经常出现非常棘手的内存分配问题. 

### `concat`

传入任意数量的`Buf`或`Str`, 并合并为单个`Buf`. 

需要注意的是你可以使用[`push`](#push-push_front)方法在数组后面合并上新数组, 相当于实例方法版的`concat`了. 
