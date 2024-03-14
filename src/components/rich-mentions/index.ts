import Vue3Mentions from './RichMentions.vue'
export * from './mentionsTypes'
export { type Vue3MentionsProps } from './RichMentions.vue'
export default Vue3Mentions

// 组件调用时，提供代码提示
declare module 'vue' {
  export interface GlobalComponents {
    Vue3Mentions: typeof Vue3Mentions;
  }
}
