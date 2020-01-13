import Columns from '../../../../components/Columns';
import ExampleGroup from '../../../../components/ExampleGroup';

import SingleButtonLayout from './SingleButtonLayout.md';
import TwoButtonLayout from './TwoButtonLayout.md';
import FormButtonsLayout from './FormButtonsLayout.md';

import DrawerFooter from '../../../../components/DrawerFooter/DrawerFooter';
import Button from '../../../../components/Button';

<Columns reverse>
    <SingleButtonLayout />
    <ExampleGroup>
        <DrawerFooter>
            <Button priority="high">Sign In</Button>
        </DrawerFooter>
    </ExampleGroup>
</Columns>

<Columns reverse>
    <TwoButtonLayout />
    <ExampleGroup>
        <DrawerFooter>
            <Button priority="normal">Back</Button>
            <Button priority="normal">Next</Button>
        </DrawerFooter>
    </ExampleGroup>
</Columns>

<Columns reverse>
    <FormButtonsLayout />
    <ExampleGroup>
        <DrawerFooter>
            <Button priority="normal">Cancel</Button>
            <Button priority="high">Submit</Button>
        </DrawerFooter>
    </ExampleGroup>
</Columns>
