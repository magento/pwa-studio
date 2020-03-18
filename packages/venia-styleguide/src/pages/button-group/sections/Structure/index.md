import Button from "../../../../components/Button"
import ButtonGroup from "../../../../components/ButtonGroup"
import Box from "../../../../components/Box"
import Columns from "../../../../components/Columns"
import Dimensions from "./Dimensions"
import GridLayout from "./GridLayout"

<Columns>
  <GridLayout />
  <ButtonGroup>
    <Box style={{ height: 40, width: 160 }} />
    <Box style={{ height: 40, width: 160 }} />
  </ButtonGroup>
</Columns>
<Columns>
  <Dimensions />
  <ButtonGroup>
    <Button priority="low">Back</Button>
    <Button priority="normal">Next</Button>
  </ButtonGroup>
</Columns>
