import { defineComponent, type SlotsType, type PropType } from 'vue'
import { initDefaultProps } from '@/utils'
import styles from './ExampleContainer.module.scss'
const ExampleContainer = defineComponent({
  slots: Object as SlotsType<{
    content:any
  }>,
  props: initDefaultProps({
    title: String as PropType<string>
  }, { title: '默认使用' }),

  setup (props, ctx) {
    const { title } = props
    const { slots } = ctx
    return () => {
      return (
        <div class={styles.ExampleContainer}>
          <div class="mockup-browser border border-base-300">
            <div class="mockup-browser-toolbar">
              {title}
            </div>
            <div class="flex justify-center p-4 border-t border-base-300">
              {
                slots.content?.()
              }
            </div>
          </div>

        </div>
      )
    }
  }
})

export default ExampleContainer
