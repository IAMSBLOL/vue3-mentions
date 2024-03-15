import { defineComponent } from 'vue'
import IconComponent from '@/assets/logo.svg?component'

import { GithubOutlined } from '@ant-design/icons-vue'
const ExampleHeader = defineComponent({

  setup () {
    return () => {
      return (
        <div class="navbar bg-primary px-8 text-white">
          <div class="flex-1">
            <a class="btn btn-ghost text-base flex items-center"><IconComponent class='w-5 h-5'/>vue3 mnetions @</a>
          </div>
          <div class="flex items-center gap-2">
            <a class="btn btn-ghost text-base flex items-center" href='https://github.com/IAMSBLOL/vue3-mentions' target='_blank' >
              <GithubOutlined class='text-2xl leading-[0]' />
            </a>
          </div>
        </div>
      )
    }
  }
})

export default ExampleHeader
