# output-verbatim

这是一个 JS 库，你可以使用它逐字逐句的输出文本，例如在聊天过程中。

## 功能

- 用于在聊天中输出消息，实现逐字逐句打印的效果

效果图如下：

![output-verbatim](./output-verbatim.gif)

## 使用

```vue
<template>
  <p v-html="content"></p>
</template>
<script setup>
import outputVerbatim from 'output-verbatim';
import { ref } from 'vue';

const content = ref('');
outputVerbatim('<b>H</b>ello, <b>W</b>orld!  <b>T</b>he <b>I</b>s <b>O</b>utput <b>V</b>erbatim.', {
  speed: 30, // 打印每个字的速度，30毫秒一个周期一个字
  // 每个周期输出一个字，富文本会包含标签
  eachRound: function (currText) {
    console.log(currText);
    content.value = currText;
  },
});
</script>

<style lang="scss">
p {
  letter-spacing: 4px;
  // text-align: center;
  font-size: 1.25rem;
  line-height: 1.5;

  b {
    font-size: 1.125em;
    font-weight: bold;
    background: linear-gradient(180deg, #c191ff 0%, #4584ff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 6px;

    &:first-child {
      margin-right: 0;
    }
  }
}
</style>
```

频繁调用时:

```vue
<template>
  <p v-html="content"></p>
</template>
<script setup>
import OutputVerbatim from 'output-verbatim';
import { ref, onUnmounted } from 'vue';

const chartText = ref('');

// 逐字输出的封装方法
let output = null;
const verbatimOutput = (text, start) => {
  // chartText.value = '';
  let index = 0;
  // 停止上一次输出
  if (output) {
    output.stop();
  }
  output = new Verbatim(text, {
    speed: 30,
    start: start >= 0 ? start : 0,
    before: (preText) => {
      chartText.value = preText;
    },
    eachRound: (currText) => {
      console.log(currText);
      chartText.value = currText;
      ctx.emit('verbatim', ++index);
    },
    complete: (finalText) => {
      chartText.value = finalText;
      ctx.emit('verbatim', 0);
    },
    markdown: true,
  })
};

// mock async call
let index = 0;
let content = '';
const timer = setInterval(() => {
  const start = content.length;
  content = content + Array(5).fill(index).join('');
  verbatimOutput(content, start);
  index++;
  if (index > 10) {
    clearInterval(timer);
  }
}, 100);

onUnmounted(() => {
  output.stop();
});
```

## 说明

| 参数         | 说明                                                           | 类型     | 默认值    |
| ------------ | -------------------------------------------------------------- | -------- | --------- |
| speed        | 打印周期，默认 30 毫秒一个周期                                 | Number   | 30        |
| start        | 传入字符从那里开始，默认从 0 开始，否则，从指定的 index 开始。 | Number   | 0         |
| rich         | 是否为富文本                                                   | Boolean  | true      |
| markdown     | 是否按照 markdown 格式将字符转成 HTML 输出                     | Boolean  | false     |
| endLineBreak | 是否在输出的最后添加换行符，默认为 false                       | Boolean  | false     |
| eachRound    | 每个周期输出一个字，富文本会包含标签                           | Function | undefined |
| before       | 打印开始前的回调函数，可用于初始化操作                         | Function | undefined |
| complete     | 打印结束后的回调函数，可用于清理操作                           | Function | undefined |

> 注意： 输入文本目前可以支持富文本，但是只支持一级，不能嵌套。
> 即 `<b>加粗<i>斜体</i></b>` 时，会输出 `<b>加粗<i>斜</b>` 而不是 `<b>加粗<i>斜</i></b>`
> 因此斜体效果，只有最后完全打印的时候才生效。

## License

MIT
