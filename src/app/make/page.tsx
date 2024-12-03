'use client'
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, Suspense } from 'react';

const instance = axios.create({
  baseURL:'https://92ouj9flzf.execute-api.us-east-2.amazonaws.com/tables4u/'
})

function packageDate(date: string, time: string){
  const split = date.split('/')
  const result = {
    time: parseInt(time, 10),
    day: parseInt(split[1], 10),
    month: parseInt(split[0], 10),
    year: parseInt(split[2], 10)
  }

  return result
}

const MakeSuspended: React.FC = () => {
  const params = useSearchParams()
  const router = useRouter()
  const [err, setErr] = React.useState('');
  
  const reserve = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = document.getElementById("email") as HTMLInputElement;
    const seats = document.getElementById("seats") as HTMLInputElement;
    const dateRaw = document.getElementById("date") as HTMLInputElement;
    const time = document.getElementById("time") as HTMLInputElement;

    instance.post('/reserve', {"email":email.value, "date":packageDate(dateRaw.value, time.value), "seats":parseInt(seats.value), "username":params.get('rest')}).then((result) => {
      const statusCode = result.data.statusCode
      if(statusCode == 200){
        router.push('/find/?email='+email.value+'&code='+result.data.code)
      }else{
        setErr('failed to create reservation')
      }
    });
  }

  return(
    <div className='content'>
        <form onSubmit={reserve}>
          <div className="findbox">
            <h3>Make Reservation</h3>
            <label>
              Email: <input type="email" id='email'/>
            </label>
            <label>
              Date: <input type="text" id='date'/>
            </label>
            <label>
              Time: <input type="text" id='time'/>
            </label>
            <label>
              Number of Guests: <input type="number" id='seats'/>
            </label>
            <button type='submit'>Reserve</button>
          </div>
          <label className="error">{err}</label>
        </form>
    </div>
  );
}

const Make: React.FC = () => (
  <Suspense>
    <MakeSuspended />
  </Suspense>
)

export default Make;
