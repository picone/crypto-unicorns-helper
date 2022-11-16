type UnicornClass = 'crystal' | 'cloud' | 'heart' | 'moon' | 'flower' | 'candy' |
    'omnom' | 'rainbow' | 'star'
type LandClass = UnicornClass | 'light' | 'mystery' | 'wonder' | 'mythic'
type BuildingType = 'farm' | 'workshop' | 'cart' | 'stables' | 'nursery'
type BuildingState = 'in_progress' | 'idle' | 'collectable'

export class Land {
    id: number
    class: LandClass
    name: string
    level: number
    xp: number
    buildings: object = {}
}

export class Building {
    id: string
    events: BuildingEvent[]
    slots: object = {}
    type: BuildingType
    level: number
    state: BuildingState
}

export class BuildingEvent {
    timestamp: number
    constructor(ts: number) {
        this.timestamp = ts
    }
}

export class BuildingSlot {
    completedAt : number
    startAt: number
    state: BuildingState
}

export class DataStore {
    lands: object = {}
}
