import { MarketPlaceBundle } from './definition'

export type UnicornClass = 'crystal' | 'cloud' | 'heart' | 'moon' | 'flower' | 'candy' |
    'omnom' | 'rainbow' | 'star' | ''
export type UnicornClassGroup = 'light' | 'mystery' | 'wonder' | ''
export type LandClass = UnicornClass | UnicornClassGroup | 'mythic'
export type BuildingType = 'farm' | 'workshop' | 'cart' | 'stables' | 'nursery' | 'postboard' | ''
export type BuildingState = 'in_progress' | 'idle' | 'collectable' | ''
export type QuestType = 'daily' | 'weekly'

export class Land {
    id = 0
    class: LandClass = ''
    name = ''
    level = 0
    xp = 0
    buildings = new Map<string, Building>()
    quests: Quest[] = []

    toJSON() {
        return {
            id: this.id,
            class: this.class,
            name: this.name,
            level: this.level,
            xp: this.xp,
            buildings: Array.from(this.buildings.entries()),
        }
    }
}

export class Building {
    id = ''
    events: BuildingEvent[] = []
    slots = new Map<number, BuildingSlot>()
    type: BuildingType = ''
    level = 0
    state: BuildingState = ''

    toJSON() {
        return {
            id: this.id,
            events: this.events,
            slots: Array.from(this.slots.entries()),
            type: this.type,
            level: this.level,
            state: this.state,
        }
    }
}

export class BuildingEvent {
    timestamp: number
    constructor(ts: number) {
        this.timestamp = ts
    }
}

export class BuildingSlot {
    completedAt = 0
    startAt = 0
    state: BuildingState = ''
}

export class Quest {
    type: QuestType
    endTime: number
    name: string // item requirement. this need to associate with definition
    rewards: Reward[]

    constructor(type: QuestType, name: string, endTime: number, rewards: Reward[]) {
        this.type = type
        this.name = name
        this.endTime = endTime
        this.rewards = rewards
    }
}

export class Reward {
    name: string
    count: number

    constructor(name: string, count: number) {
        this.name = name
        this.count = count
    }
}

export class MarketPlace {
    data = new Map<string, number>()

    toJSON() {
        return {
            data: Array.from(this.data.entries()),
        }
    }

    onePcsPrice(name: string): number {
        const bundleSize = MarketPlaceBundle.get(name)
        const price = this.data.get(name)
        if (bundleSize && price) {
            return price / bundleSize
        } else {
            return 0
        }
    }
}

export class Player {
    inventory = new Map<string, number>()

    toJSON() {
        return {
            inventory: Array.from(this.inventory.entries()),
        }
    }
}

export class DataStore {
    lands = new Map<number, Land>()
    marketPlace = new MarketPlace()
    player = new Player()

    toJSON() {
        return {
            lands: Array.from(this.lands.entries()),
            marketPlace: this.marketPlace,
            player: this.player,
        }
    }
}
