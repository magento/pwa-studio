import { HelpCircle } from "react-feather"

import Columns from "../../../../components/Columns"
import Field from "../../../../components/Field"
import SelectInput from "../../../../components/SelectInput"
import Before from "./Before"
import OptionsTable from "./OptionsTable"

<Columns reverse>
  <Before />
  <Field label="Size">
    <SelectInput before={<HelpCircle />}>
      <option value="S">Small</option>
      <option value="M">Medium</option>
      <option value="L">Large</option>
    </SelectInput>
  </Field>
</Columns>
<OptionsTable />
