import Button from "../../../../components/Button"
import Columns from "../../../../components/Columns"
import HighPriority from "./HighPriority"
import NormalPriority from "./NormalPriority"
import OptionsTable from "./OptionsTable"

<Columns reverse>
  <HighPriority />
  <div>
    <Button priority="high">
      Action
    </Button>
  </div>
</Columns>
<Columns reverse>
  <NormalPriority />
  <div>
    <Button priority="normal">
      Action
    </Button>
  </div>
</Columns>
<OptionsTable />
