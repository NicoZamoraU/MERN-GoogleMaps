import React, { Component } from 'react';

class App extends Component {

    constructor(){
        super();
    }

    getTasks(e){
        fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            this.setState({tasks: data});
            console.log(this.state.tasks);
        });
    }
    getTask(name, coords) {
        console.log(name, coords);
    }
    addTask(e) {
        fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
        e.preventDefault();
    }

    render() {
        const list = this.state.tasks.map(tasks => {
            return (
                <a key={tasks._id} href="#" onClick={() => this.getTask(tasks.name,tasks.coords)}>
                    <li  className="nav-item">{tasks.name}</li>
                </a>
            )
        })

        return(
            <div className="m-0">
                <div className="row">
                    <div className="bg-light sidebar">
                        <div className="sidebar-sticky">
                            <div className="container">
                                <h1 className="text-dark text-center">Favorite Places</h1>
                            </div>
                            <ul className="nav flex-column">
                                { list }
                            </ul>
                        </div>
                    </div>
                    <div className="contMap">
                        {/* <GoogleMapsContainer /> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;