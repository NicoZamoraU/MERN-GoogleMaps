import React, { Component } from 'react';
const { compose, withProps, lifecycle } = require("recompose");
import {withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { withPropsOnChange } from 'recompose';
import { construct } from '../../node_modules/react-google-maps/lib/utils/MapChildHelper';
import possibleConstructorReturn from '../../node_modules/babel-runtime/helpers/possibleConstructorReturn';

// const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

class App extends Component {

    constructor(){
        super();
        this.state = {
            id: '',
            name: '',
            markerName: 'Santiago, Chile',
            coords: '',
            markerCoords: { lat: -33.4378305, long: -70.65044920000003 },
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
    showMarker(name, lat, lng){
        let v = {name: name, coords: {lat: lat, long: lng}};
        this.setState({markerName:name,markerCoords:v.coords});
    }
    showAndAddTask(name, lat, lng) {
        let v = {name: name, coords: {lat: lat, long: lng}};
        this.setState({markerName:name,markerCoords:v.coords});
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
        if(confirm('¿Estás seguro de eliminarlo?')){
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
    }

    editTask(id, name, coords){
        fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify({name: name,coords:coords}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => console.log(data));
        this.getTasks();
    }

    settingPlace(markerName, markerCoords){
        this.setState({markerCoords});
        console.log(markerCoords)
        this.setState({markerName})
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
                    width: `90%`,
                    height: `32px`,
                    padding: `0 12px`,
                    margin: `0 8px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                  }}
                />
              </StandaloneSearchBox>
                {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
                <ul key={place_id} className="contFav flex-column px-2">
                    <div id="fav" className="row align-items-center pr-3">
                        <div className="col nav-item text-center" >
                            {formatted_address}
                        </div>
                        {/* <button onClick={() => this.showMarker(formatted_address, location.lat(), location.lng())} className="btn btn-info"><i className="fa fa-search"></i></button> */}
                        <button onClick={() => this.showAndAddTask(formatted_address, location.lat(), location.lng())} className="col btn btn-primary">
                                <i className="fa fa-star"></i>
                            </button>
                    </div>
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
                    <button onClick={() => {this.setState({id:tasks._id,name:tasks.name, coords:tasks.coords})}} className="btn btn-info mr-1" data-toggle="modal" data-target="#editModal"><i className="fa fa-pen"></i></button>
                    <button onClick={() => { this.deleteTask(tasks._id) }} className="col btn btn-danger"><i className="fa fa-trash"></i></button>
                    
                    {/* Modal Here */}
                    
                    

                </div>
            )
        })

        const MyMapComponent = withScriptjs(withGoogleMap((props) =>

            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: -33.4378305, lng: -70.65044920000003 }}
                center={{ lat: this.state.markerCoords.lat, lng: this.state.markerCoords.long }}
            >
            <Marker
                title={this.state.markerName}
                position={{ lat: this.state.markerCoords.lat, lng: this.state.markerCoords.long }}
            />
            </GoogleMap>
        ))

        return(
            <div className="m-0">
                {/* Edit Modal */}
                <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <input id="inputEdit" className="form-control" type="text" placeholder={this.state.name} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button onClick={ () => { this.editTask(this.state.id, document.getElementById("inputEdit").value,this.state.coords) }} type="button" className="btn btn-primary" data-dismiss="modal">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add Modal */}
                <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="addModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <input id="inputAdd" className="form-control" type="text" placeholder={this.state.name} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button onClick={ () => { this.addTask(this.state.id, document.getElementById("inputAdd").value,this.state.coords) }} type="button" className="btn btn-primary" data-dismiss="modal">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="bg-light sidebar">
                        <div className="container">
                            <h1 className="text-dark text-center">Favorite Places</h1>
                        </div>
                            <PlacesWithStandaloneSearchBox />
                        <div className="sidebarIn">
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
