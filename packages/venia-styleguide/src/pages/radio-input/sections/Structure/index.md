import Columns from "../../../../components/Columns"
import Field from "../../../../components/Field"
import RadioInput from "../../../../components/RadioInput"

<Columns>
  <div />
  <Field label="Size">
    <div style={{ display: "grid", gap: 6 }}>
      <RadioInput name="size" value="S">Small</RadioInput>
      <RadioInput name="size" value="M">Medium</RadioInput>
      <RadioInput name="size" value="L">Large</RadioInput>
    </div>
  </Field>
</Columns>
