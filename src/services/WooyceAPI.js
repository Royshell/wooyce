
let token;

const login = async() => {
  const body = {
    "email": "yeye@mm.ll",
    "password": "testtest"
  };
  try {
    console.log('trying...');
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });
    const data = await response.json();
    token = data.token;
  
    console.log(token);
  } catch(err) {
    console.log(err);
  }
};
const sendFile = async(wavFile) => {
  
  const  formdata = new FormData();
  //formdata.append('test', file);
  console.log(wavFile);
  formdata.append('audio', wavFile);


  const headers = new Headers();
  headers.append('Authorization', ` Bearer ${token}`);

  try {
    const response = await fetch('http://localhost:3000/harmonium', {
      method: 'POST',
      body: formdata, 
      headers
    });

    const data = await response.json();
    console.log(data);

  } catch(err) {
    console.log(err);

  }
};
const getGraphData = async() => {

  try {
    console.log('trying...');
    const response = await fetch('http://localhost:3000/harmonium', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('fetched data');
    console.log(data);
    return data;
  } catch(err) {
    console.log(err);
  }
};
const setSession = async(startTime, endTime) => {
  const body = {
    "begin": startTime,
    "end": endTime
  };
  try {
    const response = await fetch('http://localhost:3000/sessions', {
      method: 'POST',
      headers: {
        'Au,thorization': `Bearer ${token}`
      },
      body: JSON.stringify(body) 
    });
    const data = await response.json();
    console.log('fetched data');
    console.log(data);
    return data;
  } catch(err) {
    console.log(err);
  }
};



export  { login, signUp, fake, sendFile, upload, getGraphData, setSession };