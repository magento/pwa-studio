```yml
body:
  resolver: conditional
  when:
    - matches: gqlVariables
      pattern: null
      use:
        inline: 'Please provide a query'
  default:
    resolver: template
    engine: mustache
    template:
      resolver: file
      file:
        resolver: inline
          inline: './renderShipment.mst'
    provide:
      shipment:
        resolver: service
        url: env.SHIPMENTS_SVC
        query:
          resolver: file
          file:
            resolver: inline
              inline: './getShipment.graphql'
        variables: gqlVariables
gqlVariables:
  resolver: conditional
  when:
    - matches: request.url.query.shipmentId
      pattern: '\d+'
      use:
        resolver: inline
        inline:
          id: request.url.query.shipmentId
    - matches: request.url.query.shipmentName
      pattern: '\w+'
      use:
        resolver: inline
        inline:
          name: request.url.query.shipmentName
    - matches: request.url.query.shipmentTrackingNumber
      pattern: '[\w\d\.]+'
      use:
        resolver: inline
        inline:
          trackingNumber: request.url.query.trackingNumber
  default: null
```
