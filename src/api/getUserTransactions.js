import Config from "../config";

export const getUserTransactions = (id_token) => {
  const url = Config.host + "/api/protected/transactions";
  const headers = new Headers();
  headers.append('Authorization', 'bearer ' + id_token);

  const requiestInit = {
    method: "GET",
    headers: headers,
    mode: "cors"
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
              message = `getUserTransactions failed with status ${response.status}`;
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
