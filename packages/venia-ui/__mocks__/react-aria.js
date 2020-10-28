import { Fragment } from "react"

const reactAria = jest.requireActual("react-aria")
const FocusScope = Fragment

module.exports = {
    ...reactAria,
    FocusScope
}
