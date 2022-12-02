<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import CraftingCalculator from './CraftingCalculator.vue'
import EnergyPrice from './EnergyPrice.vue'
import { UnicornBerries } from '../models/definition'
import { UnicornClass } from '../models/game'

const store = useStore()
const selectedUnicornClass = computed({
    get() {
        return store.state.game.selectedUnicornClass
    },
    set(unicornClass: UnicornClass) {
        store.commit('game/setUnicornClass', unicornClass)
    }
})
</script>

<template>
    <div>
        <el-dialog
            v-model="$store.state.showProfit"
            title="Profit"
            @close="$store.commit('hideProfit')"
            draggable="true"
            destroy-on-close="true"
            center="true"
            align-center="true"
            width="80%">
            <row>
                <el-row v-if="$store.state.game.dataStore.marketPlace.data.size === 0" style="margin-bottom: 9px;">
                    <el-alert title="Please open the market to get the newest price."
                        type="warning" effect="dark" :closable="false"/>
                </el-row>
            </row>
            <row>
                <el-form :inline="true" style="margin-bottom: 9px;">
                    <el-form-item label="Class">
                        <el-select v-model="selectedUnicornClass" placeholder="My Unicorn Class">
                            <el-option v-for="unicornClass in UnicornBerries.keys()" :label="unicornClass" :value="unicornClass" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </row>
            <row>
                <el-tabs type="border-card">
                    <el-tab-pane label="Crafting">
                        <CraftingCalculator/>
                    </el-tab-pane>
                    <el-tab-pane label="Energy">
                        <EnergyPrice/>
                    </el-tab-pane>
                </el-tabs>
            </row>
        </el-dialog>
    </div>
</template>
