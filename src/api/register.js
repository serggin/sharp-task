import Config from "../config";

export const register = ({username, email, password}) => {
  const url = Config.host + "/users";
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const data = JSON.stringify({username, email, password});

  const requiestInit = {
    method: "POST",
    headers: headers,
    mode: "cors",
    body: data
  };

  const request = new Request( url, requiestInit );

  return fetch(request)
    .then(response => {
      if (response.ok) {
        const data = response.json()
        return data;
      } else {
        let message;
        if (response.status === 400) {
          message = `A user with email "${email}" is already registered!`;
        } else {
          message = `Login failed with status ${response.status}`;
        }
        return { message };
      }
    })
    .catch(error => {
      console.error('At api register fetch(): ',error);
      return {message: error};
    });
}