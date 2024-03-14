<script setup lang="ts">

import RichMentions from './components/rich-mentions'
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
  <div class="example">
    <RichMentions :options="testOptions"
                  :placeholder="'vue3 mentions test @ me'" />
  </div>
</template>

<style scoped>
.example {
  width: 300px;
  height: 200px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
