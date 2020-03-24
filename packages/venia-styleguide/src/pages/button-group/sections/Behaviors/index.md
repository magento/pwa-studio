import { Fragment } from "react"

import Box from "../../../../components/Box"
import Button from "../../../../components/Button"
import ButtonGroup from "../../../../components/ButtonGroup"
import Columns from "../../../../components/Columns"
import ExampleGroup from "../../../../components/ExampleGroup"
import InFlow from "./InFlow"
import ResponsiveLayout from "./ResponsiveLayout"

<Columns reverse>
    <InFlow />
    <Fragment>
      <Box style={{ background: "white", boxShadow: "none", width: "100%" }}>
        <Box style={{ height: 80, margin: "32px auto", width: 280 }} />
      </Box>
      <ButtonGroup>
        <Button priority="high">Sign In</Button>
      </ButtonGroup>
  </Fragment>
</Columns>
<Columns reverse>
  <ResponsiveLayout />
</Columns>
