let KEY = 'yl4CDdH0iMFimD8J4g6d';

function login() {
  const email = document.getElementById('log_email').value;
  const pass = document.getElementById('log_pass').value;

  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      console.log(req.status, JSON.parse(req.responseText));
      if (req.status == 200) {
        KEY = JSON.parse(req.responseText).apikey;
      }
    }
  };

  req.open('POST', 'http://localhost:8000/users/login', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify({ email: email, password: pass }));
}

function register() {
  const email = document.getElementById('reg_email').value;
  const pass = document.getElementById('reg_pass').value;
  const fname = document.getElementById('reg_fname').value;
  const lname = document.getElementById('reg_lname').value;

  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      console.log(req.status, JSON.parse(req.responseText));
      if (req.status == 200) {
        KEY = JSON.parse(req.responseText).apikey;
      }
    }
  };

  req.open('POST', 'http://localhost:8000/users/register', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify({ email: email, password: pass, confirmPassword: pass, name: fname, surname: lname }));
}

function logout() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      console.log(req.status, JSON.parse(req.responseText));
    }
  };

  req.open('POST', 'http://localhost:8000/users/logout', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify({ apikey: KEY }));
}

function getData() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      console.log(req.status, JSON.parse(req.responseText));
    }
  };

  req.open('POST', 'http://localhost:8000/datasource/list', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(
      JSON.stringify({
        apikey: KEY,
      })
  );
}
function getJSON() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      let jsonData = req.responseText;
      let contentType = req.getResponseHeader("content-type")
      console.log(req.status, JSON.parse(req.responseText));
      download(jsonData, "test.json", contentType);
    }
  };

  req.open('POST', 'http://localhost:8000/export/json', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(
      JSON.stringify({
        fileName : "test.json",
        config : { name: "Elna", surname: "Pist"}
      })
  );
}
function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function getCSV() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      let csv = req.responseText;
      console.log(req.status, csv);
      download(csv, "test.csv", "text/csv");
    }
  };

  req.open('POST', 'http://localhost:8000/export/csv', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(
      JSON.stringify({
        "config" :
            [
              {
                "location" : "123 Road Dr",
                "city_state" : "MyCity ST",
                "phone" : "555-555-5555",
                "distance" : "1"
              },
              {
                "location" : "456 Avenue Crt",
                "city_state" : "MyTown AL",
                "phone" : "555-867-5309",
                "distance" : "0"
              }
            ]
      })
  );
}

