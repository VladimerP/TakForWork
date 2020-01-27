let map;
let requestURL1 = "http://api.open-notify.org/iss-now.json";
let requestURL2 = "http://api.open-notify.org/astros.json";
let request = new XMLHttpRequest();
let request2 = new XMLHttpRequest();

window.onload=function(){
    request.open('GET', requestURL1);
    request.responseType = 'json';
    request.send();
    var location, people;
    request.onload = function () {
        location = request.response;
        callMap(location);
        locatedInfo(location);
    }
    timeUTC();
    request2.open('GET', requestURL2);
    request2.responseType = 'json';
    request2.send();
    request2.onload = function (){
        people= request2.response;
        peopleInISS(people);
    }
    let pElement,tDate,liPeople;
    let timer=setInterval(() =>{

        request.open('GET', requestURL1);
        request.responseType = 'json';
        request.send();
        request.onload = function () {
            location = request.response;
            callMap(location);
            if(document.getElementById("new")!=null){
                pElement=document.getElementById("new");
                pElement.remove();
            }
            locatedInfo(location);
        }

        if(document.getElementById("time_UTC")!=null){
            tDate=document.getElementById("time_UTC");
            tDate.remove();
        }
        timeUTC();
        let key=0;
        do{
            if(document.getElementById("astor"+key)!=null){
                liPeople=document.getElementById("astor"+key);
                liPeople.remove()
                key++;
            }
            else {break;}
        }while (true);
        document.getElementById("hrAstor").remove();
        document.getElementById("numberOfPeople").remove();
        request2.open('GET', requestURL2);
        request2.responseType = 'json';
        request2.send();
        request2.onload = function (){
            people= request2.response;
            peopleInISS(people);
        }
    }, 5000);
}

function callMap(locations) {
    var myLatlng = {
        lat: 0,
        lng:0
    };
    myLatlng.lat=parseFloat(locations.iss_position["latitude"]);
    myLatlng.lng=parseFloat(locations.iss_position["longitude"]);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatlng
    });
    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true
    });
}

function locatedInfo(locations) {
    let pElement=document.createElement('p');
    let liLoc=document.getElementById("locationLatLng");
    pElement.className = "marginZero";
    pElement.id="new";
    pElement.innerHTML="latitude:"+locations.iss_position["latitude"]+" longitude:"+locations.iss_position["longitude"];
    liLoc.append(pElement);
}

function timeUTC() {
    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    let date = new Date();
    let timeU = document.createElement('h3');
    let liTime=document.getElementById("currentTimeUTC");
    timeU.className = "marginZero";
    timeU.id="time_UTC";
    timeU.innerHTML="Current Time in UTC:"+ date.getUTCHours()+"."+date.getUTCMinutes()+'<br>'+date.getUTCDate()+" "+month[date.getUTCMonth()]+" "+date.getUTCFullYear();
    liTime.append(timeU);
}

function peopleInISS(man) {
    let people = new Array();
    for (let key in man.people)
        if(man.people[key].craft==="ISS"){
            people[key]=man.people[key].name;
        }
    let ulAstor=document.getElementById("astros");
    let liAstor;
    for(let key in people){
        liAstor=document.createElement('li');
        liAstor.className="astorPeople";
        liAstor.id="astor"+key;
        liAstor.innerText=people[key];
        ulAstor.append(liAstor);
    }
    let hrEl=document.createElement('hr');
    hrEl.id="hrAstor";
    ulAstor.append(hrEl);
    let numElement=document.createElement('span');
    numElement.id="numberOfPeople";
    numElement.innerText="People on ISS: "+man.number;
    ulAstor.append(numElement);
}
