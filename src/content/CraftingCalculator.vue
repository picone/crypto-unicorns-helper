<script setup lang="ts">
import type { CraftingItem } from '../store/modules/game'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import * as moment from 'moment'

const formatTimeCost = (row: CraftingItem) => {
    const duration = moment.duration(row.timeCost, 'minutes')
    return duration.humanize({'m': 360})
}

const numberFormatter = (row: CraftingItem, column: TableColumnCtx<CraftingItem>) => {
    return parseFloat(row[column.property].toFixed(4))
}

const formatAmount = (data: number) => {
    return parseFloat(data.toFixed(2))
}
</script>

<template>
    <div>
        <el-table
            :data="$store.getters['game/craftingProfit']"
            :default-sort="{ prop: 'profitPerHour', order: 'ascending' }"
            :stripe="true"
            :border="true"
            :fit="true">
            <el-table-column prop="name" label="Name"/>
            <el-table-column prop="timeCost" label="Cost Time" :formatter="formatTimeCost"/>
            <el-table-column prop="energyCost" label="Energy" :formatter="numberFormatter" sortable/>
            <el-table-column prop="materialCost" label="Material(normalize)">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.materialCost">{{ item.name }} * {{ formatAmount(item.amount) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="requirementRbw" label="Cost in RBW" :formatter="numberFormatter" sortable/>
            <el-table-column prop="worthRbw" label="Worth in RBW" :formatter="numberFormatter" sortable/>
            <el-table-column prop="profitPerHour" label="RBW/Hrs" :formatter="numberFormatter" sortable/>
        </el-table>
    </div>
</template>
