import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";

function App () {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Weather</h1>
                <Router>
                    <Switch>
                        <Route path="/:id">
                            <Location/>
                        </Route>

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

function Location () {
    let { id } = useParams()
    return (<h2>Not implemented {id}</h2>)
}

class RenderLocations extends React.Component {

    constructor (props) {
        super(props)
        this.state = {items: ["Loading..."]}
    }

    render () {
        return (<div>
            {this.state.items.map(item => (
                <h2><a href={item}>{item}</a></h2>
            ))}
        </div>)
    }

    componentDidMount () {
        fetch("/locations")
            .then(response => response.json())
            .then(locations => {
             this.setState({items : locations})
        })
    }
}


export default App;
