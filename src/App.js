import React from 'react';
import {BrowserRouter as Router, Link as ReactLink, Route, Switch} from "react-router-dom";
import Chart from 'react-apexcharts'

import {Box, ChakraProvider, CSSReset, Grid, Link} from '@chakra-ui/core';

import theme from '@chakra-ui/theme';
import Header from './header';

function App () {
    return (

        <Router>
            <ChakraProvider theme={theme}>
                <CSSReset/>
                <Header/>
                <Box textAlign="center" fontSize="xl">
                    <Grid
                        minH="100vh"
                        p={3}
                        direction="column"
                        align="center"
                        justify="center"
                    >


                        <div className="App">
                            <header className="App-header">
                                <Switch>
                                    <Route path="/:id" component={RenderDiffs}/>
                                    <Route path="/">
                                        <RenderLocations/>
                                    </Route>
                                </Switch>
                            </header>
                        </div>
                    </Grid>
                </Box>
            </ChakraProvider>
        </Router>

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
                <h1><Link to={`${item.id}`} color="teal.500" as={ReactLink}>{item.name}</Link></h1>
            ))}
        </div>)
    }

    componentDidMount () {
        fetch("api/locations")
            .then(response => response.json())
            .then(locations => {
                this.setState({items: locations})
            })
        document.title = "Weather: locations"
    }
}

class RenderDiffs extends React.Component {

    constructor (props) {
        super(props)
        this.id = props.match.params.id
        this.state = {
            location: "Loading...",
            diffs: [],
            temperatureSeries: this.getSeries([], [], [], 'Temperature'),
            rainSeries: this.getSeries([], [], [], 'Rain'),
            temperatureOptions: this.getOptions(),
            rainOptions: this.getOptions("mm in 3h")
        }
    }

    getSeries (data, forecast, forecast3, name = 'Temperature') {
        return [
            {
                name: name,
                data: data
            },
            {
                name: 'Forecast 1d',
                data: forecast
            },
            {
                name: 'Forecast 3d',
                data: forecast3
            }

        ];
    }

    getOptions (yTitle = 'celsius') {
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
                },
                animations: { enabled: false}
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
                    text: yTitle
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
        return (
            <>
                <h1>{this.state.location}</h1>
                <div>
                    <div id="chart">

                        <Chart options={this.state.temperatureOptions} series={this.state.temperatureSeries} type="area" height={350}/>
                        <Chart options={this.state.rainOptions} series={this.state.rainSeries} type="area" height={350}/>
                    </div>
                </div>
            </>
        )
    }

    componentDidMount () {
        let real = fetch(`api/${this.id}/forecast`)
            .then(response => response.json())
        let forecast = fetch(`api/${this.id}/forecast?duration=P1D`)
            .then(response => response.json())
        let forecast3 = fetch(`api/${this.id}/forecast?duration=P3D`)
            .then(response => response.json())

        Promise.all([real, forecast, forecast3])
            .then(([real, forecast, forecast3]) => {
                this.setState(
                    {
                        temperatureSeries: this.getSeries(real.map(
                            weather =>
                                [weather.timestamp, weather.temperature]
                        ), forecast.map(
                            weather =>
                                [weather.timestamp, weather.temperature]
                        ), forecast3.map(
                            weather =>
                                [weather.timestamp, weather.temperature]
                        ), 'Temperature'),
                        rainSeries: this.getSeries(real.map(
                            weather =>
                                [weather.timestamp, weather.rain]
                        ), forecast.map(
                            weather =>
                                [weather.timestamp, weather.rain]
                        ), forecast3.map(
                            weather =>
                                [weather.timestamp, weather.rain]
                        ), 'Rain')

                    }
                )
            })

        fetch(`api/location/${this.id}`).then(response => response.json()).then(location => {
            this.setState({location: location.name});
            document.title = "Weather: " + location.name
        })
    }
}

export default App;
