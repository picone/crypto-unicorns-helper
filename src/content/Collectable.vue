<script setup lang="ts">
import { EventItem } from '../store/modules/game'

const rowColor = ({ row }) => {
    const data = row as EventItem
    if (data.percentage >= 100) {
        return 'success-row'
    } else if (data.percentage >= 90) {
        return ''
    } else {
        return 'warning-row'
    }
}

const endAtFormatter = (row: EventItem) => {
    return row?.formatedEndTime()
}

const percentageColor = (percentage: number) => {
    if (percentage >= 100) {
        return 'success'
    } else if (percentage >= 90) {
        return ''
    } else {
        return 'warning'
    }
}
</script>

<template>
    <div>
        <el-dialog
            v-model="$store.state.showCollectable"
            title="Pendding Events"
            @close="$store.commit('hideCollectable')"
            draggable="true"
            destroy-on-close="true"
            center="true"
            align-center="true"
            width="80%">
            <el-table
                v-if="$store.state.showCollectable"
                :data="$store.getters['game/eventList']"
                stripe="true"
                border="true"
                fit="true"
                :row-class-name="rowColor">
                <el-table-column prop="landId" label="Land ID"/>
                <el-table-column prop="landClass" label="Class"/>
                <el-table-column prop="type" label="Type"/>
                <el-table-column prop="endAt" label="ETA" :formatter="endAtFormatter"/>
                <el-table-column label="%" width="60">
                    <template #default="scope">
                        <el-progress :text-inside="true" :stroke-width="16" :percentage="(scope.row as EventItem).percentage" :status="percentageColor(scope.row.percentage)"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
