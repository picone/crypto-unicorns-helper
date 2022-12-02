import type { UnicornClass, UnicornClassGroup } from './game'

type QuestRarity = 'common' | 'rare' | 'mythic' | 'exotic' | 'spring' | 'summer' | 'fall' | 'winter' | ''
type QuestInterval = 'daily' | 'weekly' | 'events'
type RecipeItemType = 'item' | 'crypto_currency'
type RecipeType = 'materials' | 'boosters' | 'keystones' | 'farm_item' | 'quest_item' | 'materials_class'

export class CraftingRecipeDefinitionList {
    readonly items: Map<string, CraftingRecipeDefinition>
    readonly pcsCost = new Map<string, CraftingRecipeDefinition>()

    constructor(items: Map<string, CraftingRecipeDefinition>) {
        this.items = items
        // create a map that record cost in each item.
        items.forEach((item, name) => {
            this.pcsCost.set(name, new CraftingRecipeDefinition(
                item.timeCost / item.outputQuantity,
                item.energyCost / item.outputQuantity,
                item.type,
                item.unimCost / item.outputQuantity,
                item.level,
                1,
                item.materialCost.map(material => {
                    return new RecipeItemInfo(
                        material.name,
                        material.amount / item.outputQuantity,
                        material.type,
                    )
                }),
                item.class,
                item.classGroup,
            ))
        })
    }
}

export class CraftingRecipeDefinition {
    timeCost: number // minutes
    energyCost: number
    type: RecipeType
    materialCost: RecipeItemInfo[]
    unimCost: number
    level: number
    outputQuantity: number
    class: UnicornClass
    classGroup: UnicornClassGroup

    constructor(timeCost: number, energyCost: number, type: RecipeType,
        unimCost: number, level: number, outputQuantity: number, 
        materialCost: RecipeItemInfo[], unicornClass: UnicornClass='',
        classGroup: UnicornClassGroup='') {
        this.timeCost = timeCost
        this.energyCost = energyCost
        this.type = type
        this.materialCost = materialCost
        this.unimCost = unimCost
        this.level = level
        this.outputQuantity = outputQuantity
        this.class = unicornClass
        this.classGroup = classGroup
    }
}

export class RecipeItemInfo {
    name: string
    amount: number
    type: RecipeItemType

    constructor(name: string, amount: number, type: RecipeItemType='item') {
        this.name = name
        this.amount = amount
        this.type = type
    }
}

export type PostboardLevelsDefinitionList = PostboardLevelsDefinition[]
export class PostboardLevelsDefinition {
    level: number
    maxQuestsDaily: number
    maxQuestsWeekly: number

    constructor(level: number, maxQuestsDaily: number, maxQuestsWeekly: number) {
        this.level = level
        this.maxQuestsDaily = maxQuestsDaily
        this.maxQuestsWeekly = maxQuestsWeekly
    }
}

export class QuestUnicornsRecipeDefinition {
    requirements: QuestUnicornsRecipeDefinitionRequirementDataStruct[]

    constructor(requirements: QuestUnicornsRecipeDefinitionRequirementDataStruct[]) {
        this.requirements = requirements
    }
}

export class QuestUnicornsRecipeDefinitionRequirementDataStruct {
    unicornsAmount: number
    withdrawnEnergy: number

    constructor(unicornsAmount: number, withdrawnEnergy: number) {
        this.unicornsAmount = unicornsAmount
        this.withdrawnEnergy = withdrawnEnergy
    }
}

export class QuestDefinition {
    name: string
    interval: QuestInterval
    rarity: QuestRarity
    durationHours: number

    constructor(name: string, interval: QuestInterval, rarity: QuestRarity, durationHours: number) {
        this.name = name
        this.interval = interval
        this.rarity = rarity
        this.durationHours = durationHours
    }
}

