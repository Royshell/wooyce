
let uuid;
let sessionId; //seems to be not in use
let savedPhoneNumber;
let savedDidNumber;
let my_client_id;
let callForwardingNumber;
let api_states = {
    logged_in :false,
    registered : false,
    verified: false,
    carrier_ok: false,
    last_call_status:"unknown",
    last_forwading_result:"unknown"
}


const proxyurl = "https://cors-anywhere.herokuapp.com/";

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}



function checkLogin() {
  return api_states.logged_in;
}

function checkRegistered() {
  return api_states.registered;
}

function checkVerified() {
  return api_states.verified;
}

function checkForwarding() {
  return api_states.last_forwading_result;
}

function carrierOk() {
  if(api_states.carrier==="972") {
    return true;
  }

  if(api_states.carrier=="AT&T Wireless") {
    return true;
  }

  if(api_states.carrier=="T-Mobile USA, Inc.") {
    return true;
  }

  if(api_states.carrier=="Verizon Wireless") {
    return true;
  }

  if(api_states.carrier=="Sprint Spectrum, L.P.") {
    return true;
  }
  return false;
}

function getLastCallStatus() {
  return api_states.last_call_status;
}

const login = async() => {
  if(!my_client_id) {
    my_client_id = uuidv4()
  }

  console.log("Connecting with client ID:"+my_client_id); // please avoid using console.log not in error
  const body = {
    app_secret: '49c5593e35e60467ef6316412e59aa420fa5da39',
    client_id: my_client_id // need to modified
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/applogin/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });


    const results = await response.json();
    const { login_key } = results;

    uuid = login_key;

    api_states.logged_in = true;
    
  } catch(err) {
    console.log(err);
  }
}

const registerPhoneNumber = async(phoneNumber) => {
  savedPhoneNumber = phoneNumber || savedPhoneNumber;
  const body = {
    client_id: my_client_id, // need to modified
    login_key: uuid,
    phone: savedPhoneNumber 
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/register/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });
    console.log("Got result:"+results); //avoid using console.log if it isn't an error
    const results = await response.json();
    const { result } = results; // new API
    api_states.registered = true;
    
  } catch(err) {
    console.log(err);

  }
}


const checkCarrier = async(phoneNumber) => {
  if(phoneNumber.startsWith("972")) {
    api_states.carrier = "972";
    return;
  }

  try {
    console.log("Calling textmagic"); //avoid using console.log if it isn't an error

    const response = await fetch(proxyurl+'https://rest.textmagic.com/api/v2/lookups/'+phoneNumber+'?country=US', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
        'X-TM-Username': 'og1',
        'X-TM-Key': 'zdCy92VN2Jez0JqAyFGzbpEz047PSh'
      }
    });

    const results = await response.json();

    console.log("Text magic response:"+response); //avoid using console.log if it isn't an error
    var carrier;
    api_states.carrier = results["carrier"];
  } catch(err) {
    console.log("Error in TM:"+err);
    api_states.carrier = "Unknown";
    console.log(err);
  }
}

function getTemplateForCarrier(carrier) {
  if(carrier==="972") {
    return "*67*XXXXXX#"
  }

  if(carrier=="AT&T Wireless") {
    return "*90XXXXXX#"
  }

  if(carrier=="T-Mobile USA, Inc.") {
    return "*67*XXXXXX#";
  }

  if(carrier=="Verizon Wireless") {
    return "*71XXXXXX#";
  }

  if(carrier=="Sprint Spectrum, L.P.") {
    return "*74XXXXXX#"
  }
  return "Unknown";
}

function getCallForwardingNumber() {
  console.log("gcfn DID number:"+savedDidNumber);
    var template = getTemplateForCarrier(api_states.carrier);
    return template.replace("XXXXXX",savedDidNumber);
}


const sendForwardingNumberAsSMS = async() => {
  var template = getTemplateForCarrier(api_states.carrier)

  const body = {
    client_id: my_client_id, // need to modified
    login_key: uuid,
    phone:savedPhoneNumber,
    template: template
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/sendForwardingNumberAsSMS/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    console.log("Result from forwarding:"+results); //avoid using console.log not in an error
    savedDidNumber = results["did_line"];
    console.log("DID number:"+savedDidNumber);
    if(results!==-1) {
      api_states.sent_contact_number = true;
    }
  } catch(err) {
    console.log(err);
    api_states.sent_contact_number = false;
  }
};


const sendElefendNumberAsSMS = async(pincode) => {
  const body = {
    client_id: my_client_id, // need to modified
    login_key: uuid,
    phone:savedPhoneNumber
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/sendElefendNumberAsSMS/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { result, did_line } = results; // paramas from response
    if(result!=-1) {
      api_states.sent_contact_number = true;
    }
  } catch(err) {
    console.log(err);
    api_states.sent_contact_number = false;
  }
};

const verifyPhoneNumber = async(pincode) => { 
  const body = {
    client_id: my_client_id, // need to modified
    login_key: uuid,
    phone: savedPhoneNumber,
    pincode: pincode
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/validateSMS/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { result, did_line } = results; // paramas from response - did_line doesn't seem to be used
    if(result!=-1) {
      api_states.verified = true;
    }
  } catch(err) {
    console.log(err);
    api_states.verified = false;
  }
};

const verifyBlockedNumber = async() => {
  const body = {
    client_id: my_client_id, // need to modified
    login_key: uuid,
    phone: savedPhoneNumber,
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/verifyBlocking/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { status } = results;
  

  } catch(err) {
    console.log(err);
  }
};

const checkCallResult = async() => { 
  const body = {
    client_id:  my_client_id, // need to modified
    login_key: uuid,
    phone: savedPhoneNumber,
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/checkCallResult/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { status } = results;

    api_states.last_call_status = results["status"];

  } catch(err) {
    api_states.last_call_status = "Unknown"
    console.log(err);
  }
};


const checkForwardingResult = async() => {
  const body = {
    client_id:  my_client_id, // need to modified
    login_key: uuid,
    phone: savedPhoneNumber,
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/checkForwardingResult/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { status } = results;

    api_states.last_forwading_result = results["status"];

  } catch(err) {
    api_states.last_call_status = "Unknown"
    console.log(err);
  }
};

const verifyElefendContact = async() => { 
  const body = {
    client_id: my_client_id, // needs to modified
    login_key: uuid,
    phone: savedPhoneNumber,
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/verifyContact/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { status } = results;

  } catch(err) {
    console.log(err);
  }
};

const verifyCallForwarding = async() => { 
  const body = {
    client_id: my_client_id, // need to modified
    login_key: uuid,
    phone: savedPhoneNumber,
  };
  try {
    const response = await fetch(proxyurl+'https://pbx.elefend.com:8000/api/verifyForwarding/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
      'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const results = await response.json();
    const { status } = results;
  

  } catch(err) {
    console.log(err);
  }
};
String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}







export  { carrierOk, checkCarrier, checkVerified, checkRegistered,checkLogin, login, registerPhoneNumber,
  verifyPhoneNumber, verifyBlockedNumber, checkCallResult, verifyElefendContact, verifyCallForwarding , getLastCallStatus, sendElefendNumberAsSMS, sendForwardingNumberAsSMS, getCallForwardingNumber, checkForwardingResult, checkForwarding};