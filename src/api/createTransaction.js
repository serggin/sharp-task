//createTransaction
import Config from "../config";

export const createTransaction = (id_token, name, amount) => {
  const url = Config.host + "/api/protected/transactions";
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'bearer ' + id_token);
  const data = JSON.stringify({name, amount});

  const requiestInit = {
    method: "POST",
    headers: headers,
    mode: "cors",
    body: data
  };

  const request = new Request( url, requiestInit );

  return fetch(request)
    .then(response => {
      console.log("createTransaction() response=", response)
      if (response.ok) {
        return response.json()
          .then(data => {
            console.log('====== createTransaction response data=', data);
            return {data};
          })

      } else {
        const message = `createTransaction failed with status ${response.status}`;
        return { message };

      }
    });

}