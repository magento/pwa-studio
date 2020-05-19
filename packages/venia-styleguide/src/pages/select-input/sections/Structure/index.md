import { Fragment } from "react"
import { Circle } from "react-feather"

import Box from "../../../../components/Box"
import Button from "../../../../components/Button"
import Columns from "../../../../components/Columns"
import Field from "../../../../components/Field"
import SelectInput from "../../../../components/SelectInput"
import Dimensions from "./Dimensions"
import GridLayout from "./GridLayout"

<Columns>
  <GridLayout />
  <Field label="Size">
    <SelectInput>
      <option value="S">Small</option>
      <option value="M">Medium</option>
      <option value="L">Large</option>
    </SelectInput>
  </Field>
</Columns>
<Columns>
  <Dimensions />
  <Fragment>
    <Field label="Qty">
      <SelectInput>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectInput>
    </Field>
    <Field>
      <Button>Add</Button>
    </Field>
  </Fragment>
</Columns>
