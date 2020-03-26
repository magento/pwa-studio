import Button from "../../../../components/Button"
import Columns from "../../../../components/Columns"
import ExampleGroup from "../../../../components/ExampleGroup"
import HighPriority from "./HighPriority"
import LowPriority from "./LowPriority"
import NormalPriority from "./NormalPriority"
import OptionsTable from "./OptionsTable"

<Columns reverse>
  <HighPriority />
  <ExampleGroup>
    <Button priority="high">
      Submit
    </Button>
  </ExampleGroup>
</Columns>
<Columns reverse>
  <NormalPriority />
  <ExampleGroup>
    <Button priority="normal">
      Load More
    </Button>
  </ExampleGroup>
</Columns>
<Columns reverse>
  <LowPriority />
  <ExampleGroup>
    <Button priority="low">
      Cancel
    </Button>
  </ExampleGroup>
</Columns>
<OptionsTable />
