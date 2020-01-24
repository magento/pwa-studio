import { Fragment } from "react"

import AppBar from "../../../../components/AppBar"
import Box from "../../../../components/Box"
import Columns from "../../../../components/Columns"
import ThreeColumnGrid from "./ThreeColumnGrid"
import Toolbars from "./Toolbars"

<Columns>
  <ThreeColumnGrid />
  <AppBar>
    <Box style={{ width: 960 }} />
    <Box style={{ width: 48 }} />
    <Box style={{ width: 960 }} />
  </AppBar>
</Columns>
<Columns>
  <Toolbars />
  <AppBar>
    <Fragment>
      <Box style={{ width: 48 }} />
      <Box style={{ width: 48 }} />
    </Fragment>
    <Fragment />
    <Fragment>
      <Box style={{ width: 48 }} />
      <Box style={{ width: 48 }} />
    </Fragment>
  </AppBar>
</Columns>
