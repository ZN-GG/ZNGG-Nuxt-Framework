export default defineNuxtPlugin(() => {
  const online = useState('online', () => true)
  const update = () => { online.value = navigator.onLine }

  online.value = navigator.onLine
  window.addEventListener('online', update)
  window.addEventListener('offline', update)
})
