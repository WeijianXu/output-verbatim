/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 15:15:45
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-06-24 19:08:44
 * @FilePath: \output-verbatim\src\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import markdownit from 'markdown-it';
import { VerbatimText, VerbatimOptions, VerbatimStringArray, StepInfo } from '../types/index.d';

const tagNameReg = /<\/?(\w+)\/?>/;

export function getTagName(str: string) {
  return str.match(tagNameReg)?.[1] || '';
}

export function splitRichText(str: VerbatimText, preText = ''): VerbatimStringArray {
  // 匹配任意的HTML标签及其内容
  const regex = /(<[^>]+>)|([^<]+)/g;
  const result = `${str}`.match(regex) || [];

  // 优化结果，将连续的文本合并为一个数组项
  let optimizedResult: VerbatimStringArray = [];
  let tagStack: string[] = [];
  for (let i = 0; i < result.length; i++) {
    const r = result[i];
    const isStartTag = r.startsWith('<') && !r.startsWith('</');
    const isEmptyTag = r.startsWith('<') && r.startsWith('/>');
    const isEndTag = r.startsWith('</') && r.endsWith('>');

    if (isEmptyTag) {
      optimizedResult.push(r);
    } else if (isStartTag) {
      tagStack.push(r);
    } else if (isEndTag) {
      // 取出标签名称
      const tagName = r.substring(2, r.length - 1);

      // 需要与栈顶元素匹配
      if (tagStack.length && tagStack[0]) {
        const isSameTag = tagStack[0] ? tagStack[0].indexOf('<' + tagName) == 0 : false;
        // console.log('tagName', tagName, isSameTag);
        tagStack.push(r);
        // 本次匹配结束
        if (isSameTag) {
          optimizedResult.push(tagStack);
          // 重置栈
          tagStack = [];
        }
      } else {
        // 这种情况下，栈为空，</p> 没有对应的 <p> 标签。
        // 造成这种情况，可能是因为HTML不规范，也可能是程序员手贱，也有可能 start 的位置将标签断开了。
        // 不论何种原因，我们认为这是一个错误，应该进行处理。
        // 处理方法：将整个标签作为一个文本项输出，而不是将其拆散。
        if (preText) {
          // 如果是 start 的问题，preText 不为空。optimizedResult可能有一个元素或者没有元素
          // 将 preText 作为一个元素压入，并将 tag 压入 optimizedResult
          // 示例：
          // preText = '<p>这是'
          // result = ['<b>', '加粗', '</b>', '的文字', '</p>'];
          // optimizedResult = [['<b>', '加粗', '</b>'], '的文字'];
          // 处理后：
          // tagStack = ['<p>这是', '<b>', '加粗', '</b>', '的文字', '</p>']]
          // optimizedResult = [['<p>这是', '<b>', '加粗', '</b>', '的文字', '</p>']];]
          // 将其作为栈低，最后输出到 StepInfo.prefix 上
          tagStack.push(preText, ...result.slice(0, i), r);
          optimizedResult = [tagStack];
          // 重置栈
          tagStack = [];
        }
        // 如果是 HTML 不规范，则忽略
        // continue;
      }
    } else {
      // 文本
      if (tagStack.length) {
        tagStack.push(r);
      } else {
        optimizedResult.push(r);
      }
    }
  }
  return optimizedResult;
}

function getCurrStepInfo(currStepStr: string | string[]): StepInfo {
  let text = '';
  let prefix = '';
  let suffix = '';
  let tag = '';
  if (Array.isArray(currStepStr)) {
    // 当前步长为数组，打印富文本
    // 富文本数组收尾是标签，如： ['<b>', '加粗', '</b>'] 、 ['<br/>']、 ['<i>', '</i>']
    // TODO 暂不支持嵌套标签， 如： ['<b>', '加粗', '<i>', '斜体', '</i>', '</b>']
    // 当出现文本标签截断的情况，开始标签不仅仅是标签元素本身，还有文本，如: ['<b>加粗<i>斜', '体', '</i>', '</b>'];
    prefix = currStepStr[0];
    suffix = currStepStr[currStepStr.length - 1];
    tag = getTagName(suffix);
    if (currStepStr.length >= 2) {
      text = currStepStr.slice(1, currStepStr.length - 1).join('');
    } else {
      text = '';
    }
  } else {
    text = currStepStr;
  }
  return { prefix, text, suffix, tag };
}

