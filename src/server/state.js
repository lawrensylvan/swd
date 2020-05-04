import { State as GameState } from '../core/state'

export const ServerState = () => ({

    sockets: [],
    players: [],
    playersBySocket: {},
    tables: [],

    registerSocket(socket) {
        if(this.sockets.includes(socket)) throw 'This socket is already registered'
        this.sockets.push(socket)
        console.log('Registered sockets : ' + this.sockets)
    },

    unregisterSocket(socket) {
        if(!this.sockets.includes(socket)) throw 'This socket is not registered'
        this.sockets.splice(this.sockets.indexOf(socket), 1)
    },

    registerPlayer(player, socket) {
        if(!this.sockets.includes(socket)) throw 'Cannot register player for unregistered socket'
        if(!this.players.includes(player)) {
            this.players.push(player)
        }
        this.playersBySocket[socket] = player
    },

    getPlayerBySocket(socket) {
        return this.playersBySocket[socket]
    },

    kick(player) {
        this.tables.forEach(t => t.kick(player))
    },

    createTable(creator) {
        if(!this.players.includes(creator)) throw 'This player does not exist'
        const id = this.tables.length
        const table = Table(this.tables.length, creator)
        this.tables.push(table)
        return id
    },

    joinTable(player, tableId) {
        if(!this.players.includes(player)) throw 'This player does not exist'
        if(tableId >= this.tables.length) throw 'This table does not exist'
        const table = this.tables[tableId]
        table.addPlayer(player)
    },

    playerIsReady(player, tableId) {
        if(!this.players.includes(player)) throw 'This player does not exist'
        if(tableId >= this.tables.length) throw 'This table does not exist'
        const table = this.tables[tableId]
        table.playerIsReady(player)
    }
})

const Table = (id, creator) => ({
    id: id,
    creator: creator,
    players: [creator],
    playersReady: [],
    status: 'WAITING_FOR_MORE_PLAYERS',

    hasEnoughPlayer() {
        return this.players.length === 2
    },

    isFull() {
        return this.players.length === 2
    },

    isFreeToJoin() {
        return this.status === 'WAITING_FOR_MORE_PLAYERS' && !this.isFull()
    },

    addPlayer(player) {
        if(this.players.includes(player)) throw 'You are already in this table'
        if(this.isFull()) throw 'This table is full'
        if(!this.isFreeToJoin()) throw 'This table is not free to join'

        this.players.push(player)
        //if(!this.creator) this.creator = player
        if(this.players.length === 2) {
            this.status = 'WAITING_FOR_PLAYERS_READY'
        }
    },

    playerIsReady(player) {
        if(this.status !== 'WAITING_FOR_PLAYERS_READY') throw 'Not a time to be ready'
        if(this.playersReady.includes(player)) throw 'The player is already ready'
        this.playersReady.push(player)
        if(this.playersReady.length === this.players.length) {
            this.status = 'READY_TO_START'
        }
    },

    kick(player) {
        this.players.splice(this.players.indexOf(player), 1)
    },

    start() {
        this.status = 'IN_PROGRESS'
        // TODO
    }

})