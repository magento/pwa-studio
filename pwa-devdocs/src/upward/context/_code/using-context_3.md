```yml
body:
  resolver: conditional
  when:
    - matches: request.url.query.shipmentId
      pattern: '\d+'
      use: getShipment
    - matches: request.url.query.shipmentName
      pattern: '\w+'
      use: getShipment
    - matches: request.url.query.shipmentTrackingNumber
      pattern: '[\w\d\.]+'
      use: getShipment
  default:
    inline: 'Please provide a query'
getShipment:
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
        id: request.url.query.shipmentId
        name: request.url.query.shipmentName
        trackingNumber: request.url.query.trackingNumber
```
