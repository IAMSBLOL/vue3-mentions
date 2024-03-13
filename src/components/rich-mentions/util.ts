/* eslint-disable no-tabs */
// import type { VNode, RendererNode, RendererElement, ExtractPropTypes, PropType, HTMLAttributes } from 'vue'
import { MentionsopenDialogValue } from './mentionsTypes'

interface MeasureIndex {
	location: number
	prefix: string
}

export function getLastMeasureIndex (text: string, prefix: string | string[] = ''): MeasureIndex {
  const prefixList: string[] = Array.isArray(prefix) ? prefix : [prefix]
  return prefixList.reduce(
    (lastMatch: MeasureIndex, prefixStr): MeasureIndex => {
      const lastIndex = text.lastIndexOf(prefixStr)
      if (lastIndex > lastMatch.location) {
        return {
          location: lastIndex,
          prefix: prefixStr
        }
      }
      return lastMatch
    },
    { location: -1, prefix: '' }
  )
}

// 检测是不是要打开选择
export function validateSearch (text: string, split: any) {
  return !split || text.indexOf(split) === -1
}

export function filterOption (input: string, { label = '' }: any): boolean {
  const lowerCase = input.toLowerCase()
  if ((label as any) === MentionsopenDialogValue) {
    return true
  }
  return label.toLowerCase().indexOf(lowerCase) !== -1
}

// 虚拟dom
export function generateGetBoundingClientRect (x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x
  })
}

// 光标位置
export const getCursorPosition = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const offset = range.startOffset
    // const container = range.startContainer

    // 这里的 container 可能是一个元素节点或文本节点
    // 如果是元素节点，你可以进一步处理
    // 如果是文本节点，你可以获取其父元素来获取光标所在的元素

    // console.log('光标偏移量:', offset)
    // console.log('光标所在节点:', container)
    // console.log('光标所在屏幕坐标:', range.getBoundingClientRect())
    const { x, y } = range.getBoundingClientRect()

    return {
      x,
      y,
      offset
    }
  } else {
    return {
      x: 0,
      y: 0,
      offset: 0
    }
  }
}

function lower (char: string | undefined): string {
  return (char || '').toLowerCase()
}

function reduceText (text: string, targetText: string, split: string) {
  const firstChar = text[0]
  if (!firstChar || firstChar === split) {
    return text
  }

  let restText = text
  const targetTextLen = targetText.length
  for (let i = 0; i < targetTextLen; i += 1) {
    if (lower(restText[i]) !== lower(targetText[i])) {
      restText = restText.slice(i)
      break
    } else if (i === targetTextLen - 1) {
      restText = restText.slice(targetTextLen)
    }
  }

  return restText
}

interface MeasureConfig {
	measureLocation: number
	prefix: string
	targetText: string
	selectionStart: number
	split: string
}

export function replaceWithMeasure (text: string, measureConfig: MeasureConfig) {
  const { measureLocation, prefix, targetText, selectionStart, split } = measureConfig

  let beforeMeasureText = text.slice(0, measureLocation)
  if (beforeMeasureText[beforeMeasureText.length - split.length] === split) {
    beforeMeasureText = beforeMeasureText.slice(0, beforeMeasureText.length - split.length)
  }
  if (beforeMeasureText) {
    beforeMeasureText = `${beforeMeasureText}${split}`
  }

  let restText = reduceText(text.slice(selectionStart), targetText.slice(selectionStart - measureLocation - prefix.length), split)
  if (restText.slice(0, split.length) === split) {
    restText = restText.slice(split.length)
  }

  const connectedStartText = `${beforeMeasureText}${prefix}${targetText}${split}`

  return {
    text: `${connectedStartText}${restText}`,
    selectionLocation: connectedStartText.length
  }
}

export const getOffsetText = () => {
  const selecttion = window.getSelection()
  if (selecttion) {
    const range = selecttion.getRangeAt(0)
    const startContainer = range.startContainer
    const startOffset = range.startOffset
    if (startContainer.textContent) {
      const offsetText = startContainer.textContent.slice(0, startOffset)
      return offsetText
    } else {
      return ''
    }
  } else {
    return ''
  }
}

export function deleteContentAfterAtSign (range:any) {
  const startContainer = range.startContainer
  const startOffset = range.startOffset
  const textBeforeRange = startContainer.textContent.slice(0, startOffset)
  const atIndex = textBeforeRange.lastIndexOf('@')

  if (atIndex !== -1) {
    const textToDelete = textBeforeRange.slice(atIndex)
    const deletedLength = textToDelete.length
    range.setStart(startContainer, atIndex)
    range.deleteContents()
    console.log('已删除字符数:', deletedLength)
  } else {
    console.log('找不到 @ 符号')
  }
}

export function insertSpace () {
  const selection = window.getSelection()
  if (selection) {
    const range = selection.getRangeAt(0)

    // 创建包含空格的文本节点
    const spaceNode = document.createTextNode('\u00A0')
    // spaceNode.innerHTML = `&nbsp;`

    // 插入文本节点到 Range
    range.insertNode(spaceNode)

    // 将 Range 折叠到文本节点之后
    range.setEndAfter(spaceNode)
    range.collapse(false)
    // 重新选中折叠后的 Range
    const newSelection = window.getSelection()
    newSelection?.removeAllRanges()
    newSelection?.addRange(range)
  }
}

export function setSelectionStartByEle (start:any) {
  // 新光标
  const newRange = document.createRange()
  // newRange.setStartAfter(start)
  newRange.setEndAfter(start)
  newRange.collapse(false)
  const newSelection = window.getSelection()
  newSelection?.removeAllRanges()
  newSelection?.addRange(newRange)

  insertSpace()
}

export function insertMention (range: Range, mentionText: string, value: string | undefined, split: string, mentionClass: string) {
  const mentionNode = document.createElement('span')
  mentionNode.innerText = `@${mentionText}${split}`
  mentionNode.setAttribute('contenteditable', 'false')
  mentionNode.setAttribute('class', mentionClass)
  mentionNode.setAttribute('data-id', value as string)
  mentionNode.setAttribute('data-name', mentionText as any)
  mentionNode.style.color = 'var(--el-color-primary)'

  range.insertNode(mentionNode)

  setSelectionStartByEle(mentionNode)
}

export function insertText (range: Range, text: string) {
  const textNode = document.createTextNode(text)

  range.insertNode(textNode)

  // 新光标
  setSelectionStartByEle(textNode)
}
