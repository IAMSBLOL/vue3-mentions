<template>
  <div class="Vue3Mnetions__rich-mentions-editor-wrap">
    <div ref="divEditor"
         class="Vue3Mnetions__rich-mentions-editor"
         :contenteditable="true"
         :data-placeholder="placeholder"
         @input="handleInput"
         @keydown="handleKeyDown"
         @keyup="handkeKeyUp"
         @focus="onInputFocus"
         @blur="onInputBlur"
         @paste="onPaste"
         @compositionstart="handleCompositionstart"
         @compositionend="handleCompositionend" />
  </div>

  <div ref="popper"
       class="Vue3Mnetions__popper-wrap">
    <div v-if="state.measuring">
      <MentionsSelect :options="options" />
    </div>
  </div>
</template>
<script setup lang="ts">
// element plus 引用的第三方插件
import { createPopper, type Instance } from '@popperjs/core'
import { isArray, isSymbol } from 'lodash-es'
import {
  //
  getLastMeasureIndex,
  validateSearch,
  getCursorPosition,
  generateGetBoundingClientRect,
  filterOption as defaultFilterOption,
  getOffsetText,
  insertMention,
  deleteContentAfterAtSign,
  insertText
} from './util'
import KeyCode from './keyCode'
import { type OptionProps, MentionsContextKey } from './mentionsTypes'
import MentionsSelect from './MentionsSelect.vue'
import { ref, type PropType, shallowRef, reactive, onMounted, computed, provide, toRef } from 'vue'

export type Vue3MentionsProps = {
  value: string
  prefix: string
  mentionsColor:string
  mentionClass: string
  placeholder: string
  split: string
  filterOption: typeof defaultFilterOption | false
  loading: boolean
  options: OptionProps[]
  popperOptions: Record<string, any>
}

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  mentionsColor: {
    type: String,
    default: 'red'
  },

  prefix: {
    type: String,
    default: '@'
  },
  mentionClass: {
    type: String,
    default: 'rich-mention__span'
  },
  placeholder: {
    type: String,
    default: ''
  },
  split: {
    type: String,
    // 空格
    default: '  '
  },

  filterOption: {
    type: [Boolean, Function] as PropType<typeof defaultFilterOption | false>,
    default: () => defaultFilterOption
  },
  loading: { type: Boolean, default: false },
  options: {
    type: Array as PropType<OptionProps[]>,
    default: () => []
  },
  popperOptions: {
    type: Object as PropType<Record<string, any>> | undefined,
    default: () => undefined
  }
})

const divEditor = ref<HTMLDivElement | null>(null)

const popper = ref<HTMLDivElement | null>(null)

const popperIns = shallowRef<Instance | null>(null)

const lastRange = shallowRef<Range | null>(null)

const composing = shallowRef(false)

const virtualElement = {
  getBoundingClientRect: generateGetBoundingClientRect(0, 0)
}

const emit = defineEmits([
  'change',
  'focus',
  'blur',
  'pressenter',
  'search',
  'select',
  'openDialog'
])

const focusId = ref()

const state = reactive({
  value: '',
  measuring: false,
  measureLocation: 0,
  measureText: '',
  measurePrefix: '',
  activeIndex: 0,
  isFocus: false
})

const startMeasure = (measureText: string, measurePrefix: string, measureLocation: number) => {
  Object.assign(state, {
    measuring: true,
    measureText,
    measurePrefix,
    measureLocation,
    activeIndex: 0
  })
}
const stopMeasure = (callback?: () => void) => {
  Object.assign(state, {
    measuring: false,
    measureLocation: 0,
    measureText: null
  })
  callback?.()
}

const triggerChange = (val: string) => {
  emit('change', val)
}

const setFocus = () => {
  if (divEditor.value) {
    divEditor.value.focus()
  }
}

onMounted(() => {
  // if (divEditor.value) {
  //   setFocus()
  // }
  const popperOptions = toRef(props, 'popperOptions')
  if (popperOptions.value) {
    popperIns.value = createPopper(
      virtualElement as any,
      popper.value as HTMLDivElement,
      popperOptions.value
    )
  } else {
    popperIns.value = createPopper(virtualElement as any, popper.value as HTMLDivElement, {
      placement: 'left-end',
      strategy: 'fixed'
    })
  }
})

const handleCusClick = (item?: any) => {
  emit('openDialog', item)
}

const handleCompositionstart = () => {
  composing.value = true
}

const handleCompositionend = () => {
  composing.value = false
  // 结束时手动触发一下输入
  handleInput()
}

const selectOption = (option: OptionProps | OptionProps[]) => {
  console.log(option, 'selectOption')

  const selecttion = window.getSelection()
  if (document.activeElement !== divEditor.value) {
    setFocus()

    if (selecttion) {
      selecttion.removeAllRanges()
      selecttion.addRange(lastRange.value as Range)
    }
  }
  if (!divEditor.value || !option) {
    return
  }
  let arr: OptionProps[] = []
  if (isArray(option)) {
    arr = option
  } else {
    if (isSymbol(option.value)) {
      // 打开
      console.log('open your dialog')
      handleCusClick(option)
      return
    }
    arr = [option]
  }

  if (selecttion) {
    const range = selecttion.getRangeAt(0)

    deleteContentAfterAtSign(range)
    for (let i = 0; i < arr.length; i++) {
      // fuck
      const range = selecttion.getRangeAt(0)
      const { label: mentionValue = '', value } = arr[i]
      insertMention(range, mentionValue, value, props.split, props.mentionClass, props.mentionsColor)
    }

    triggerChange(divEditor.value.innerHTML)

    // 需要设置光标
    stopMeasure()
  }
}

