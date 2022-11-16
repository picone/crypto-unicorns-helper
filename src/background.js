import { TCompactProtocol, TFramedTransport } from 'thrift'
import { RspGroupListenerRegister, MsgGroupUpdate } from './gen-nodejs/cu_types'
const Buffer = require('buffer/').Buffer
import { decode as DecodeMsgPack } from '@msgpack/msgpack'
import { Building, BuildingEvent, BuildingSlot, DataStore, Land } from './models/store'

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
            land.buildings[buildingId] = building
        }
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
        }
    })
}

initBackground()
