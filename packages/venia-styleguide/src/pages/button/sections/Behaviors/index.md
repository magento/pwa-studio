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
    <Button priority="normal">Create Account</Button>
  </ExampleGroup>
</Columns>
<Columns reverse>
  <MinimumWidth />
  <ExampleGroup>
    <Button priority="normal">View More</Button>
    <Button priority="low">Return</Button>
  </ExampleGroup>
</Columns>
<Columns reverse>
  <TextOverflow />
  <ExampleGroup>
    <Button>Lorem ipsum dolor sit amet quis euismod nisi consectetur</Button>
  </ExampleGroup>
</Columns>
