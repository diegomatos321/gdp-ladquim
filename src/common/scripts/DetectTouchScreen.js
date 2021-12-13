export default function DetectTouchScreen() {
  return 'ontouchstart' in document.documentElement;
}