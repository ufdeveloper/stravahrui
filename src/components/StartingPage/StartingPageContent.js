import "react-datepicker/dist/react-datepicker.css";
import classes from './StartingPageContent.module.css';
import React, { useEffect, useState } from 'react';
import {Header, Message, Button, Checkbox, Grid, Segment} from 'semantic-ui-react';
import {LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer} from 'recharts';
import DatePicker from "react-datepicker";

const StartingPageContent = () => {
    const [activities, setActivities] = useState(null);
    const [activitiesFetchFailed, setActivitiesFetchFailed] = useState(false);
    const datePrevMonth = new Date().setMonth(new Date().getMonth() - 1);
    const [startDate, setStartDate] = useState(new Date(datePrevMonth));
    const [endDate, setEndDate] = useState(new Date());
    const [isConnectedToStrava, setIsConnectedToStrava] = useState(false);
    const [isAuthorizedToStrava, setIsAuthorizedToStrava] = useState(false);
    const [isHrCheckboxSelected, setIsHrCheckboxSelected] = useState(true);
    const [isPaceCheckboxSelected, setIsPaceCheckboxSelected] = useState(true);
    const [isElevCheckboxSelected, setIsElevCheckboxSelected] = useState(true);
    const [isWeightCheckboxSelected, setIsWeightCheckboxSelected] = useState(true);

    const startDatePicker = <DatePicker selected={startDate} onChange={(date) => {
        setStartDate(date);
        console.log('startDate=' + date);
    }} />
    const endDatePicker = <DatePicker selected={endDate} onChange={(date) => {
        setEndDate(date);
        console.log('endDate=' + date);
    }} />

    const datePicker =
        <div className={classes.gridContainerDateControlsParent}>
            <div className={classes.gridContainerDateControls}>
                <div className={classes.gridChild}>
                    <section>Start Date {activities && startDatePicker}</section>
                </div>
                <div className={classes.gridChild}>
                    <section>End Date {activities && endDatePicker}</section>
                </div>
            </div>
        </div>

    const checkBoxes =
        <div className={classes.gridContainerLineControlsParent}>
            <div className={classes.gridContainerLineControls}>
                <div className={classes.gridChild}>
                    <Checkbox key={'hr'} label={'Heart Rate'} checked={isHrCheckboxSelected}
                          onChange={(e, data) => setIsHrCheckboxSelected(data.checked)}/>
                </div>
                <div className={classes.gridChild}>
                    <Checkbox key={'pace'} label={'Avg. Pace'} checked={isPaceCheckboxSelected}
                          onChange={(e, data) => setIsPaceCheckboxSelected(data.checked)} />
                </div>
                <div className={classes.gridChild}>
                    <Checkbox key={'elevgain'} label={'Elevation Gain'} checked={isElevCheckboxSelected}
                          onChange={(e, data) => setIsElevCheckboxSelected(data.checked)} />
                </div>
                <div className={classes.gridChild}>
                    <Checkbox key={'weight'} label={'Weight'} checked={isWeightCheckboxSelected}
                          onChange={(e, data) => setIsWeightCheckboxSelected(data.checked)} />
                </div>
            </div>
        </div>

    const domain = ['auto', 'auto'];
    const renderLineChart = (
        <ResponsiveContainer width="99%" height="100%">
            <LineChart /*width={800} height={600}*/ data={activities}>
                <Line type="monotone" name="HR" dataKey="heartRate" hide={!isHrCheckboxSelected} dot={false} stroke="#ff000f" />
                <Line type="monotone" dataKey="weight" hide={!isWeightCheckboxSelected} dot={false} stroke="#8884d8" />
                <Line type="monotone" name="elev. gain" dataKey="elevationGain" hide={!isElevCheckboxSelected} dot={false} stroke="#204b71" />
                <Line type="monotone" name="avg. pace" dataKey="averageSpeed" hide={!isPaceCheckboxSelected} dot={false} stroke="#584194" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="startDateString" reversed="true"/>
                <YAxis domain={domain} />
                <Tooltip />
                <Legend />
            </LineChart>
        </ResponsiveContainer>
    );

    const navigateToStravaAuth = () => {
        let url = 'https://www.strava.com/oauth/authorize?client_id=54157&response_type=code&redirect_uri=http://stravahr.com:3000/oauth/callback&approval_prompt=auto&scope=read,read_all,profile:read_all,activity:read,activity:read_all&state=private';
        console.log('authorizing to Strava, redirecting to url=' + url);
        window.location.assign(url);
    };

    const handleCheckboxChange = data => {
        console.log("data = " + data);
    }

    useEffect(() => {
        // token expired, authorize again
        if (!localStorage.getItem('token')) {
            // if (Cookies.get('stravaconnect')) {
            if (localStorage.getItem('connectedToStrava')) {
                console.log('already connected, so go ahead and auth with strava');
                // so that we don't show the Connect button
                setIsConnectedToStrava(true);
                navigateToStravaAuth();
                return;
            }
        } else {
            // we already have the token, so go ahead and fetch activities
            setIsConnectedToStrava(true);
            setIsAuthorizedToStrava(true);

            // Fetch activities
            console.log("fromDate=" + startDate.toISOString() + ", toDate=" + endDate.toISOString());
            // fetch('http://localhost:8080/api/v1/activities' +
            fetch('http://api.stravahr.com:8080/api/v1/activities' +
                '?fromDate=' + startDate.toISOString() +
                '&toDate=' + endDate.toISOString() +
                '&activityType=Run', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'include',
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        return res.json().then((data) => {
                            let errorMessage = 'Failed to fetch token';
                            // if (data && data.error && data.error.message) {
                            //   errorMessage = data.error.message;
                            // }
                            console.log('Failed to fetch activities, error = ' + data);
                            setActivitiesFetchFailed(true);
                            throw new Error(errorMessage);
                        });
                    }
                })
                .then((data) => {
                    console.log('activities =' + JSON.stringify(data));
                    setActivities(data);
                    setActivitiesFetchFailed(false);
                })
                .catch((err) => {
                    console.log('Failed to fetch activities, error = ' + err);
                    setActivitiesFetchFailed(true);
                    alert(err.message);
                });
        }
    }, [startDate, endDate]);


  return (
      <div className={classes.starting}>
          <Header as="h2">Trends</Header>

          {!isConnectedToStrava && <Button onClick={navigateToStravaAuth}>Connect To Strava</Button> }

          {activitiesFetchFailed && <Message error header="Failed to fetch activities." />}

          {!activities && !activitiesFetchFailed && isAuthorizedToStrava && <p>Charting your activity data..</p>}

          {activities && datePicker}

          {activities && checkBoxes}

          {activities && renderLineChart}
      </div>
  );
};

export default StartingPageContent;
