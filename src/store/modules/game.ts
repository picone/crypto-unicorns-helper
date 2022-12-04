import { TCompactProtocol, TFramedTransport } from 'thrift'
const Buffer = require('buffer/').Buffer
import { decode as DecodeMsgPack } from '@msgpack/msgpack'
import { Building, BuildingEvent, BuildingSlot, DataStore, Land, Quest, Reward, UnicornClass } from '../../models/game'
import type { LandClass, BuildingType, BuildingState, QuestType } from '../../models/game'
import { CraftingRecipeList, RecipeItemInfo, UnicornBerries } from '../../models/definition'
import { RspGroupListenerRegister, MsgGroupUpdate, RspPlayerLogin, CommandType } from '../../codegen/'
import { Dispatch, Commit } from 'vuex'
import * as moment from 'moment'
import type { PriceState } from './price'

export class GameState {
    dataStore: DataStore = new DataStore()
    selectedUnicornClass: UnicornClass = ''
}

export class EventItem {
    readonly landId: number
    readonly landClass: LandClass
    readonly type: BuildingType
    readonly startAt: number
    readonly endAt: number
    readonly state: BuildingState
    readonly percentage: number
    constructor(landId: number, landClass: LandClass, type: BuildingType, startAt: number, endAt: number, state: BuildingState) {
        this.landId = landId
        this.landClass = landClass
        this.type = type
        this.startAt = startAt
        this.endAt = endAt
        this.state = state
        if (this.state == 'collectable') {
            this.percentage = 100
        }
        const now = new Date().getTime() / 1000
        const totalCost = this.endAt - this.startAt
        const passTime = now - this.startAt
        const percent = passTime / totalCost * 100
        this.percentage = Math.min(Math.trunc(percent), 100)
    }

    formatedEndTime() {
        return moment.unix(this.endAt).format('YYYY-MM-DD HH:mm:ss')
    }
}

export class CraftingItem {
    readonly name: string
    readonly timeCost: number // minutes
    readonly energyCost: number
    readonly unimCost: number
    readonly materialCost: RecipeItemInfo[]
    requirementRbw = 0 // same worth in rbw unim
    worthRbw: number
    profitPerHour: number

    constructor(name: string, timeCost: number, energyCost: number,
        unimCost: number, materialCost: RecipeItemInfo[],
        state: GameState, price: PriceState) {
        this.name = name
        this.timeCost = timeCost
        this.energyCost = energyCost
        this.unimCost = unimCost
        this.materialCost = materialCost
        
        const market = state.dataStore.marketPlace
        this.materialCost.forEach(item => {
            this.requirementRbw += market.onePcsPrice(item.name) * item.amount
        })
        this.requirementRbw += unimCost * price.unim / price.rbw
        const berry = UnicornBerries.get(state.selectedUnicornClass)
        if (berry) {
            this.requirementRbw += this.energyCost * 25 * state.dataStore.marketPlace.onePcsPrice(berry)
        }

        this.worthRbw = market.onePcsPrice(name)

        this.profitPerHour = (this.worthRbw - this.requirementRbw) / (this.timeCost / 60)
    }
}

export class UnicornEnergyItem {
    readonly class: UnicornClass
    readonly worthRbw: number
    readonly worthUsd: number

    constructor(className: UnicornClass, rbw: number, usd: number) {
        this.class = className
        this.worthRbw = rbw
        this.worthUsd = usd
    }
}

