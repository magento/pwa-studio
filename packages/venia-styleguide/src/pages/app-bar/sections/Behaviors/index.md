import { Fragment } from "react"
import { Circle, Menu, ShoppingCart, X } from "react-feather"

import AppBar from "../../../../components/AppBar"
import Box from "../../../../components/Box"
import Columns from "../../../../components/Columns"
import ExampleGroup from "../../../../components/ExampleGroup"
import Trigger from "../../../../components/Trigger"
import FixedPosition from "./FixedPosition"
import MaximumWidth from "./MaximumWidth"
import ResponsiveSize from "./ResponsiveSize"

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
    <Box style={{ background: "white", boxShadow: "none", margin: "2px 0 0 0", width: "100%" }}>
      <Box style={{ height: 80, margin: "32px auto", width: 280 }} />
    </Box>
  </Fragment>
</Columns>
<Columns reverse>
  <MaximumWidth />
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
    <Box style={{ background: "white", boxShadow: "none", margin: "2px 0 0 0", width: "100%" }}>
      <Box style={{ height: 80, margin: "32px auto", width: 280 }} />
    </Box>
  </Fragment>
</Columns>
<Columns reverse>
  <ResponsiveSize />
</Columns>
