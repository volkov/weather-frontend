import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";

function App () {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Weather</h1>
                <Router>
                    <Switch>
                        <Route path="/:id" component={RenderDiffs}/>
                        <Route path="/">
                            <RenderLocations/>
                        </Route>
                    </Switch>
                </Router>
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

class RenderLocations extends React.Component {

    constructor (props) {
        super(props)
        this.state = {items: ["Loading..."]}
    }

    render () {
        return (<div>
            {this.state.items.map(item => (
                <h2><Link to={`${item}`}>{item}</Link></h2>
            ))}
        </div>)
    }

    componentDidMount () {
        fetch("api/locations")
            .then(response => response.json())
            .then(locations => {
                this.setState({items: locations})
            })
    }
}

class RenderDiffs extends React.Component {

    constructor (props) {
        super(props)
        this.id = props.match.params.id
        this.state = {diffs: []}
    }

    render () {
        return (<div>
            {this.state.diffs.map(item => {
                let weather = item.weather
                return (
                    <div>
                        <h5>{weather.timestamp} {weather.temperature}</h5>
                        <RenderInnerDiffs diffs={item.diffs}/>
                    </div>
                );
            })}
        </div>)
    }

    componentDidMount () {
        fetch(`api/${this.id}/diffs`)
            .then(response => response.json())
            .then(values => {
                this.setState({diffs: values})
            })
    }
}

function RenderInnerDiffs (props) {
    return (<div>
        {props.diffs.map(item =>
                             <div>{item.timeDelta} {item.temperatureDelta}</div>
        )}
    </div>)
}

export default App;
