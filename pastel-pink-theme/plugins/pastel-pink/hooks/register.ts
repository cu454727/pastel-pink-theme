import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// 차분한 뉴트럴 바탕에 파스텔 핑크를 포인트로만.
const { theme, problems } = makeColors({
  label: 'Pastel Pink',
  roles: { accent: '#e8789f', danger: '#d4455e', success: '#4f9a72', warning: '#c98a2a', pro: '#9a6fd0' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f6f4f4',
        'surface-1': '#f9f7f7',
        'surface-2': '#fdfcfc',
        'text-primary': '#2b2628',
        'text-secondary': '#4f474a',
        'text-muted': '#6b6266',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1c1a1b',
        'surface-1': '#242122',
        'surface-2': '#2b2829',
        'surface-3': '#312d2f',
        'text-primary': '#f3eff0',
        'text-secondary': '#d3cdcf',
        'text-muted': '#aea6a9',
      },
    },
  },
})

// 말풍선 색 (모드별)
const inputs = theme.inputs as Record<'light' | 'dark', Record<string, string>>
Object.assign(inputs.light, {
  'bg-user-message': '#fbe3ec',
  'text-user-message': '#2b2628',
  'bg-assistant-message': '#fdfcfc',
  'text-assistant-message': '#2b2628',
})
Object.assign(inputs.dark, {
  'bg-user-message': '#4a2f3a',
  'text-user-message': '#f3eff0',
  'bg-assistant-message': '#242122',
  'text-assistant-message': '#f3eff0',
})

const BASE: ThemeSetArgs = {
  colors: theme,
}

const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Text: { fontSize: 15, lineHeight: 24 },
    Heading: { color: 'text-primary', fontWeight: 'semibold' },
    UserMessage: {
      backgroundColor: 'bg-user-message',
      radius: [20, 20, 6, 20],
      paddingX: 16,
      paddingY: 10,
    },
    AssistantMessage: {
      backgroundColor: 'bg-assistant-message',
      radius: [20, 20, 20, 6],
      paddingX: 18,
      paddingY: 12,
      borderColor: '#f4bfd2',
      borderWidth: 2,
    },
    ToolUse: { radius: 12, paddingX: 10, backgroundColor: 'surface-1' },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(BASE)
    }

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
