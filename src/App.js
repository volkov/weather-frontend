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
            series: this.getSeries([], []),
            options: this.getOptions([]),
        }
    }

    getSeries (data, forecast) {
        return [{
            name: 'Temperature',
            data: data
        },
            {
                name: 'Forecast',
                data: forecast
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
            tooltip: {
                theme: 'dark'
            }

        };
    }

    render () {
        return (<div>
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type="area" height={350}/>
            </div>
        </div>)
    }

    componentDidMount () {
        let real = fetch(`api/${this.id}/forecast`)
            .then(response => response.json())
        let forecast = fetch(`api/${this.id}/forecast?duration=P1D`)
            .then(response => response.json())

        Promise.all([real, forecast])
            .then(([real, forecast]) => {
                this.setState(
                    {
                        series: this.getSeries(
                            real.map(
                                weather =>
                                    [weather.timestamp, weather.temperature]
                            ),
                            forecast.map(
                                weather =>
                                    [weather.timestamp, weather.temperature]
                            )
                        )
                    }
                )
            })
    }
}

export default App;
