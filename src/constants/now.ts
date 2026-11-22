export type NowKind = 'reading' | 'watching' | 'wearing' | 'training'

export type NowItem = {
  kind: NowKind
  label: string
  value: string
  detail?: string
  rewatching?: string
}

export const nowUpdated = '2026-11-22'

export const nowItems: NowItem[] = [
  { kind: 'reading', label: 'Reading', value: 'South of the Border, West of the Sun', detail: 'Haruki Murakami' },
  { kind: 'watching', label: 'Watching', value: '', rewatching: 'Twin Peaks: The Return' },
  { kind: 'wearing', label: 'Wearing', value: 'Fragrance', detail: 'Gatekept' },
  { kind: 'training', label: 'Training', value: '100kg bench press' }
]
