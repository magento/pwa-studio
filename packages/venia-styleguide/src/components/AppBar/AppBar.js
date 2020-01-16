import React from "react"

import classes from "./AppBar.css"

const AppBar = props => {
    const { children } = props

    return (
        <header className={classes.root}>
            {children}
        </header>
    )
}

export default AppBar
