import 'leaflet'

declare module 'leaflet' {
  namespace Routing {
    class Control {
      constructor(options?: any)
      addTo(map: L.Map): this
    }

    function control(options?: any): Control
    function plan(waypoints: L.LatLng[], options?: any): any
  }
}
