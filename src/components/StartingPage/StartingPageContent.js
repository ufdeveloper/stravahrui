import classes from './StartingPageContent.module.css';
import React, { useEffect, useContext, useState } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';
import { LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

const StartingPageContent = () => {

    const [activities, setActivities] = useState(null);
    const [activitiesFetchFailed, setActivitiesFetchFailed] = useState(false);

    const domain = ['auto', 'auto'];

    const renderLineChart = (
        // <ResponsiveContainer width="50%" height="50%">
            <LineChart width={600} height={600} data={activities}>
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

    useEffect(() => {
        // Fetch activities
        fetch('http://localhost:8080/api/v1/activities', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
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
    }, []);
  return (
      <div>
          <Header as="h1">
              <Icon name="credit card outline" />
              My Activities
          </Header>
          {activitiesFetchFailed && <Message error header="Failed to fetch activities." />}

          {!activities && !activitiesFetchFailed && <p>Charting your activity data..</p>}

          {renderLineChart}

          {/*{activities*/}
          {/*&& (*/}
          {/*    <div>*/}
          {/*        <Table>*/}
          {/*            <thead>*/}
          {/*            <tr>*/}
          {/*                <th>Activity Id</th>*/}
          {/*                <th>Heart Rate</th>*/}
          {/*                <th>Weight</th>*/}
          {/*            </tr>*/}
          {/*            </thead>*/}
          {/*            <tbody>*/}
          {/*            {activities.map((activity) => (*/}
          {/*                <tr id={activity.id} key={activity.id}>*/}
          {/*                    <td>{activity.id}</td>*/}
          {/*                    <td>{activity.heartRate}</td>*/}
          {/*                    <td>{activity.weight}</td>*/}
          {/*                </tr>*/}
          {/*            ))}*/}
          {/*            </tbody>*/}
          {/*        </Table>*/}
          {/*    </div>*/}
          {/*)}*/}


      </div>
  );
};

export default StartingPageContent;
