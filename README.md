# output-verbatim

A js library that allows you to output your messages verbatim, such as in chatting.

## 功能

- 用于在聊天中输出消息，实现逐字逐句打印的效果

效果图如下：

![output-verbatim](./output-verbatim.gif)

## 使用

```js
import outputVerbatim from 'output-verbatim';

outputVerbatim('<b>H</b>ello, <b>W</b>orld!', {
  speed: 30, // 打印周期，30一个周期毫秒
  // 每个周期输出一个字，富文本会包含标签
  eachRound: function (currText) {
    console.log(currText);
  },
});
```

## 说明

| 参数      | 说明                                   | 类型     | 默认值    |
| --------- | -------------------------------------- | -------- | --------- |
| speed     | 打印周期，默认 30 毫秒一个周期         | Number   | 30        |
| eachRound | 每个周期输出一个字，富文本会包含标签   | Function | undefined |
| before    | 打印开始前的回调函数，可用于初始化操作 | Function | undefined |
| complete  | 打印结束后的回调函数，可用于清理操作   | Function | undefined |

> 注意： 输入文本目前可以支持富文本，但是只支持一级，不能嵌套。
> 即 `<b>加粗<i>斜体</i></b>` 时，会输出 `<b>加粗<i>斜</b>` 而不是 `<b>加粗<i>斜</i></b>`
> 因此斜体效果，只有最后完全打印的时候才生效。

## License

MIT
