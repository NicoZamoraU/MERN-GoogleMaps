import React, { Component } from 'react';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

class Maps extends Component {

    constructor(){
        super();
        this.state = {
            name: 'Santiago, Chile',
            coords: { lat: -33.4378305, long: -70.65044920000003 },
            tasks: [],
            places: {},
            defaultCenter: {}
        }
        this.addTask = this.addTask.bind(this);
        this.settingPlace = this.settingPlace.bind(this);
    }
    componentDidMount() {
        this.getTasks();
    }
    getTask(name, coords) {
        console.log(name, coords);
    }
    getTasks(){
        fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            this.setState({tasks: data});
            // console.log(this.state.tasks);
        });
    }
    addTask(name, lat, lng) {
        let v = {name: name, coords: {lat: lat, long: lng}};
        fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(v),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => console.log(err));
        this.getTasks();
    }
    deleteTask(id){
        fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => console.log(data));
        this.getTasks();
    }
    settingPlace(name, coords){
        this.setState({coords});
        console.log(coords)
        this.setState({name})
    }

    render(){
        const MapWithASearchBox = compose(
            withProps({
              googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCxDW9YRoYXB7Qfle4tb8-eKn6PboGuJs8&v=3.exp&libraries=geometry,drawing,places",
              loadingElement: <div style={{ height: `100%` }} />,
              containerElement: <div style={{ height: `100%` }} />,
              mapElement: <div style={{ height: `100%` }} />,
            }),
            lifecycle({
              componentWillMount() {
                const refs = {}
          
                this.setState({
                  bounds: null,
                  center: {
                    lat: 41.9, lng: -87.624
                  },
                  markers: [],
                  onMapMounted: ref => {
                    refs.map = ref;
                  },
                  onBoundsChanged: () => {
                    this.setState({
                      bounds: refs.map.getBounds(),
                      center: refs.map.getCenter(),
                    })
                  },
                  onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                  },
                  onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new google.maps.LatLngBounds();
          
                    places.forEach(place => {
                      if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport)
                      } else {
                        bounds.extend(place.geometry.location)
                      }
                    });
                    const nextMarkers = places.map(place => ({
                      position: place.geometry.location,
                    }));
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          
                    this.setState({
                      center: nextCenter,
                      markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);
                  },
                })
              },
            }),
            withScriptjs,
            withGoogleMap
          )(props =>
            <GoogleMap
              ref={props.onMapMounted}
              defaultZoom={15}
              center={props.center}
              onBoundsChanged={props.onBoundsChanged}
            >
              <SearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Customized your placeholder"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `27px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                  }}
                />
              </SearchBox>
              {props.markers.map((marker, index) =>
                <Marker key={index} position={marker.position} />
              )}
            </GoogleMap>
          );
              const list = this.state.tasks.map(tasks => {
              return (
                  <div key={tasks._id} className="row align-items-center pr-3">
                      <a className="col" href="#" onClick={() => this.settingPlace(tasks.name,tasks.coords)}>
                          <li  className="nav-item">{tasks.name}</li>
                      </a>
                      <button onClick={() => { this.deleteTask(tasks._id) }} className="col btn btn-danger"><i className="fa fa-trash"></i></button>
                  </div>
              )
          });
            return(
                <div className="m-0">
                    <div className="row">
                        <div className="bg-light sidebar">
                            <div className="sidebar-sticky">
                                <div className="container">
                                    <h1 className="text-dark text-center">Favorite Places</h1>
                                </div>
                                {/* <PlacesWithStandaloneSearchBox /> */}
                                <ul className="nav flex-column pl-2 pr-2">
                                    { list }
                                </ul>
                            </div>
                        </div>
                        <div className="contMap">
                        <MapWithASearchBox 
                            isMarkerShown
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxDW9YRoYXB7Qfle4tb8-eKn6PboGuJs8&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `100%` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                        />
                        </div>
                    </div>
                </div>
            )
    }
}
export default Maps;