export default {
    namespaced: true,
    state() {
        return new GameState()
    },
    getters: {
        eventList(state: GameState) : EventItem[] {
            const ret: EventItem[] = []
            state.dataStore.lands.forEach(land => {
                land.buildings.forEach(building => {
                    building.slots.forEach(slot => {
                        if (slot.state == 'idle') {
                            return
                        }
                        ret.push(new EventItem(land.id, land.class, building.type, slot.startAt, slot.completedAt, slot.state))
                    })
                })
            })
            ret.sort((a , b) => {
                if (a.endAt > b.endAt) {
                    return 1
                } else if (a.endAt < b.endAt) {
                    return -1
                } else {
                    return 0
                }
            })
            return ret
        },
        craftingProfit(state: GameState, _: any, rootState: any) : CraftingItem[] {
            const ret: CraftingItem[] = []
            CraftingRecipeList.pcsCost.forEach((item, name) => {
                const priceState: PriceState = rootState.price
                ret.push(new CraftingItem(
                    name,
                    item.timeCost,
                    item.energyCost,
                    item.unimCost,
                    item.materialCost,
                    state,
                    priceState,
                ))
            })
            return ret
        },
        energyPrice(state: GameState, _: any, rootState: any): UnicornEnergyItem[] {
            const ret: UnicornEnergyItem[] = []
            UnicornBerries.forEach((seed, className) => {
                const rbwWorth = 25 * state.dataStore.marketPlace.onePcsPrice(seed)
                const usdWorth = rootState.price.unim * rbwWorth
                ret.push(new UnicornEnergyItem(className, rbwWorth, usdWorth))
            })
            return ret
        },
    },
    mutations: {
        updateLandFromMsgPack(state: GameState, data: {landId: number; payload?: Buffer}) {
            if (!data.payload) {
                return
            }
            const msg: any = DecodeMsgPack(data.payload)
            const land = state.dataStore.lands.get(data.landId) || new Land()
            land.id = data.landId
            land.name = msg?.land?.name || land.name
            land.class = msg?.land?.type || msg?.land?.class || land.class
            land.level = msg?.land?.level || land.level
            land.xp = msg?.land?.xp || msg?.state?.xp || land.xp
            if (msg?.buildings) {
                let havePostboard = false
                for (const buildingId in msg?.buildings) {
                    const item = msg?.buildings[buildingId]
                    const building = new Building()
                    building.id = buildingId
                    building.type = item?.type
                    building.level = item?.level
                    building.state = item?.state
                    building.events = item?.events?.map((evt: any) => {
                        return new BuildingEvent(evt.timestamp)
                    })
                    if (item?.type === 'nursery' && (item?.state === 'breeding_in_progress'
                        || item?.state === 'breeding_finished')) {
                        const breeding = item?.data?.breeding
                        const slot = new BuildingSlot()
                        slot.completedAt = breeding?.end_time
                        slot.startAt = breeding?.start_time
                        slot.state = item.state === 'breeding_in_progress' ? 'in_progress' : 'collectable'
                        building.slots.set(0, slot)
                    } else if (item?.type === 'nursery' && (item?.state === 'evolution_in_progress'
                    || item?.state === 'evolution_finished')) {
                        const evolution = item?.data?.evolution
                        const slot = new BuildingSlot()
                        slot.completedAt = evolution?.end_time
                        slot.startAt = evolution?.start_time
                        slot.state = item.state === 'evolution_in_progress' ? 'in_progress' : 'collectable'
                        building.slots.set(0, slot)
                    } else if (item?.type === 'postboard') {
                        havePostboard = true
                    } else {
                        for (const slotId in item?.data?.slots) {
                            const slotItem = item?.data?.slots[slotId]
                            if (slotItem?.is_lock) {
                                continue
                            }
                            const slot = new BuildingSlot()
                            slot.completedAt = slotItem?.data?.complete_at
                            slot.startAt = slotItem?.data?.start_at
                            slot.state = slotItem?.data?.state
                            building.slots.set(parseInt(slotId), slot)
                        }
                    }
                    land.buildings.set(buildingId, building)
                }
                if (havePostboard && msg.quests) {
                    const dealWithQuests = (type: QuestType, data: any, land: Land) => {
                        if (data && data?.selection_time && data?.selected) {
                            for (const questId in data.selected) {
                                const item = data.selected[questId]
                                const rewards: Reward[] = item?.quest_rewards?.rewards?.map((reward: any) => {
                                    return new Reward(reward?.name, reward?.count)
                                })
                                land.quests.push(new Quest(type, item?.name, data?.selection_time, rewards))
                            }
                        }
                    }
                    dealWithQuests('daily', msg.quests?.daily, land)
                    dealWithQuests('weekly', msg.quests?.weekly, land)
                }
            }
            state.dataStore.lands.set(data.landId, land)
        },
        updateMarketplaceFromMsgPack(state: GameState, payload?: Buffer) {
            if (!payload) {
                return
            }
            const msg: any = DecodeMsgPack(payload)
            if (!msg?.items_prices) {
                return
            }
            for (const itemName in msg.items_prices) {
                const item = msg.items_prices[itemName]
                const price: number|string|undefined = item?.selling_price?.price
                switch (typeof price) {
                    case 'number':
                        state.dataStore.marketPlace.data.set(itemName, price)
                        break
                    case 'string':
                        state.dataStore.marketPlace.data.set(itemName, parseFloat(price))
                        break
                    default:
                        break
                }
            }
        },
        setUnicornClass(state: GameState, unicornClass: UnicornClass) {
            state.selectedUnicornClass = unicornClass
        },
        updateInventory(state: GameState, data: object) {
            Object.entries(data).forEach(([key, val]) => {
                if (key.startsWith('items/') && key.endsWith('/quantity')) {
                    state.dataStore.player.inventory.set(key.substring(6, key.length - 9), val)
                }
            })
        }
    },
    actions: {
        parseFromWsData(ctx: { dispatch: Dispatch }, data: ArrayBuffer) {
            if (data.byteLength < 7) {
                return
            }
            const dv = new DataView(data)
            if (dv.getUint8(0) != 4) {
                return
            }
            const command = dv.getUint16(1)
            let dataOffset = 4
            if (dv.getUint8(3) == 0x80) {
                dataOffset = 6
            }
            const buf = data.slice(dataOffset, data.byteLength)
            const protocol = new TCompactProtocol(new TFramedTransport(new Buffer(buf)))
            switch (command) {
                case CommandType.RSP_PLAYER_LOGIN:
                    ctx.dispatch('parseRspPlayerLogin', RspPlayerLogin.read(protocol))
                    break
                case CommandType.RSP_GROUP_LISTENER_REGISTER:
                    ctx.dispatch('parseRspGroupListenerRegister', RspGroupListenerRegister.read(protocol))
                    break
                case CommandType.MSG_GROUP_UPDATE:
                    ctx.dispatch('parseMsgGroupUpdate', MsgGroupUpdate.read(protocol))
                    break
                default:
                    return
            }
        },
        parseRspPlayerLogin(ctx: { commit: Commit }, msg: RspPlayerLogin) {
            if (!msg?.player?.props) {
                return
            }
            const data: any = DecodeMsgPack(msg.player.props)
            if (!data) {
                return
            }
            if (data?.inventory) {
                ctx.commit('updateInventory', data.inventory)
            }
        },
        parseRspGroupListenerRegister(ctx: { commit: Commit }, msg: RspGroupListenerRegister) {
            if (!msg?.group?.props) {
                return
            }
            if (msg.name === 'marketplace') {
                ctx.commit('updateMarketplaceFromMsgPack', msg.group.props)
                return
            }
            if (msg.group?.base?.type !== 'lod1') {
                return
            }
            const idStr = msg.group.base.id?.substring(5)
            if (!idStr) {
                return
            }
            ctx.commit('updateLandFromMsgPack', {
                landId: parseInt(idStr, 10),
                payload: msg?.group?.props,
            })
        },
        parseMsgGroupUpdate(ctx: { commit: Commit }, msg: MsgGroupUpdate) {
            if (!msg?.group?.props) {
                return
            }
            if (!msg?.name?.startsWith('lod1/')) {
                return
            }
            ctx.commit('updateLandFromMsgPack', {
                landId: parseInt(msg.name.substring(5), 10),
                payload: msg?.group?.props,
            })
        },
    },
}
