import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from 'react';
import { Header, Message,Button } from 'semantic-ui-react';
import { LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import DatePicker from "react-datepicker";

const StartingPageContent = () => {
    const [activities, setActivities] = useState(null);
    const [activitiesFetchFailed, setActivitiesFetchFailed] = useState(false);
    const datePrevMonth = new Date().setMonth(new Date().getMonth() - 1);
    const [startDate, setStartDate] = useState(new Date(datePrevMonth));
    const [endDate, setEndDate] = useState(new Date());
    const [isConnectedToStrava, setIsConnectedToStrava] = useState(false);
    const [isAuthorizedToStrava, setIsAuthorizedToStrava] = useState(false);

    const startDatePicker = <DatePicker selected={startDate} onChange={(date) => {
        setStartDate(date);
        console.log('startDate=' + date);
    }} />
    const endDatePicker = <DatePicker selected={endDate} onChange={(date) => {
        setEndDate(date);
        console.log('endDate=' + date);
    }} />

    const datePicker = <div>
        Start Date {activities && startDatePicker}
        End Date {activities && endDatePicker}
    </div>

    const domain = ['auto', 'auto'];

    const renderLineChart = (
        // <ResponsiveContainer width="50%" height="50%">
            <LineChart width={800} height={600} data={activities}>
                <Line type="monotone" dataKey="heartRate" stroke="#8884d8" />
                <Line type="monotone" dataKey="weight" stroke="#ff000f" />
                <Line type="monotone" dataKey="elevationGain" stroke="#204b71" />
                <Line type="monotone" dataKey="averageSpeed" stroke="#584194" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="startDateLocal" reversed="true"/>
                <YAxis domain={domain} />
                <Tooltip />
                <Legend />
            </LineChart>
        // </ResponsiveContainer>
    );

    const navigateToStravaAuth = () => {
        let url = 'https://www.strava.com/oauth/authorize?client_id=54157&response_type=code&redirect_uri=http://localhost:3000/oauth/callback&approval_prompt=auto&scope=read,read_all,profile:read_all,activity:read,activity:read_all&state=private';
        console.log('authorizing to Strava, redirecting to url=' + url);
        window.location.assign(url);
    };

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
            fetch('http://localhost:8080/api/v1/activities' +
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
      <div style={{align: 'center'}}>
          <Header as="h1">My Activities</Header>

          {!isConnectedToStrava && <Button onClick={navigateToStravaAuth}>Connect To Strava</Button> }

          {activitiesFetchFailed && <Message error header="Failed to fetch activities." />}

          {!activities && !activitiesFetchFailed && isAuthorizedToStrava && <p>Charting your activity data..</p>}

          {activities && datePicker}

          {activities && renderLineChart}
      </div>
  );
};

export default StartingPageContent;
