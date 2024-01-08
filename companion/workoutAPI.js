const baseUrl = "https://swimapp-66ea.restdb.io/rest";
const endpointWorkout = "/workout";
const endpointWorkoutLog = "/workoutlog";

//TODO: What? Not using it... https://github.com/pavelrisenberg/GetThere/blob/4b406a8a9377b7da8b6306b936e2edf988dc44f0/companion/gmaps.js
export function WorkoutAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    this.apiKey = "63de53a13bc6b255ed0c4657";
  }
};

WorkoutAPI.prototype.getWorkout = function(userID) {
  return new Promise(function(resolve, reject) {
    var url = baseUrl+endpointWorkout+"?q="+myUserQuery(userID);
    //console.log("Fetching: " + url);
    fetch(url, {
        headers: { 
          'content-type': 'application/json',
          'x-apikey': "63de53a13bc6b255ed0c4657"
        },
        method: 'GET'
      })
      .then((response) => {
        if (!response.ok) {
          console.error(`Error Getting workout: ${response.status} ${response.statusText}. ${JSON.stringify(response.json())}`);
          //throw new Error(`${response.status} ${response.statusText}. ${JSON.stringify(response.json())}`);
        }
        return response.json();
      })
      .then((json) => {
        //console.log("Succes:", JSON.stringify(json));
        resolve(json);
      }).catch((error) => {
        console.error("Failed: ", JSON.stringify(error));
        //reject(error);
      });
  });
}

function myUserQuery(userID) {
  return JSON.stringify({'user':[{'_id':userID}]});
}

//TODO: If already posted, breaks as 400 Bad request
WorkoutAPI.prototype.setWorkoutLog = function(userID, workoutData) {
  return new Promise(function(resolve, reject) {
    if(workoutData == undefined | workoutData.exercises[0] == undefined) {
      resolve("Error: Data incorrect, could not be synced."); //TODO: throw error
      //console.log("Error: Data incorrect, could not be synced.");
    }
    var url = baseUrl+endpointWorkoutLog;
    let body = {
      startTime: workoutData.exercises[0].startTime,
      user: userID,
      rawLog: workoutData
    }
    //console.log("Sending POST: " + url + ` ${JSON.stringify(body)}`);
    fetch(url, {
        headers: { 
          'content-type': 'application/json',
          'x-apikey': "63de53a13bc6b255ed0c4657"
        },
        method: 'POST',
        body: JSON.stringify(body)
      })
      .then((response) => {
//console.log(`Response: ${response.ok} ${response.status} ${response.statusText} ${response.type} ${response.url}`);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}. ${JSON.stringify(response.json())}`);
        }
        return response.json();
      })      
      .then((json) => {
        console.log(`Success: ${JSON.stringify(json)}`);
        resolve(json);
      })      
      .catch((error) => {
        console.log(`Failed: ${error}`);
        resolve(error);//TODO: Reject and deal with error
      });
  });
}