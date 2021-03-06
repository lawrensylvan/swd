import { compare } from 'fast-json-patch'

import { GameState } from '../../core/state' // TODO : IOC
import { GameFlow } from '../../core/flow'

export const Game = (players, tableId) => {

    let state = GameState(players)
    let flow = GameFlow(state)
    let publicStates = {}
    let cachedPublicStates = {}
    let expectedMove = {}
    let gameFlowStack = []

    return {

        id: tableId,

        getGameFlow() {
            return flow
        },

        registerExpectedMove(player, moveHandlers, gameFlow) {
            expectedMove = {
                player, moveHandlers
            }
            gameFlowStack.push(gameFlow)
        },

        getExpectedMoveHandler(player, move) {
            if(expectedMove.player !== player) return null
            return expectedMove.moveHandlers.filter(m => m.name === move.type)?.[0]
        },

        popGameFlow() {
            return gameFlowStack.pop()
        },

        computePublicStates() {
            publicStates = players.map(p => state.getPublicState4(p))
        },

        getGameState4 : (player) => {
            if(!publicStates[player]) {
                publicStates[player] = state.getPublicState4(player)
            }
            cachedPublicStates[player] = publicStates[player]
            return publicStates[player]
        },

        getGameStatePatch4 : (player) => {
            const oldState = cachedPublicStates[player] || [] // todo : player is the name, should use id !
            if(!publicStates[player]) {
                publicStates[player] = state.getPublicState4(player)
            }
            const newState = publicStates[player]
            const patch = compare(oldState, newState)
            cachedPublicStates[player] = publicStates[player]
            return patch
        },

        getFirstGameEvent : () => {
            return flow.startGame() // TODO : IOC
        }

    }
    
}