import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import socketIO from 'socket.io-client'
import createSocketIOMiddleware from 'redux-socket.io'

import reducers from './reducers'

const io = socketIO('http://' + serverHost + ':' + serverPort)

io.on('server error', (error) => alert(`Got error from server : ${error}`))

const delayedActionMiddleware = store => next => {
    let stepsYetToApply = 0 // TODO : this should be game-specific and not global

    return action => {
        if(action.type === 'gameStatePatched') {
            setTimeout(() => {
                next(action)
                stepsYetToApply--
            }, 500 + stepsYetToApply * 1100) // TODO : nicer to wait for render+animation end instead of an arbitrary time
            stepsYetToApply++
            return
        }
        return next(action)
    }
}

const store = createStore(
    combineReducers(reducers),
    composeWithDevTools(
        applyMiddleware(
            createSocketIOMiddleware(io, 'server/'), // actions beginning with 'server/' will be sent to server as 'action' messages
            delayedActionMiddleware                 // 1,1 second interval between firing of each redux action
            )
        )
)

export default store