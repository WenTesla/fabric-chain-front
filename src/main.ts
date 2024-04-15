// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import route from "~/route";

const app = createApp(App)

app.use(ElementPlus)
app.use(route)

app.mount('#app')