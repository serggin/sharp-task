import Config from "../config";

export const login = ({email, password}) => {
  const url = Config.host + "/sessions/create";
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const data = JSON.stringify({email, password});

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
        if (response.status === 401) {
          message = "Invalid email or password";
        } else {
          message = `Login failed with status ${response.status}`;
        }
        return { message };
      }
    })
    .catch(error => {
      console.error('At api login fetch(): ',error);
      return {message: error};
    });
}
