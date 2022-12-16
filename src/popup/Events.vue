<script setup lang="ts">
import store from '../store'
</script>

<template>
    <el-table
        :data="store.getters['game/eventList']"
        size="small">
        <el-table-column prop="landId" label="Land ID" width="100"/>
        <el-table-column prop="landClass" label="Class" width="100"/>
        <el-table-column prop="type" label="Type" width="100"/>
        <!-- <el-table-column prop="endAt" label="ETA" :formatter="timestampFormatter" width="210"/>
        <el-table-column label="%" width="60">
            <template #default="scope">
                <el-progress :text-inside="true" :stroke-width="16" :percentage="percentage(scope.row)" :status="percentageColor(scope.row)"/>
            </template>
        </el-table-column> -->
    </el-table>
</template>
