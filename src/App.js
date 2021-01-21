import './App.css'
import React, { useEffect, useState } from 'react'
import LineS from './line';
//import Top from './top'
import { makeStyles } from '@material-ui/core/styles';

import { FormControl, MenuItem, Select } from '@material-ui/core'
import styled from 'styled-components'
import axios from 'axios'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// import 'react-dates/initialize';
// import 'react-dates/lib/css/_datepicker.css';
// import {DateRangePicker, SingleDatePicker,DayPickerRangeController} from 'react-dates'
// import {Datepicker, START_DATE} from '@datepicker-react/styled'
// import 'react-calendar/dist/Calendar.css';
// import 'bootsrat/dist/css/bootstrap.min.css'


const Drop = styled.div`
padding-right: 40px;
`

const Tag = styled.label`
font-weight: 600;
`



const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #0059b3 30%, #595959 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    padding: '0 30px',
    outline: 'none',
  },
});




function App() {


  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [CovidSummary, setCovidSummary] = useState({});
  const [countries, setCountries] = useState([]);

  const [coronaCount, setcoronaCount] = useState([]);
  const [Case, setCase] = useState([]);
  
  const [x, setX] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get('https://api.covid19api.com/summary').then(res => {
      setLoading(false);
      if (res.status === 200) {
        setCovidSummary(res.data)
      }


      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }, []);
  const formatDate = (date) => {

    const d = new Date(date);
    const day = d.getDate();
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    return `${year}-${month}-${day}`

  }

  


  const onCountryChange = (e) => {
    setCountries(e.target.value);
    const from = formatDate(startDate);
    const to = formatDate(endDate);
    
    getCoronaReportByRange(e.target.value, from, to)
   
  }

  // const onDateChange = (e)=>{
  //   setfromDays(e.target.value)
  // }

  // const onMonthChange = (e)=>{
  //        setfromMonth(e.target.value)
  // }
  // https://api.covid19api.com/country/south-africa/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
  const getCoronaReportByRange = (countrycode, from, to) => {

    axios.get(`https://api.covid19api.com/country/${countrycode}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`)
      .then(res => {
        console.log(res)
        const yAxisCoronaCount = res.data.map(d => d.Cases);
        
        setcoronaCount(yAxisCoronaCount);
        
        const xAxisCoronaCount = res.data.map(d => d.Date);
        setX(xAxisCoronaCount);
        const coronaount = res.data;
        setCase(coronaount);
      }).catch(error => {
        console.log(error)
      })

  }

  
 

  console.log(Case);
  const classes = useStyles();
  if (loading) {
    return <p>Fetching........</p>
  }

  return (
    <div className="App">
      <div className="Top">
        <div>
          <h1> Covid-19 Tracker</h1>
        </div>

        <div className="country_dropdown">
          <label>Country</label>
          <div className="con_dropdown">
            <Drop>
              <FormControl className="country_dropdown">
                <Select className={classes.root} variant="outlined" onChange={onCountryChange} value={countries}>

                  {
                    CovidSummary.Countries && CovidSummary.Countries.map(country => <MenuItem key={country.Slug} value={country.Slug}> {country.Country} </MenuItem>)
                  }
                </Select>
              </FormControl>
            </Drop>
          </div>
        </div>
        <div className="date">
          <div className="datebr">
            <label>From</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat='yyyy/MM/dd' />
          </div>
          <div className="datevr">
            <label >To</label>
            <div className="to">
              <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat='yyyy/MM/dd' />
            </div>
          </div>
        </div>
      </div>


      <div className="Bottom">

        <LineS yAxis={coronaCount} xAxis={x} />

        <div className="table">

       

        <div className="tab">

        <Tag>Cases</Tag>
        {
          Case.map(s => <p>{s.Cases}</p>)
        }
        </div>
        <div  className="tabr">
          <Tag>Date</Tag>
        {
          Case.map(s => <p style={{width:'100px'}}>{s.Date.toString().slice(0, 10)}</p>)
        }
        </div>
        <div  className="tab">
       
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
