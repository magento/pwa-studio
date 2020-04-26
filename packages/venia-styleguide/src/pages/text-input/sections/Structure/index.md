import { Fragment } from "react"
import { Circle } from "react-feather"

import Box from "../../../../components/Box"
import Button from "../../../../components/Button"
import Columns from "../../../../components/Columns"
import Field from "../../../../components/Field"
import TextInput from "../../../../components/TextInput"
import Dimensions from "./Dimensions"
import GridLayout from "./GridLayout"

<Columns>
  <GridLayout />
  <Field label="Name">
    <TextInput after={<Circle />} before={<Circle />} />
  </Field>
</Columns>
<Columns>
  <Dimensions />
  <Fragment>
    <Field label="Quantity">
      <TextInput />
    </Field>
    <Field>
      <Button>Add</Button>
    </Field>
  </Fragment>
</Columns>
