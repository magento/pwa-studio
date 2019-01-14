```yml
body:
  resolver: conditional
  when:
    - matches: request.url.query.shipmentId
      pattern: '\d+'
      use:
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
            query:
              resolver: file
              file:
                resolver: inline
                inline: './getShipment.graphql'
            variables:
              id: request.url.query.shipmentId
    - matches: request.url.query.shipmentName
      pattern: '\w+'
      use:
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
            variables:
              name: request.url.query.shipmentName
    - matches: request.url.query.shipmentTrackingNumber
      pattern: '[\w\d\.]+'
      use:
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
            variables:
              trackingNumber: request.url.query.shipmentTrackingNumber
    default:
      inline: 'Please provide a query'
```