export default class VerbatimOutput {

  rawText: VerbatimText = '';

  richText = '';

  _start = 0;

  options: VerbatimOptions = {
    speed: 30,
    start: 0,
    rich: true,
    markdown: false,
    endLineBreak: false,
    stream: false, // 是否停止动效，原样输出
    stride: 1, // 步长
  };

  _intervalId = 0;

  constructor(text: VerbatimText, options: VerbatimOptions) {
    this.rawText = text;
    this.options = { ...this.options, ...options };
    this._start = this.options.start || 0;

    this.richText = this.handleRawText(text);
    this.outputRichText(this.richText, options);
  }

  handleRawText(text: VerbatimText) {
    // 处理换行符
    let richText = `${text}`.replace(/\n/g, '<br/>');
    // 处理Markdown语法
    if (this.options.markdown) {
      const md = markdownit({ html: true, xhtmlOut: true, linkify: true, breaks: true });
      richText = md.render(`${text}`, { hastNode: false }) as string;
      // 如果设置了 start ，此时 start 需要调整到正确为止
      if (this.options.start) {
        this._start = richText.indexOf(`${text}`.substring(0, 1)) + this.options.start;
      } else {
        this._start = 0;
      }
      // console.log('start', this.options.start, '_start', this._start);
    }
    // 处理结束换行符
    if (this.options.endLineBreak && (!richText.endsWith('<br/>') || !richText.endsWith('<br>'))) {
      richText = `${richText}<br/>`;
    } else {
      richText = richText.replace(/(<br\/?>|\n)$/, '');
    }
    return richText;
  }

  outputRichText(text: string, opts: VerbatimOptions = {}) {
    const options = { ...this.options, ...opts };
    let richText = text;
    if (!options.stream) {
      // 停止上一次的计时器
      this.stop();
      options.complete && options.complete(richText);
      return;
    }
    // 先打印起始文本
    let preText = '';
    if (this._start) {
      preText = text.substring(0, this._start);
      richText = text.substring(this._start);
      // console.log('pre text', preText, this._start);
      // options.eachRound && options.eachRound(preText, '');
    }

    if (!richText) {
      // console.error('No input text');
      // 没有要打印的字了
      options.complete && options.complete(this.handleRawText(this.rawText));
      return;
    }
    // 富文本方式，还是原字符输出方式
    const strList = options.rich ? (splitRichText(richText, preText) || []) : [richText];
    // let index = 0; // 打印游标
    let step = 0; // 打印步长
    let stepIdx = 0; // 当前步长游标
    let round = 0; // 当前周期循环次数

    let stepInfo = getCurrStepInfo(strList[step]);

    // 当start存在时，preText已经加入到strList中，不需要再次追加
    let currText = stepInfo.prefix === preText ? stepInfo.prefix : preText + stepInfo.prefix; // 当前打印文本
    let currStepStr = stepInfo.text;

    if (options.before) {
      options.before(currText + stepInfo.suffix);
    }

    // 停止上一次的计时器
    this.stop();

    // console.log('pre', preText, 'curr', currText);

    this._intervalId = setInterval(() => {
      if (step >= strList.length) {
        clearInterval(this._intervalId);
        if (options.complete) {
          // 打印完成，参数用于修正Markdown过程中的标签错误
          options.complete(this.handleRawText(this.rawText));
        }
        return;
      }
      // console.log('currStepStr', currStepStr);

      if (stepIdx < currStepStr.length) {
        currText += currStepStr[stepIdx];
        // index++;
        stepIdx += options.stride || 1;
        round++;
        // 当前轮次下的打印文本


        if (options.eachRound) {
          // console.log('currText', currText, 'round', round, 'stepIdx', stepIdx, 'step', step);
          options.eachRound(currText + stepInfo.suffix, currStepStr);
        }
      } else {
        // 本步长结束
        step++;
        stepIdx = 0;
        // 将本轮的结束标签加上
        currText += stepInfo.suffix;
        // 开始新的一轮
        stepInfo = getCurrStepInfo(strList[step]);
        currStepStr = stepInfo.text;
        currText += stepInfo.prefix; // 先加上开始标签，输出时加上结束标签
      }
    }, options.speed || 30) as unknown as number;
  }

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = 0;
    }
  }
}
