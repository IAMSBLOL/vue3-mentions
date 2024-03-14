<template>
  <div v-loading="loading as boolean"
       class="Vue3Mnetions__mentions-select-wrap">
    <div class="Vue3Mnetions__mentions-select-content">
      <div v-for="(item, index) in options"
           :key="index"
           :class="[computedActiveCls(index)]"
           class="">
        <div class="Vue3Mnetions__select-item"
             @click="handleClick(item, index)">
          <div class="Vue3Mnetions__user-avatar">
            {{ (item.label as string)?.slice(0, 1)?.toUpperCase() }}
          </div>
          <div class="Vue3Mnetions__user-text">
            {{ item?.label }}
          </div>
        </div>
      </div>
      <div v-if="showNoData"
           class="Vue3Mnetions__no-more-wrap">
        暂无可选项
      </div>
    </div>
    <div class="Vue3Mnetions__more-btn"
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
    return 'Vue3Mnetions__select-item-active'
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
.Vue3Mnetions__mentions-select-wrap {
  width: 200px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 8px 26px 0 rgba(0, 0, 0, 16%);
  border-radius: 8px;
  z-index: 100;

  .Vue3Mnetions__mentions-select-content {
    padding: 0.75rem 0.5rem;
  }

  .Vue3Mnetions__select-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.25rem;
    height: 2.5rem;
    z-index: 100;
  }

  .Vue3Mnetions__select-item-active {
    background-color: #f0f2f5;
  }

  .Vue3Mnetions__more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #377bff;
    border-top: 1px solid #cbd1db;
    cursor: pointer;
    height: 2.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0.75rem 0.5rem;
  }

  .Vue3Mnetions__user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Vue3Mnetions__user-text {
    color: #1f2736;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    padding-left: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .Vue3Mnetions__no-more-wrap {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    color: #858D99;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}
</style>
