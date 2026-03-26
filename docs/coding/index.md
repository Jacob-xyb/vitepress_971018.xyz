---
layout: home
---

# 编程

记录编程开发过程中的各种知识点和技巧。

<script setup>
import { codingLanguages } from './links.js'
import { codingFrameworks } from './links.js'
import { codingMisc } from './links.js'
</script>

## 编程语言

<NavCards :items="codingLanguages" />

## 框架

<NavCards :items="codingFrameworks" />

## 未分类

<NavCards :items="codingMisc" />
