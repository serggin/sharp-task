import Config from "../config";

export const getUsersList = (id_token, filter) => {
  const url = Config.host + "/api/protected/users/list";
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'bearer ' + id_token);
  const data = JSON.stringify({filter});

  const requiestInit = {
    method: "POST",
    headers: headers,
    mode: "cors",
    body: data
  };

  const request = new Request(url, requiestInit);

  const DELAY = 1000; //for demo only!

  return wait(DELAY)
    .then(() => {
      return fetch(request)
        .then(response => {
          if (response.ok) {
            return response.json()
              .then(data => {
                return {data};
              })
          } else {
            let message;
            if (response.status === 401) {
              return response.text()
                .then(text => {
                  return {message: text};
                })
            } else {
              message = `getUsersList failed with status ${response.status}`;
              return { message };
            }
          }
        })
    })
}

function wait(time) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), time);
  });
}
