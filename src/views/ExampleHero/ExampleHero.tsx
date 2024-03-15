import { defineComponent } from 'vue'

const ExampleHero = defineComponent({

  setup () {
    return () => {
      return (
        <div class="hero">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <h1 class="text-5xl font-bold">Hello 😝</h1>
              <p class="py-6">
                 这是一个富文本方式的vue3 mentions 插件，以下是一些例子
              </p>

            </div>
          </div>
        </div>
      )
    }
  }
})

export default ExampleHero
