import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { logger } from 'photo-logger'

logger.info('Hello from main.ts')
logger.log('log')
logger.warn('warn')
logger.error('error')

createApp(App).mount('#app')