const CraftingRecipeList = new CraftingRecipeDefinitionList(new Map([
    ['milled_wood_plank', new CraftingRecipeDefinition(
        1080, 2, 'materials', 100, 1, 8, [
            new RecipeItemInfo('raw_wood_plank', 20),
            new RecipeItemInfo('plain_berry', 100),
        ]
    )],
    ['tough_nails', new CraftingRecipeDefinition(
        1080, 2, 'materials', 100, 1, 8, [
            new RecipeItemInfo('cheap_nails', 20),
            new RecipeItemInfo('plain_berry', 100),
        ]
    )],
    ['fine_cord', new CraftingRecipeDefinition(
        1080, 2, 'materials', 100, 1, 8, [
            new RecipeItemInfo('frayed_rope', 20),
            new RecipeItemInfo('plain_berry', 100),
        ]
    )],
    ['giggle_shards', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('milled_wood_plank', 8),
            new RecipeItemInfo('fine_cord', 7),
            new RecipeItemInfo('heart_berry', 50),
            new RecipeItemInfo('heart_seed', 10),
        ]
    )],
    ['moondust', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('tough_nails', 8),
            new RecipeItemInfo('milled_wood_plank', 7),
            new RecipeItemInfo('moon_berry', 50),
            new RecipeItemInfo('moon_seed', 10),
        ]
    )],
    ['pollen_powder', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('milled_wood_plank', 15),
            new RecipeItemInfo('flower_berry', 50),
            new RecipeItemInfo('flower_seed', 10),
        ]
    )],
    ['spectrum_spice', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('tough_nails', 8),
            new RecipeItemInfo('fine_cord', 7),
            new RecipeItemInfo('rainbow_berry', 50),
            new RecipeItemInfo('rainbow_seed', 10),
        ]
    )],
    ['gem_pebbles', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('tough_nails', 15),
            new RecipeItemInfo('crystal_berry', 50),
            new RecipeItemInfo('crystal_seed', 10),
        ]
    )],
    ['sugar_sprinkles', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('milled_wood_plank', 8),
            new RecipeItemInfo('tough_nails', 7),
            new RecipeItemInfo('candy_berry', 50),
            new RecipeItemInfo('candy_seed', 10),
        ]
    )],
    ['dewdrops', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('fine_cord', 15),
            new RecipeItemInfo('cloud_berry', 50),
            new RecipeItemInfo('cloud_seed', 10),
        ]
    )],
    ['energy_cell', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('tough_nails', 8),
            new RecipeItemInfo('fine_cord', 7),
            new RecipeItemInfo('star_berry', 50),
            new RecipeItemInfo('star_seed', 10),
        ]
    )],
    ['fresh_dough', new CraftingRecipeDefinition(
        1080, 2, 'materials', 150, 2, 7, [
            new RecipeItemInfo('milled_wood_plank', 8),
            new RecipeItemInfo('fine_cord', 7),
            new RecipeItemInfo('omnom_berry', 50),
            new RecipeItemInfo('omnom_seed', 10),
        ]
    )],
    ['artisanal_wood_plank', new CraftingRecipeDefinition(
        1800, 3, 'materials', 150, 3, 5, [
            new RecipeItemInfo('milled_wood_plank', 18),
            new RecipeItemInfo('plain_berry', 150),
        ]
    )],
    ['forged_nails', new CraftingRecipeDefinition(
        1800, 3, 'materials', 150, 3, 5, [
            new RecipeItemInfo('tough_nails', 18),
            new RecipeItemInfo('plain_berry', 150),
        ]
    )],
    ['golden_thread', new CraftingRecipeDefinition(
        1800, 3, 'materials', 150, 3, 5, [
            new RecipeItemInfo('fine_cord', 18),
            new RecipeItemInfo('plain_berry', 150),
        ]
    )],
    ['fun_fragments', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('giggle_shards', 10),
            new RecipeItemInfo('golden_thread', 6),
            new RecipeItemInfo('heart_berry', 50),
            new RecipeItemInfo('heart_seed', 10),
        ], '', 'light'
    )],
    ['luna_rocks', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('moondust', 10),
            new RecipeItemInfo('forged_nails', 6),
            new RecipeItemInfo('moon_berry', 50),
            new RecipeItemInfo('moon_seed', 10),
        ], '', 'mystery'
    )],
    ['fresh_toadstools', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('pollen_powder', 10),
            new RecipeItemInfo('artisanal_wood_plank', 6),
            new RecipeItemInfo('flower_berry', 50),
            new RecipeItemInfo('flower_seed', 10),
        ], '', 'wonder'
    )],
    ['leprechaun_dubloons', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('spectrum_spice', 10),
            new RecipeItemInfo('golden_thread', 6),
            new RecipeItemInfo('rainbow_berry', 50),
            new RecipeItemInfo('rainbow_seed', 10),
        ], '', 'light'
    )],
    ['polished_gemstones', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('gem_pebbles', 10),
            new RecipeItemInfo('forged_nails', 6),
            new RecipeItemInfo('crystal_berry', 50),
            new RecipeItemInfo('crystal_seed', 10),
        ], '', 'mystery'
    )],
    ['sticky_taffy', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('sugar_sprinkles', 10),
            new RecipeItemInfo('artisanal_wood_plank', 6),
            new RecipeItemInfo('candy_berry', 50),
            new RecipeItemInfo('candy_seed', 10),
        ], '', 'wonder'
    )],
    ['cirrus_flakes', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('dewdrops', 10),
            new RecipeItemInfo('golden_thread', 6),
            new RecipeItemInfo('cloud_berry', 50),
            new RecipeItemInfo('cloud_seed', 10),
        ], '', 'light'
    )],
    ['power_pack', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('energy_cell', 10),
            new RecipeItemInfo('forged_nails', 6),
            new RecipeItemInfo('star_berry', 50),
            new RecipeItemInfo('star_seed', 10),
        ], '', 'mystery'
    )],
    ['stinky_cheese', new CraftingRecipeDefinition(
        1440, 6, 'materials_class', 300, 4, 6, [
            new RecipeItemInfo('fresh_dough', 10),
            new RecipeItemInfo('artisanal_wood_plank', 6),
            new RecipeItemInfo('omnom_berry', 50),
            new RecipeItemInfo('omnom_seed', 10),
        ], '', 'wonder'
    )],
    ['kawaii_crystal', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('fun_fragments', 8),
            new RecipeItemInfo('giggle_shards', 7),
            new RecipeItemInfo('heart_berry', 50),
            new RecipeItemInfo('heart_seed', 10),
        ], 'heart'
    )],
    ['dark_matter', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('luna_rocks', 8),
            new RecipeItemInfo('moondust', 7),
            new RecipeItemInfo('moon_berry', 50),
            new RecipeItemInfo('moon_seed', 10),
        ], 'moon'
    )],
    ['vibrant_blooms', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('fresh_toadstools', 8),
            new RecipeItemInfo('pollen_powder', 7),
            new RecipeItemInfo('flower_berry', 50),
            new RecipeItemInfo('flower_seed', 10),
        ], 'flower'
    )],
    ['pot_of_gold', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('leprechaun_dubloons', 8),
            new RecipeItemInfo('spectrum_spice', 7),
            new RecipeItemInfo('rainbow_berry', 50),
            new RecipeItemInfo('rainbow_seed', 10),
        ], 'rainbow'
    )],
    ['ice_cubes', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('cirrus_flakes', 8),
            new RecipeItemInfo('dewdrops', 7),
            new RecipeItemInfo('cloud_berry', 50),
            new RecipeItemInfo('cloud_seed', 10),
        ], 'cloud'
    )],
    ['geode_core', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('polished_gemstones', 8),
            new RecipeItemInfo('gem_pebbles', 7),
            new RecipeItemInfo('crystal_berry', 50),
            new RecipeItemInfo('crystal_seed', 10),
        ], 'crystal'
    )],
    ['reactor_charge', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('power_pack', 8),
            new RecipeItemInfo('energy_cell', 7),
            new RecipeItemInfo('star_berry', 50),
            new RecipeItemInfo('star_seed', 10),
        ], 'star'
    )],
    ['jaw_breaker_heart', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('sticky_taffy', 8),
            new RecipeItemInfo('sugar_sprinkles', 7),
            new RecipeItemInfo('candy_berry', 50),
            new RecipeItemInfo('candy_seed', 10),
        ], 'candy'
    )],
    ['steaming_pizzas', new CraftingRecipeDefinition(
        2160, 10, 'materials_class', 500, 5, 4, [
            new RecipeItemInfo('stinky_cheese', 8),
            new RecipeItemInfo('fresh_dough', 7),
            new RecipeItemInfo('omnom_berry', 50),
            new RecipeItemInfo('omnom_seed', 10),
        ], 'omnom'
    )],
    ['plain_seed_bag', new CraftingRecipeDefinition(
        1080, 2, 'farm_item', 50, 5, 6, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('plain_seed', 24),
        ],
    )],
    ['heart_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('heart_seed', 25),
        ],
    )],
    ['cloud_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('cloud_seed', 25),
        ],
    )],
    ['rainbow_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('rainbow_seed', 25),
        ],
    )],
    ['flower_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('flower_seed', 25),
        ],
    )],
    ['candy_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('candy_seed', 25),
        ],
    )],
    ['omnom_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('omnom_seed', 25),
        ],
    )],
    ['crystal_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('crystal_seed', 25),
        ],
    )],
    ['star_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('star_seed', 25),
        ],
    )],
    ['moon_seed_bag', new CraftingRecipeDefinition(
        1200, 3, 'farm_item', 75, 6, 5, [
            new RecipeItemInfo('frayed_rope', 6),
            new RecipeItemInfo('moon_seed', 25),
        ],
    )],
    ['raw_wood_plank_seed_bag', new CraftingRecipeDefinition(
        1440, 4, 'farm_item', 100, 7, 3, [
            new RecipeItemInfo('frayed_rope', 3),
            new RecipeItemInfo('raw_wood_plank_seed', 21),
        ],
    )],
    ['cheap_nails_seed_bag', new CraftingRecipeDefinition(
        1440, 4, 'farm_item', 100, 7, 3, [
            new RecipeItemInfo('frayed_rope', 3),
            new RecipeItemInfo('cheap_nails_seed', 21),
        ],
    )],
    ['frayed_rope_seed_bag', new CraftingRecipeDefinition(
        1440, 4, 'farm_item', 100, 7, 3, [
            new RecipeItemInfo('frayed_rope', 3),
            new RecipeItemInfo('frayed_rope_seed', 21),
        ],
    )],
    ['common_scroll', new CraftingRecipeDefinition(
        180, 1, 'quest_item', 250, 3, 1, [
            new RecipeItemInfo('fine_cord', 3),
            new RecipeItemInfo('spectrum_spice', 5),
            new RecipeItemInfo('dewdrops', 5),
            new RecipeItemInfo('plain_berry', 100),
        ],
    )],
    ['rare_scroll', new CraftingRecipeDefinition(
        720, 3, 'quest_item', 500, 5, 1, [
            new RecipeItemInfo('common_scroll', 1),
            new RecipeItemInfo('energy_cell', 10),
            new RecipeItemInfo('pollen_powder', 10),
            new RecipeItemInfo('plain_berry', 150),
        ],
    )],
    ['mythic_scroll', new CraftingRecipeDefinition(
        1440, 5, 'quest_item', 1000, 7, 1, [
            new RecipeItemInfo('rare_scroll', 1),
            new RecipeItemInfo('sugar_sprinkles', 15),
            new RecipeItemInfo('giggle_shards', 15),
            new RecipeItemInfo('plain_berry', 250),
        ],
    )],
    ['exotic_scroll', new CraftingRecipeDefinition(
        2880, 8, 'quest_item', 2000, 9, 1, [
            new RecipeItemInfo('mythic_scroll', 1),
            new RecipeItemInfo('gem_pebbles', 20),
            new RecipeItemInfo('fresh_dough', 20),
            new RecipeItemInfo('plain_berry', 500),
        ],
    )],
    ['breeding_1', new CraftingRecipeDefinition(
        360, 1, 'boosters', 100, 3, 1, [
            new RecipeItemInfo('giggle_shards', 3),
            new RecipeItemInfo('spectrum_spice', 3),
            new RecipeItemInfo('dewdrops', 3),
            new RecipeItemInfo('plain_berry', 10),
        ],
    )],
    ['breeding_2', new CraftingRecipeDefinition(
        720, 2, 'boosters', 300, 4, 1, [
            new RecipeItemInfo('breeding_1', 1),
            new RecipeItemInfo('moondust', 5),
            new RecipeItemInfo('gem_pebbles', 5),
            new RecipeItemInfo('plain_berry', 25),
        ],
    )],
    ['breeding_3', new CraftingRecipeDefinition(
        1080, 3, 'boosters', 600, 5, 1, [
            new RecipeItemInfo('breeding_2', 1),
            new RecipeItemInfo('pollen_powder', 10),
            new RecipeItemInfo('sugar_sprinkles', 10),
            new RecipeItemInfo('plain_berry', 50),
        ],
    )],
    ['breeding_4', new CraftingRecipeDefinition(
        1440, 5, 'boosters', 1000, 6, 1, [
            new RecipeItemInfo('breeding_3', 1),
            new RecipeItemInfo('fun_fragments', 3),
            new RecipeItemInfo('leprechaum_dubloons', 3),
            new RecipeItemInfo('plain_berry', 100),
        ],
    )],
    ['breeding_5', new CraftingRecipeDefinition(
        2160, 8, 'boosters', 3000, 8, 1, [
            new RecipeItemInfo('breeding_4', 1),
            new RecipeItemInfo('polished_gemstones', 5),
            new RecipeItemInfo('power_pack', 5),
            new RecipeItemInfo('plain_berry', 150),
        ],
    )],
    ['breeding_6', new CraftingRecipeDefinition(
        2880, 12, 'boosters', 10000, 10, 1, [
            new RecipeItemInfo('breeding_5', 1),
            new RecipeItemInfo('steaming_pizzas', 5),
            new RecipeItemInfo('vibrant_blooms', 5),
            new RecipeItemInfo('plain_berry', 250),
        ],
    )],
]))

