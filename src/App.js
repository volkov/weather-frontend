import React from 'react';
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Chart from 'react-apexcharts'

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
        this.state = {
            diffs: [],
            series: this.getSeries([]),
            options: this.getOptions([]),
        }
    }

    getSeries (data) {
        return [{
            name: 'Temperature',
            data: data
        }
        ];
    }

    getOptions () {
        return {
            chart: {
                type: 'line',
                height: 350,
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            stroke: {
                curve: 'smooth'
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    style: {colors: '#FFFFFF'}
                }
            },
            yaxis: {
                title: {
                    text: 'celsius'
                },
                labels: {
                    style: {colors: '#FFFFFF'}
                }
            },

        };
    }

    render () {
        return (<div>
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type="area" height={350}/>
            </div>

            {this.state.diffs.map(item => {
                let weather = item.weather
                return (
                    <div>
                        <h5>{weather.timestamp} {weather.temperature}</h5>
                    </div>
                );
            })}
        </div>)
    }

    componentDidMount () {
        fetch(`api/${this.id}/diffs`)
            .then(response => response.json())
            .then(values => {
                this.setState(
                    {
                        diffs: values,
                        series: this.getSeries(
                            values.map(
                                item =>
                                    [item.weather.timestamp, item.weather.temperature]
                            )
                        )
                    }
                )
            })
    }
}

export default App;
