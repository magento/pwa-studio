import Columns from "../../../../components/Columns"
import Palette from "../../../../components/Palette"

import Methodology from "./Methodology"
import Usage from "./Usage"
import colors from "./data.yml"

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis euismod nisi. Morbi metus mauris, volutpat ac aliquet eget, laoreet vel tortor. Pellentesque commodo tellus nibh, vitae varius lectus pharetra in.

***

<Palette colors={colors} />
<Columns>
  <Usage />
</Columns>
<Columns>
  <Methodology />
</Columns>
