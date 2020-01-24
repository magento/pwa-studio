import { Fragment } from "react"
import { Circle, Menu, ShoppingCart, X } from "react-feather"

import AppBar from "../../../../components/AppBar"
import Box from "../../../../components/Box"
import Columns from "../../../../components/Columns"
import ExampleGroup from "../../../../components/ExampleGroup"
import Trigger from "../../../../components/Trigger"
import FixedPosition from "./FixedPosition"
import FullWidth from "./FullWidth"

<Columns reverse>
  <FixedPosition />
  <Fragment>
    <AppBar>
      <Trigger>
        <Menu />
      </Trigger>
      <Trigger>
        <Circle />
      </Trigger>
      <Trigger>
        <ShoppingCart />
      </Trigger>
    </AppBar>
    <Box style={{ background: "white", boxShadow: "none", width: "100%" }}>
      <Box style={{ height: 80, margin: "32px auto", width: 280 }} />
    </Box>
  </Fragment>
</Columns>
<Columns reverse>
  <FullWidth />
  <Fragment>
    <AppBar>
      <Trigger>
        <Menu />
      </Trigger>
      <Fragment />
      <Trigger>
        <X />
      </Trigger>
    </AppBar>
    <Box style={{ background: "white", boxShadow: "none", width: "100%" }}>
      <Box style={{ height: 80, margin: "32px auto", width: 280 }} />
    </Box>
  </Fragment>
</Columns>
