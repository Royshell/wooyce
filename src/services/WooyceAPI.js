
let token;

const login = async() => {
  const body = {
    email: 'aare@bb.cc',
    password: 'fdsftrhgtrh'
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

  var file = new File(["foo"], "foo.txt", {
    type: "text/plain",
  }); 

  
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

    return data;
  } catch(err) {
    console.log(err);
  }
};


/* tests */
function upload(wavFile) {
  let formData = new FormData();

//formdata.set('audio',  wavFile, wavFile.name);
formData.append('audio',wavFile);

  var req = new XMLHttpRequest();
  
  req.open("POST", 'http://localhost:3000/harmonium');
  req.setRequestHeader('Authorization', `Bearer ${token}`);
  req.onload = function(event) { alert(event.target.responseText); };
  req.send(formData);
}

const fake = async() => {

  try {
    const response = await fetch('http://dummy.restapiexample.com/api/v1/employee/1');
    const t = await response.json();
    console.log(t);
  }  catch(err) {
    console.log(err);
  }
};


export  { login, signUp, fake, sendFile, upload, getGraphData };