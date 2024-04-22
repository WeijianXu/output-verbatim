/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 15:04:09
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-22 17:44:54
 * @FilePath: \output-verbatim\types\index.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 15:04:09
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-18 10:25:10
 * @FilePath: \output-verbatim\types\index.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export type VerbatimText = string | number;

export interface VerbatimOptions {
  /**
   * 字符打印速度
   */
  speed?: number;
  /**
   * 是否是富文本
   * 如果是，则将按照传入的数据富文本形式打印
   * 如果否，则按照原始数据打印
   */
  rich?: boolean;

  /**
   * 传入字符从那里开始，默认从0开始，否则，从指定的index开始。
   * 位置小于start的字符，原样输出，没有逐字逐句打印效果
   */
  start?: number;

  eachRound?: (currRichText: string, richText: string) => void;

  before?: () => void;

  complete?: () => void;

  // customMade?: boolean;
}
/**
 * 按照传入的数据和配置进行打印
 *
 * @param text 需要打印的文本内容
 * @param options 配置项
 */
export default class VerbatimOutput {

}
