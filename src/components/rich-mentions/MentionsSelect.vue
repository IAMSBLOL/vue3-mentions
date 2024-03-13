<template>
  <div v-loading="(loading as boolean)"
       class="mentions-select-wrap">
    <div class="mentions-select-content">
      <div v-for="(item, index) in options"
           :key="index"
           :class="[computedActiveCls(index)]"
           class="">
        <div class="select-item"
             @click="handleClick(item, index)">
          <div class="user-avatar">
            {{ (item.label as string)?.slice(0, 1)?.toUpperCase() }}
          </div>
          <div class="user-text">
            {{ item?.label }}
          </div>
        </div>
      </div>
      <div v-if="showNoData"
           class="py-5 flex items-center justify-center text-[#858D99] text-sm">
        暂无可选项
      </div>
    </div>
    <div class="more-btn h-10 text-sm py-[12px] px-2"
         @click="handleOpenDialog()">
      查看更多
    </div>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, type PropType, inject, computed, nextTick } from 'vue'
import type { OptionProps } from './mentionsTypes'
import { MentionsContextKey } from './mentionsTypes'
import { isEmpty } from 'lodash-es'

interface Options extends OptionProps, Record<string, any> { }

const props = defineProps({
  options: {
    type: Array as PropType<Options[]>,
    default: () => []
  }
})

const { activeIndex, setActiveIndex, selectOption, handleCusClick, loading } = inject(
  MentionsContextKey,
  {
    activeIndex: shallowRef(),
    loading: shallowRef(false)
  }
)

const computedActiveCls = computed(() => (index: number) => {
  if (index === activeIndex.value) {
    return 'select-item-active'
  }
  return ''
})

const showNoData = computed(() => {
  return isEmpty(props.options)
})

const handleClick = (item: OptionProps, index: number) => {
  if (setActiveIndex) {
    setActiveIndex(index)
  }

  nextTick(() => {
    if (selectOption) {
      selectOption(item)
    }
  })
}

const handleOpenDialog = () => {
  if (handleCusClick) {
    handleCusClick()
  }
}
</script>

<style lang="scss" scoped>
.mentions-select-wrap {
  width: 200px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 8px 26px 0 rgba(0, 0, 0, 16%);
  border-radius: 8px;
  z-index: 100;

  .mentions-select-content {
    padding: 0.75rem 0.5rem;
  }

  .select-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.25rem;
    height: 2.5rem;
    z-index: 100;
  }

  .select-item-active {
    background-color: #f0f2f5;
  }

  .more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #377bff;
    border-top: 1px solid #cbd1db;
    cursor: pointer;
  }

  .user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-text {
    color: #1F2736;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    padding-left: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }
}
</style>
