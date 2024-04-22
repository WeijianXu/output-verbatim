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
import outputVerbatim from 'output-verbatim';
import { ref } from 'vue';

const content = ref('');
outputVerbatim('<b>H</b>ello, <b>W</b>orld!  <b>T</b>he <b>I</b>s <b>O</b>utput <b>V</b>erbatim.', {
  speed: 30, // Printing speed per word, 30 milliseconds a word, a cycle
  // Output one word per cycle, rich text will contain labels
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

## Options

| property  | description                                                                         | type     | default   |
| --------- | ----------------------------------------------------------------------------------- | -------- | --------- |
| speed     | Printing speed per word. One word, one cycle.                                       | Number   | 30        |
| eachRound | Output one word per cycle, rich text will contain labels                            | Function | undefined |
| before    | Callback function before printing starts, can be used for initialization operations | Function | undefined |
| complete  | Callback function at the end of the print that can be used for cleanup operations   | Function | undefined |

> Note: Input text can currently support rich text, but only one level, not nested.
> Such as `<b>bold<i>italic</i></b>` 时，会输出 `<b>bold<i>斜</b>` 而不是 `<b>bold<i>斜</i></b>`
> Therefore, the italic effect only takes effect at the end when it is fully printed.

## License

MIT
