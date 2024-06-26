# 列表`List`

## 属性

|属性|用途|
|--|--|
|`len`|获取列表实际长度|
|`capacity`|获取列表的总容量|

`len`和`capacity`都会得到`Uint`类型的值, 其区别在于: `capacity`只会大于等于`len`, `len`代表的是实际长度而`capacity`是它的实际占用内存的长度. 在长度增加时, 如果`capacity`有剩余就会直接加入新元素, 如果不够便会进行扩容`expand`行为. 

`List`可以使用整数作为索引读取索引处的值. 若数字超出范围则返回`uninit`. 写入索引处的值时若索引超出范围则什么也不做. 

## 实例方法

### --增删--

### `push`

在列表最后插入单个元素(任意类型都可). 

只有一个参数, 无返回值

### `push_front`

在列表开头插入单个元素(任意类型)

只有一个参数, 无返回值

### `pop`

删除最后一个元素并返回被删除的元素, 无参数. 

若列表长度为0则返回`uninit`.

### `pop_front`

删除第一个元素并返回被删除的元素, 无参数.

若列表长度为0则返回`uninit`.

### `insert`

在指定索引插入单个元素. 

需要传入一个整数(`Int|Uint`)和一个元素(任意类型). 

### `insert_many`

在指定索引处插入多个元素. 

需要传入一个整数(`Int|Uint`)和一个列表或数组(`List|Buf`)

```ks
let a = [1,5,1,4];
// 在索引1处插入[1,4]
a.insert_many(1, [1, 4]);
log(a); // [1,1,4,5,1,4]
```

### `remove`

删除指定索引的元素. 

需要一个整数(`Int|Uint`), 返回被删除的元素. 也可以传入第二个整数代表删除元素数量, 返回被删除的元素列表. 

如果被删除元素数量超出列表边界, 则删除到列表结尾. 

```ks
let a = [1,3,1,4,1,2,5];
// 删除索引[4]开始的两个元素
log(a.remove(4, 2)); // [1, 2]
log(a); // [1,3,1,4,5]
```

### `splice`

在指定索引a删除到索引b, 并在删掉的地方插入列表, 可谓是`remove + insert`

需要3个参数: 整数索引(`Uint|Int`)(包含), 整数删除终点索引(不包含), 插入的元素列表(`List|Buf`). 

### `slice`

将列表裁剪为选定范围. 

可传入一个整数起始索引(`Uint|Int`)(包含, 默认为`0`), 可传入一个整数终点索引(不包含, 默认为列表长度). 

不修改原列表, 返回一个裁剪后的列表`List`. 

如果需要修改原列表的同时返回被裁剪的列表, 使用[`remove`](#remove)方法. 

### `concat`

需要传入一个列表或数组(`List|Buf`).

相当于自动使用结尾索引的`insert_many`(`list.insert_many(list.len, [...])`)

### --遍历--

### `for_each`

传入一个只有一个参数(会得到被遍历的元素)的函数, 遍历列表, 无返回值. 

### `map`

传入一个只有一个参数的函数, 返回一个映射后的新列表. 

```ks
log([2,4,6,5,3].map(|n|:n/2)); // [1,2,3,2,1]
```

### `sort`

传入一个参数(可选, 返回`false`则调换`a b`位置, 默认正序排序), 排序一个列表. 无法比较的类型将被视为相同并放在同一层. 

```
let a = [5,10,9,3,22];
// 尝试逆序排序
a.sort(|a,b|:a<b);
log(a); // [22, 10, 9, 5, 3]
```

### `dedup`

传入一个函数(可选), 将列表相邻重复值去除, 可以和[`sort`](#sort)联用. 

```ks
let a = [2,4,2,5,1,4];
a.sort();
// 得到2个参数, 返回true则删除, false则保留
a.dedup(|a,b|:a==b);
log(a); // [1, 2, 4, 5]
```

### `filter`

传入一个函数, 为列表筛选出该函数返回true的元素. 返回一个新的筛选过的列表. 

```ks
log([2,4,6,8].filter(|n|:n>5)); // [6, 8]
```

### `fold`

将列表折叠出一个值. 该函数效率似乎不如普通的`for`, 但不妨碍它方便. 

传入一个初始值, 传入一个函数(有两个参数, 一个初始值现在的值, 一个现在遍历的元素, 返回值会成为初始值最新的值). 

```ks
// 求所有列表的长度和
log([[0,0,0,0], [0,0,0], [0]].fold(0, |init, now|
  :init + now.len
)); // 8
```

### --搜索--

### `last`

无参数, 返回最后一个元素. 如果需要删除最后一个元素可以使用[`pop`](#pop). 

### `index_of` `r_index_of`

从左往右找一个元素的索引(返回`Uint`). 无结果则返回`uninit`

需要传入一个值(任意类型). 

`r`版本从右往左寻找. 

### `find` `r_find`

传入一个函数(一个参数, 得到当前遍历的值), 从左往右寻找并返回第一个函数返回`true`的元素. 无结果则返回`uninit`.

`r`版本从右往左寻找. 

### `all`

判断所有元素是否都满足条件. 

传入一个函数(一个参数, 得到当前遍历的值), 只要过程中有一个函数返回`false`就返回`false`, 否则返回`true`

对于`any`, 可以使用`find(..)==uninit`替代

### `min` `max`

获取列表中的最(小/大)值. 

### --本征--

不太好分类的方法被我分类到这里. 

### `join`

将列表拼接为字符串, 传入一个分隔符(可选)

```ks
log([2, "ok", 999].join(".")) // "2.ok.999"
```

### `to_buf`

将列表转换为数组(`Buf`)(不修改原列表)并返回. 

### `fill`

需要一个参数(任意类型), 将列表全部填充为该值. 无返回值.

### `rotate`

将列表向右旋转n位, 可传入第二个参数true代表向左旋转. 

旋转的意思是: 向右整体移动, 溢出的部分放到最左边. 

### `expand`

扩容列表的capacity, 需要传入`n`代表扩容量. 一般情况你应该用不到这个, 需要扩容时应该是用`concat`.


## 静态方法

### `new`

创建一个新列表, 可选2个参数: 

|参数|类型|默认值|用途|
|--|--|--|--|
|n|`Uint\|Int`|`0`|初始列表大小|
|def|`any`|`uninit`|默认填充值|
|返回值|`List`|`-`|用`def`填充的,`n`大小的新列表|

### `from_iter`

传入一个可迭代的任何值, 将其迭代成为一个完整列表. 

```ks
log(List::from(5)); // [0,1,2,3,4]
```

### `from_buf`

传入一个数组, 将其转为列表. 

### `concat`

拼接任意数量的列表. 

```
debug(List::concat([2,4,6], '114', ["ok", "Err"]));
// List([Int(2), Int(4), Int(6), Uint(49), Uint(49), Uint(52), Str("ok"), Str("Err")])
```
