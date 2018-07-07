import React, { Component } from 'react';
const { compose, withProps, lifecycle } = require("recompose");
import {withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { withPropsOnChange } from 'recompose';

// const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

class App extends Component {

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

    render() {

        // SearchBox
        const PlacesWithStandaloneSearchBox = compose(

            withProps({
              googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCxDW9YRoYXB7Qfle4tb8-eKn6PboGuJs8&v=3.exp&libraries=geometry,drawing,places",
              loadingElement: <div style={{ height: `100%` }} />,
              containerElement: <div style={{ height: `400px` }} />,
            }),
            lifecycle({
              componentWillMount() {
                const refs = {}
          
                this.setState({
                  places: [],
                  onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                  },
                  onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    this.setState({
                      places,
                    });
                  },
                })
              },
            }),
            withScriptjs  
          )(props =>
            <div data-standalone-searchbox="">
              <StandaloneSearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                onPlacesChanged={props.onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `92%`,
                    height: `32px`,
                    padding: `0 12px`,
                    margin: `0 6px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                  }}
                />
              </StandaloneSearchBox>
                {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
                <ul key={place_id} className="nav flex-column">
                  <li className="nav-item" >
                    {formatted_address} <button onClick={() => this.addTask(formatted_address, location.lat(), location.lng())} className="btn btn-primary">
                                            <i className="fa fa-star"></i>
                                        </button>
                  </li>
                </ul>
                )}
            </div>
          );
        // END SearchBox

        const list = this.state.tasks.map(tasks => {
            return (
                <div key={tasks._id} className="row align-items-center pr-3">
                    <a className="col" href="#" onClick={() => this.settingPlace(tasks.name,tasks.coords)}>
                        <li  className="nav-item">{tasks.name}</li>
                    </a>
                    <button onClick={() => { this.deleteTask(tasks._id) }} className="col btn btn-danger"><i className="fa fa-trash"></i></button>
                </div>
            )
        })

        const MyMapComponent = withScriptjs(withGoogleMap((props) =>

            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: -33.4378305, lng: -70.65044920000003 }}
                center={{ lat: this.state.coords.lat, lng: this.state.coords.long }}
            >
            <Marker
                title={this.state.name}
                position={{ lat: this.state.coords.lat, lng: this.state.coords.long }}
            />
            </GoogleMap>
        ))

        return(
            <div className="m-0">
                <div className="row">
                    <div className="bg-light sidebar">
                        <div className="sidebar-sticky">
                            <div className="container">
                                <h1 className="text-dark text-center">Favorite Places</h1>
                            </div>
                            <PlacesWithStandaloneSearchBox />
                            <ul className="nav flex-column pl-2 pr-2">
                                { list }
                            </ul>
                        </div>
                    </div>
                    <div className="contMap">
                    <MyMapComponent 
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

export default App;
