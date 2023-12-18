import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 200 }, // simulate ramp-up of traffic from 1 to 200 users over 10s.
    { duration: '30s', target: 200 }, // stay at 200 users for 30 seconds
    { duration: '10s', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'checks{myTag:status200less1500}': ['rate>0.9999'],
  },
};

const BASE_URL = 'http://localhost:5000';

export default () => {
    let urls = [
        ['GET', `${BASE_URL}/health_check`, null],
        //['GET', `${BASE_URL}/long_duration`, null],
        ['GET', `${BASE_URL}/short_duration`, null],
    ]

    const responses = http.batch(urls);
    for (let i = 0; i < responses.length; i++) {
        check( 
            responses[i], {
                'status was 200': (res) => res.status === 200,
            },
            { myTag: 'status200less1500' }
        );
    }
    sleep(1);
};
