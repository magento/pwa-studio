import React, { createContext, useContext, useMemo } from "react"
import { Observable } from "@apollo/client"

const EventContext = createContext()
const noop = () => {}

const EventContextProvider = props => {
    const { children } = props
    const eventState = new Observable(noop)

    const eventApi = useMemo(() => ({
        subscribe: (...args) => eventState.subscribe(...args)
    }), [eventState])

    const contextValue = useMemo(() => [eventApi, eventState], [eventApi, eventState])

    return <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>
}

export default EventContextProvider

export const useEventContext = () => useContext(EventContext)
