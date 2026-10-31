export function getDesktopReverseScrollHref({
  atPageBottom,
  scrollingUp,
  justLeftPageBottom,
  organizationsBottom,
  viewportBottom,
}) {
  if (atPageBottom) return '#connect'
  if (scrollingUp && justLeftPageBottom) return '#organizations'
  if (scrollingUp && organizationsBottom >= viewportBottom) return '#recognition'
  if (!scrollingUp && organizationsBottom <= viewportBottom) return '#connect'
  return '#organizations'
}
