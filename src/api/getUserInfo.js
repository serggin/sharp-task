import Config from "../config";

export const getUserInfo = (id_token) => {
  const url = Config.host + "/api/protected/user-info";
  const headers = new Headers();
  headers.append('Authorization', 'bearer '+id_token);

  const requiestInit = {
    method: "GET",
    headers: headers,
    mode: "cors"
  };

  const request = new Request( url, requiestInit );

  return fetch(request)
    .then(response => {
      if (response.ok) {
        return response.json()
          .then(data => {
            return data.user_info_token;
          })
      } else {
        let message;
        if (response.status === 401) {
          message = "Unauthorized Error";
        } else {
          message = `getUserInfo failed with status ${response.status}`;
        }
        return { message };
      }

    })
    .catch(error => {
      console.error('in api getUserInfo fetch(): ',error);
      return {message: error};
    });

};
