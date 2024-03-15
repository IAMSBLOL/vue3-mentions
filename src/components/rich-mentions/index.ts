import Vue3Mentions from './RichMentions.vue'

import MentionsSelect from './MentionsSelect.vue'

export * from './mentionsTypes'

export default Vue3Mentions

export {
  MentionsSelect
}

// 组件调用时，提供代码提示
declare module 'vue' {
  export interface GlobalComponents {
    Vue3Mentions: typeof Vue3Mentions;
  }
}
