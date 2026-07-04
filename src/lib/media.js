export function isVideoSource(src) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src || '')
}
