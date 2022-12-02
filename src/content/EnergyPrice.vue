<script setup lang="ts">
import type { UnicornEnergyItem } from '../store/modules/game'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

const numberFormatter = (row: UnicornEnergyItem, column: TableColumnCtx<UnicornEnergyItem>) => {
    return parseFloat(row[column.property].toFixed(4))
}
</script>

<template>
    <div>
        <el-table
            :data="$store.getters['game/energyPrice']"
            :default-sort="{ prop: 'worthRbw', order: 'ascending' }"
            :stripe="true"
            :border="true"
            :fit="true">
            <el-table-column prop="class" label="Class"/>
            <el-table-column prop="worthRbw" label="RBW/energy" :formatter="numberFormatter" sortable/>
            <el-table-column prop="worthUsd" label="USD/energy" :formatter="numberFormatter" sortable/>
        </el-table>
    </div>
</template>
