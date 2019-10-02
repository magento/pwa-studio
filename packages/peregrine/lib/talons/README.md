# Peregrine Talons

Peregrine "talons" are hooks that contain component-specific logic.

## Example

The following example shows how a component looks after its logic has been extracted into a talon. Notice how the logic is contained within a single component hook that receives props and returns the necessary render values.

### Before

```js
import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

const MyComponent = props => {
    const { runQuery, queryResult } = useLazyQuery(MY_QUERY);
    const { data, error, loading } = queryResult;

    if (error) {
        message = 'An error occurred while fetching results.';
    } else if (loading) {
        message = 'Fetching results...';
    } else if (!data.items) {
        message = 'No results were found.';
    } else {
        message = `${data.items.length} items`;
    }

    useEffect(() => {
      runQuery();
    }, [runQuery, setLoading]);

    return (
        <div>
            <div>{message}</div>
            <div>{data ? data.items : 'No data'}</div>
        </div>
    );
};
```

### After

```js
import React from 'react';
import { useMyComponent } from '@magento/peregrine/lib/talons/MyComponent';

const MyComponent = props => {
    const { data, message } = useMyComponent(props);

    return (
        <div>
            <div>{message}</div>
            <div>{data ? data.items : 'No data'}</div>
        </div>
    );
};
```
