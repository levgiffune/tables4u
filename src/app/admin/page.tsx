'use client'
import React from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import axios from 'axios';
import AdminRestaurant from '@/components/AdminRestaurant';

const instance = axios.create({
  baseURL:'https://92ouj9flzf.execute-api.us-east-2.amazonaws.com/tables4u/'
})

const Admin: React.FC = () => {
  const [restaurants, setRestaurants] = React.useState([]);
  const router = useRouter()

  React.useEffect(() => {
    instance.post("/restaurants", {"credential": document.cookie}).then(function (response){
      const status = response.data.statusCode;
      if (status == 200) {
        if(!response.data.restaurants){
          router.push('/login')
        }else{
          setRestaurants(Object.values(response.data.restaurants))
        }
      }
      else {
        router.push('/login')
      }
    })

  }, [router])
  return(
  <div className='content'>
    <div className="filter">
      <label>Filter</label>
      <label>
        Name: <input type="text" />
      </label>
      <label>
        Date: <input type="text" />
      </label>
      <label>
        Time: <input type="text" />
      </label>
    </div>
    <div className="searchbox">
      {restaurants?.map(({name, open, close, address}) => (
        <AdminRestaurant 
        key={name}
        name={name} 
        open={open}
        close={close}
        address={address}
        />
      ))}
    </div>
  </div>
);}

export default Admin
