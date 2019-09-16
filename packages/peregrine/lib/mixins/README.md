# Peregrine Mixins

Peregrine mixins are hooks that contain component logic.

## Example

The following example shows how a component looks after the logic has migrated. Notice how all logic is contained within a single component hook that takes props and returns the necessary render values.

### Before

```js
import React from 'react';
import { useQuery } from '@magento/peregrine';

const MyComponent = props => {
    const [queryResult, queryApi] = useQuery(MY_QUERY);
    const { data, error, loading } = queryResult;
    const { resetState, runQuery, setLoading } = queryApi;

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
      setLoading(true);
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
import { useMyComponent } from '@magento/peregrine/lib/mixins/useMyComponent';

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
