<script setup lang="ts">

import RichMentions from './components/rich-mentions'

import ExampleContainer from './views/ExampleContainer'

import ExampleHeader from './views/ExampleHeader'

import ExampleHero from './views/ExampleHero'

const testOptions = [
  {
    label: '张三',
    value: 'id-1'
  },
  {
    label: '罗老师',
    value: 'id-2'
  },
  {
    label: '测试1',
    value: 'id-3'
  },
  {
    label: '测试3',
    value: 'id-5',
    disabled: true
  }
]
</script>

<template>
  <ExampleHeader />
  <ExampleHero />
  <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 py-2 px-16">
    <ExampleContainer :title="'简单模式'">
      <template #content>
        <RichMentions :options="testOptions"
                      :placeholder="'请输入'" />
      </template>
    </ExampleContainer>
    <ExampleContainer :title="'自定义选择样式'">
      <template #content>
        <RichMentions :options="testOptions"
                      :placeholder="'请输入'" />
      </template>
    </ExampleContainer>
    <ExampleContainer :title="'禁止使用'">
      <template #content>
        <RichMentions :options="testOptions"
                      :placeholder="'请输入'" />
      </template>
    </ExampleContainer>
  </div>
</template>

<style scoped>

</style>