const handleInput = () => {
  if (divEditor.value) {
    const content = divEditor.value.innerHTML
    if (!composing.value) {
      triggerChange(content)
    }

    if (content === '') {
      divEditor.value.setAttribute('data-placeholder', props.placeholder)
    } else {
      divEditor.value.removeAttribute('data-placeholder')
    }
  }
}

const onPaste = (event: ClipboardEvent) => {
  // 阻止默认的粘贴行为
  event.preventDefault()

  // 获取粘贴板内容
  const { clipboardData } = event

  const selecttion = window.getSelection()
  if (selecttion && clipboardData) {
    const pastedData = clipboardData.getData('text/plain')
    const range = selecttion.getRangeAt(0)

    insertText(range, pastedData)
    handleInput()
  }
}

const getOptions = (measureText?: string): OptionProps[] => {
  const targetMeasureText = measureText || state.measureText || ''
  const { filterOption } = props
  const list = props.options.filter((option: OptionProps) => {
    if (!!filterOption === false) {
      return true
    }

    return (filterOption as any)(targetMeasureText, option)
  })
  return list
}

const handleOptions = computed(() => getOptions())

const handkeKeyUp = (event: KeyboardEvent) => {
  if (divEditor.value) {
    const { which, key } = event

    if (composing.value) {
      return
    }

    if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
      return
    }

    const innerText = getOffsetText()

    const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
      innerText,
      props.prefix
    )

    const { measureText: prevMeasureText, measuring } = state

    if (measureIndex !== -1) {
      // 搜索字段
      const measureText = innerText.slice(measureIndex + measurePrefix.length)
      // 需要更改规则 validateSearch 或许是个<标签
      const validateMeasure = validateSearch(measureText, ' ')

      // 正确的匹配

      const matchOption = !!getOptions(measureText).length
      if (validateMeasure) {
        // 需要搜索、打开、选择
        if (
          key === measurePrefix ||
          key === 'Shift' ||
          measuring ||
          (measureText !== prevMeasureText && matchOption)
        ) {
          if (!measuring) {
            const { x, y } = getCursorPosition()
            virtualElement.getBoundingClientRect = generateGetBoundingClientRect(x, y)
            popperIns.value?.update()

            // 获取当前偏移值
            const selecttion = window.getSelection()
            if (selecttion) {
              const range = selecttion.getRangeAt(0)

              lastRange.value = range
            }
          }
          startMeasure(measureText, measurePrefix, measureIndex)
          // insertMention('1223')
        }

        if (validateMeasure) {
          emit('search', measureText, measurePrefix)
        }
      } else if (measuring) {
        stopMeasure()
      }
    } else if (measuring) {
      stopMeasure()
    }
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const { which } = event

  if (!state.measuring) {
    return
  }

  if (which === KeyCode.UP || which === KeyCode.DOWN) {
    const optionLen = handleOptions.value.length
    const offset = which === KeyCode.UP ? -1 : 1
    const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen
    state.activeIndex = newActiveIndex
    event.preventDefault()
  } else if (which === KeyCode.ESC) {
    stopMeasure()
  } else if (which === KeyCode.ENTER) {
    // Measure hit
    event.preventDefault()

    const option = handleOptions.value[state.activeIndex]

    selectOption(option as any)

    if (!handleOptions.value.length) {
      stopMeasure()
    }
  }
}

const emptyContent = () => {
  if (divEditor.value) {
    divEditor.value.innerHTML = ''
    handleInput()
  }
}

const onFocus = (event: Event) => {
  clearTimeout(focusId.value)
  const { isFocus } = state
  if (!isFocus && event) {
    emit('focus', event)
  }
  state.isFocus = true
}
const onBlur = (event: Event) => {
  focusId.value = setTimeout(() => {
    state.isFocus = false
    // stopMeasure()
    // 记录失去焦点时的位置

    emit('blur', event)
  }, 100)
}

const onInputFocus = (event: Event) => {
  onFocus(event)
}
const onInputBlur = (event: Event) => {
  onBlur(event)
}

const setActiveIndex = (activeIndex: number) => {
  state.activeIndex = activeIndex
}

provide(MentionsContextKey, {
  activeIndex: toRef(state, 'activeIndex'),
  setActiveIndex,
  selectOption,
  onFocus,
  onBlur,
  handleCusClick,
  loading: toRef(props, 'loading')
})

const getSelectOptions = () => {
  if (divEditor.value) {
    const arr: { id: string | null; name: string | null }[] = []
    const spanList = divEditor.value.querySelectorAll('span')

    for (let i = 0; i < spanList.length; i++) {
      const item = spanList[i]
      const id = item.getAttribute('data-id')
      const name = item.getAttribute('data-name')
      if (id) {
        arr.push({
          id,
          name
        })
      }
    }

    return arr
  }

  return []
}

defineExpose({
  getSelectOptions,
  selectOption,
  emptyContent,
  setFocus,
  divEditor
})
</script>

<style lang="scss" scoped>
.Vue3Mnetions__rich-mentions-editor-wrap {
  width: 100%;
}

.Vue3Mnetions__rich-mentions-editor {
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  min-height: 50px;
  font-size: 0.875rem;
  line-height: 1.25rem;

  :deep(.span-text) {
    color: blue;
  }

  &::before {
    content: attr(data-placeholder);
    color: #b4b8bf;
  }
}

[contenteditable='true'][data-placeholder]::before {
  content: attr(data-placeholder);
  color: #b4b8bf;
}

.Vue3Mnetions__popper-wrap {
  z-index: 99;
}
</style>