const MarketPlaceBundle = new Map<string, number>([
    ['plain_seed', 100],
    ['heart_seed', 50],
    ['cloud_seed', 50],
    ['rainbow_seed', 50],
    ['flower_seed', 50],
    ['candy_seed', 50],
    ['omnom_seed', 50],
    ['crystal_seed', 50],
    ['star_seed', 50],
    ['wood_seed', 10],
    ['rope_seed', 10],
    ['nail_seed', 10],
    ['moon_seed', 50],
    ['plain_berry', 200],
    ['cloud_berry', 100],
    ['heart_berry', 100],
    ['rainbow_berry', 100],
    ['flower_berry', 100],
    ['candy_berry', 100],
    ['omnom_berry', 100],
    ['crystal_berry', 100],
    ['moon_berry', 100],
    ['star_berry', 100],
    ['raw_wood_plank', 100],
    ['milled_wood_plank', 25],
    ['cheap_nails', 100],
    ['tough_nails', 25],
    ['frayed_rope', 100],
    ['fine_cord', 25],
    ['giggle_shards', 10],
    ['spectrum_spice', 10],
    ['dewdrops', 10],
    ['moondust', 10],
    ['gem_pebbles', 10],
    ['energy_cell', 10],
    ['pollen_powder', 10],
    ['sugar_sprinkles', 10],
    ['fresh_dough', 10],
    ['breeding_1', 1],
    ['breeding_2', 1],
    ['breeding_3', 1],
    ['evolution_1', 1],
    ['evolution_2', 1],
    ['evolution_3', 1],
])

const UnicornBerries = new Map<UnicornClass, string>([
    ['crystal', 'crystal_berry'],
    ['cloud', 'cloud_berry'],
    ['heart', 'heart_berry'],
    ['moon', 'moon_berry'],
    ['flower', 'flower_berry'],
    ['candy', 'candy_berry'],
    ['omnom', 'omnom_berry'],
    ['rainbow', 'rainbow_berry'],
    ['star', 'star_berry'],
])

export { CraftingRecipeList, MarketPlaceBundle, UnicornBerries }
