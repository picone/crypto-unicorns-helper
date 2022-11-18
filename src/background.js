import { TCompactProtocol, TFramedTransport } from 'thrift'
import { RspGroupListenerRegister, MsgGroupUpdate } from './gen-nodejs/cu_types'
const Buffer = require('buffer/').Buffer
import { decode as DecodeMsgPack } from '@msgpack/msgpack'
import { Building, BuildingEvent, BuildingSlot, DataStore, Land } from './models/store'
//import { Get as StorageGet, Set as StorageSet } from './local_storage'

let dataStore = new DataStore()

function decodeMessage(msg) {
    if (!msg?.data) {
        return null
    }
    let resp = null
    switch (msg?.command) {
    case 314:
        resp = new RspGroupListenerRegister()
        break
    case 350:
        resp = new MsgGroupUpdate()
        break
    default:
        return null
    }
    // decode thrift
    const protocol = new TCompactProtocol(new TFramedTransport(Buffer.from(msg.data, 'base64')))
    resp.read(protocol)
    return resp
}

function dispatchMessage(msg) {
    if (msg instanceof RspGroupListenerRegister) {
        if (!msg?.group?.props) {
            return
        }
        if (msg.group?.base?.type != 'lod1') {
            return
        }
        const landId = parseInt(msg.group?.base?.id?.substr(5), 10)
        updateLand(landId, DecodeMsgPack(msg?.group?.props))
    } else if (msg instanceof MsgGroupUpdate) {
        if (!msg?.group?.props) {
            return
        }
        if (!msg?.name?.startsWith('lod1/')) {
            return
        }
        const landId = parseInt(msg.name.substr(5), 10)
        updateLand(landId, DecodeMsgPack(msg?.group?.props))
    }
}

function updateLand(landId, msg) {
    let land = null
    if (Object.prototype.hasOwnProperty.call(dataStore.lands, landId)) {
        land = dataStore.lands[landId]
    } else {
        land = new Land()
        dataStore.lands[landId] = land
    }
    land.id = landId
    if (msg.land?.name) {
        land.name = msg.land.name
    }
    if (msg?.land?.type) {
        land.class = msg.land.type
    } else if (msg?.land?.class) {
        land.class = msg.land.class
    }
    if (msg?.land?.level) {
        land.level = msg.land.level
    }
    if (msg?.land?.xp) {
        land.xp = msg.state.xp
    }
    if (msg?.buildings) {
        for (const buildingId in msg?.buildings) {
            const item = msg?.buildings[buildingId]
            const building = new Building()
            building.id = buildingId
            building.type = item?.type
            building.level = item?.level
            building.state = item?.state
            building.events = item?.events?.map(evt => {
                return new BuildingEvent(evt.timestamp)
            })
            if (item?.type === 'nursery' && (item?.state === 'breeding_in_progress'
                || item?.state === 'breeding_finished')) {
                const breeding = item?.data?.breeding
                const slot = new BuildingSlot()
                slot.completedAt = breeding?.end_time
                slot.startAt = breeding?.start_time
                slot.state = item.state === 'breeding_in_progress' ? 'in_progress' : 'collectable'
                building.slots[0] = slot
            } else if (item?.type === 'nursery' && (item?.state === 'evolution_in_progress'
            || item?.state === 'evolution_finished')) {
                const evolution = item?.data?.evolution
                const slot = new BuildingSlot()
                slot.completedAt = evolution?.end_time
                slot.startAt = evolution?.start_time
                slot.state = item.state === 'evolution_in_progress' ? 'in_progress' : 'collectable'
                building.slots[0] = slot
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
                    building.slots[slotId] = slot
                }
            }
            land.buildings[buildingId] = building
        }
    }
}

function updateAlertTime() {
    if (!dataStore) {
        return
    }
    let notifyTime = Number.MAX_SAFE_INTEGER
    const nowTs = (new Date()).valueOf()
    for (const landId in dataStore.lands) {
        const land = dataStore.lands[landId]
        for (const buildingId in land.buildings) {
            const building = land.buildings[buildingId]
            building.events.forEach(event => {
                if (event.timestamp > nowTs) {
                    notifyTime = Math.min(event.timestamp, notifyTime)
                }
            })
        }
    }
    console.log(notifyTime)
    if (notifyTime < Number.MAX_SAFE_INTEGER) {
        chrome.notifications.create('CU_NOTIFICATION', {
            type: 'basic',
            title: 'Your unicorns are waiting for you',
            message: 'It\'s time to collect your rewards!',
            iconUrl: 'imgs/icon.png',
            eventTime: notifyTime,
            silent: true,
        })
    }
}

function initBackground() {
    chrome.runtime.onConnect.addListener(port => {
        if (port.sender.url.endsWith('/events.html')) {
            port.postMessage({
                dataStore: dataStore,
            })
            console.log(dataStore)
        }
    })
    chrome.runtime.onMessage.addListener(msg => {
        if (msg?.type == 'recv') {
            dispatchMessage(decodeMessage(msg))

            chrome.storage.local.set({
                dataStore: JSON.stringify(dataStore),
            })
            updateAlertTime()
        }
    })
    // restore data
    chrome.storage.local.get(['dataStore'], result => {
        if (result?.dataStore) {
            try {
                dataStore = JSON.parse(result.dataStore)
            } catch (e) {
                console.log(e)
            }
        }
    })
}

initBackground()
