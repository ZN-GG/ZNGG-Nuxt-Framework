export function useOnline() {
  return useState('online', () => true)
}
