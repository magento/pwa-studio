import Button from "../../../../components/Button"
import Columns from "../../../../components/Columns"
import ExampleGroup from "../../../../components/ExampleGroup"
import FlexibleWidth from "./FlexibleWidth"
import MinimumWidth from "./MinimumWidth"
import TextOverflow from "./TextOverflow"

<Columns reverse>
  <FlexibleWidth />
  <ExampleGroup>
    <Button priority="high">Send</Button>
    <Button>Create Account</Button>
  </ExampleGroup>
</Columns>
<Columns reverse>
  <MinimumWidth />
  <ExampleGroup>
    <Button priority="high">Go</Button>
    <Button>Return</Button>
  </ExampleGroup>
</Columns>
<Columns reverse>
  <TextOverflow />
  <ExampleGroup>
    <Button>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis euismod nisi</Button>
  </ExampleGroup>
</Columns>
