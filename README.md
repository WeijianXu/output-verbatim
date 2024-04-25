<!--
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 12:03:52
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-25 16:03:24
 * @FilePath: \output-verbatim\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# output-verbatim

A js library that allows you to output your messages verbatim, such as in chatting.

## Fuctions

- Used to output messages in chat to achieve verbatim printout.

The effect is as follows：

![output-verbatim](./output-verbatim.gif)

## Usage

```vue
<template>
  <p v-html="content"></p>
</template>
<script setup>
import OutputVerbatim from 'output-verbatim';
import { ref, onUnmounted } from 'vue';

const content = ref('');
const output = new OutputVerbatim(
  '<b>H</b>ello, <b>W</b>orld!  <b>T</b>he <b>I</b>s <b>O</b>utput <b>V</b>erbatim.',
  {
    speed: 30, // Printing speed per word, 30 milliseconds a word, a cycle
    // Output one word per cycle, rich text will contain labels
    eachRound: function (currText) {
      console.log(currText);
      content.value = currText;
    },
    // Can be used to fix the problem of incorrect tags in Markdown syntax
    complete: function (finalText) {
      console.log(finalText);
      console.log('complete');
    },
  },
);

onUnmounted(() => {
  output.stop();
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

Frequent call scenarios:

```vue
<template>
  <p v-html="content"></p>
</template>
<script setup>
import OutputVerbatim from 'output-verbatim';
import { ref, onUnmounted } from 'vue';

const chartText = ref('');

// Encapsulation method for verbatim output
let output = null;
const verbatimOutput = (text, start) => {
  // chartText.value = '';
  let index = 0;
  // Stop previous output
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
    },
    complete: (finalText) => {
      chartText.value = finalText;
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

## Options

| property     | description                                                                         | type     | default   |
| ------------ | ----------------------------------------------------------------------------------- | -------- | --------- |
| speed        | Printing speed per word. One word, one cycle.                                       | Number   | 30        |
| start        | Start print begin at the index of the string, default is 0                          | Number   | 0         |
| rich         | Whether it is rich text, if so HTML tags are output directly.                       | Boolean  | true      |
| markdown     | Whether the characters are converted to HTML according to markdown syntax.          | Boolean  | false     |
| endLineBreak | Whether to add a line break at the end of the string.                               | Boolean  | false     |
| eachRound    | Output one word per cycle, rich text will contain labels                            | Function | undefined |
| before       | Callback function before printing starts, can be used for initialization operations | Function | undefined |
| complete     | Callback function at the end of the print that can be used for cleanup operations   | Function | undefined |

> Note: Input text can currently support rich text, but only one level, not nested.
> Such as `<b>bold<i>italic</i></b>` ，output will be `<b>bold<i>italic</b>` but not `<b>bold<i>italic</i></b>`
> Therefore, the italic effect only takes effect at the end when it is fully printed.

## License

MIT
