import React from "react"

import classes from "./Trigger.css"

const Trigger = props => {
    const { children } = props

    return (
        <button className={classes.root} type="button">
            {children}
        </button>
    )
}

export default Trigger
