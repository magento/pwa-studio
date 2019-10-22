import configAggregator from '../configAggregator';

test('map config aggregator retrieves height', () => {
    const node = document.createElement('div');

    node.innerHTML = `<div data-content-type="map" data-appearance="default" data-show-controls="false" data-locations="[]" data-element="main" style="border-style: dotted; border-color: rgb(252, 0, 9); border-width: 12px; border-radius: 0px; margin: 0px; padding: 0px; height: 800px;"></div>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            height: '800px'
        })
    );
});

test('map config aggregator retrieves locations', () => {
    const node = document.createElement('div');

    node.innerHTML = `<div data-content-type="map" data-appearance="default" data-show-controls="false" data-locations="[{&quot;location_name&quot;:&quot;Magento&quot;,&quot;position&quot;:{&quot;latitude&quot;:29.815454410258265,&quot;longitude&quot;:-97.99853212890628},&quot;phone&quot;:&quot;911&quot;,&quot;address&quot;:&quot;1234 Here Dr #150&quot;,&quot;city&quot;:&quot;Austin&quot;,&quot;state&quot;:&quot;Texas&quot;,&quot;zipcode&quot;:&quot;12345-1234&quot;,&quot;comment&quot;:&quot;Comment Time!&quot;,&quot;country&quot;:&quot;United States&quot;,&quot;record_id&quot;:0,&quot;initialize&quot;:true},{&quot;location_name&quot;:&quot;Magento Kyiv&quot;,&quot;position&quot;:{&quot;latitude&quot;:50.4501,&quot;longitude&quot;:30.5234},&quot;phone&quot;:&quot;&quot;,&quot;address&quot;:&quot;&quot;,&quot;city&quot;:&quot;Kyiv&quot;,&quot;state&quot;:&quot;&quot;,&quot;zipcode&quot;:&quot;&quot;,&quot;comment&quot;:&quot;&quot;,&quot;country&quot;:&quot;Ukraine&quot;,&quot;record_id&quot;:1,&quot;initialize&quot;:true}]" data-element="main" style="border-style: dotted; border-color: rgb(252, 0, 9); border-width: 12px; border-radius: 0px; margin: 0px; padding: 0px;"></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig.locations.length).toEqual(2);

    expect(aggregatedConfig.locations[0]).toEqual(
        expect.objectContaining({
            address: '1234 Here Dr #150',
            city: 'Austin',
            comment: 'Comment Time!',
            country: 'United States',
            name: 'Magento',
            phone: '911',
            state: 'Texas',
            zipcode: '12345-1234'
        })
    );

    expect(Object.keys(aggregatedConfig.locations[0].position).sort()).toEqual(
        expect.arrayContaining(['latitude', 'longitude'])
    );

    expect(aggregatedConfig.locations[1]).toEqual(
        expect.objectContaining({
            address: '',
            city: 'Kyiv',
            name: 'Magento Kyiv',
            comment: '',
            phone: '',
            state: '',
            zipcode: ''
        })
    );

    expect(Object.keys(aggregatedConfig.locations[1].position).sort()).toEqual(
        expect.arrayContaining(['latitude', 'longitude'])
    );
});

test('map config aggregator retrieves mapOptions', () => {
    const node = document.createElement('div');

    node.innerHTML = `<div data-content-type="map" data-appearance="default" data-show-controls="false" data-locations="[]" data-element="main" style="border-style: dotted; border-color: rgb(252, 0, 9); border-width: 12px; border-radius: 0px; margin: 0px; padding: 0px;"></div>`;

    let aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig.mapOptions.disableDefaultUI).toBe(true);
    expect(aggregatedConfig.mapOptions.mapTypeControl).toBe(false);

    node.childNodes[0].setAttribute('data-show-controls', 'true');

    aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig.mapOptions.disableDefaultUI).toBe(false);
    expect(aggregatedConfig.mapOptions.mapTypeControl).toBe(true);
});
