<script setup lang="ts">
import { onMounted } from 'vue'
import store from '../store'
import Events from './Events.vue'

onMounted(() => {
    const port = chrome.runtime.connect({})
    port.onMessage.addListener(msg => {
        if (!msg?.dataStore) {
            return
        }
        window.dataStore = msg.dataStore
        store.commit('game/updateDataStore', JSON.parse(msg.dataStore, (key, val) => key === '' ? new Map(val) : val))
    })
})

// export default {
//     name: 'Popup',
//     data() {
//         return {
//             dataStore: null,
//         }
//     },
//     mounted() {
//         const port = chrome.runtime.connect({})
//         port.onMessage.addListener(msg => {
//             this.dataStore = msg?.dataStore
//         })
//     },
//     computed: {
//         events() {
//             if (!this.dataStore) {
//                 return
//             }
//             let ret = new Array()
//             for (const landId in this.dataStore?.lands) {
//                 const land = this.dataStore.lands[landId]
//                 for (const buildingId in land.buildings) {
//                     const building = land.buildings[buildingId]
//                     for (const slotId in building.slots) {
//                         const slot = building.slots[slotId]
//                         if (slot.state == 'idle') {
//                             continue
//                         }
//                         ret.push({
//                             landId: land.id,
//                             landClass: land.class,
//                             type: building.type,
//                             startAt: slot.startAt,
//                             completedAt: slot.completedAt,
//                         })
//                     }
//                 }
//             }
//             ret.sort((a , b) => {
//                 if (a.completedAt > b.completedAt) {
//                     return 1
//                 } else if (a.completedAt < b.completedAt) {
//                     return -1
//                 } else {
//                     return 0
//                 }
//             })
//             return ret
//         },
//     },
//     methods: {
//         timestampFormatter(row) {
//             return moment.unix(row.completedAt).format('YYYY-MM-DD hh:mm:ss')
//         },
//         percentage(event) {
//             const now = new Date().getTime() / 1000
//             const totalCost = event.completedAt - event.startAt
//             const passTime = now - event.startAt
//             const percent = passTime / totalCost * 100
//             return Math.min(Math.trunc(percent), 100)
//         },
//         percentageColor(event) {
//             const percent = this.percentage(event)
//             if (percent >= 100) {
//                 return 'success'
//             } else if (percent >= 90) {
//                 return ''
//             } else {
//                 return 'warning'
//             }
//         }
//     },
// }
</script>

<template>
    <el-tabs type="card">
        <el-tab-pane label="Events">
            <Events></Events>
        </el-tab-pane>
        <el-tab-pane label="Inventory">
            
        </el-tab-pane>
    </el-tabs>
</template>
