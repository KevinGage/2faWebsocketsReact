# 2faWebsocketsReact
This is a POC project for implementing http 2fa using totp, and jwt authentication with socketio
This is not production ready code.  See notes below

# Summary
In this example when the user first visits the webpage they initiate a http session and a socketio session.  The user must first authenticate their http session using a username and password combo.  Once they are authenticated they can access the totp api endpoints to further authenticate their session using totp, or generate a new secret server side.  After both levels of http authentcation they can access an api endpoint that responds with a jwt with a 10 second life span.  This token is then used to authenticate their socketio session.

Joining socketio rooms requires an authenticated session.

# Notes
1. In this poc the web socket is not using wss or https encryption.
2. In this poc the jwt is sent via the web socket body.  It might be better to set an authentication header.
3. In this poc the jwt secret is stored right in the .env file in the repo along with other secrets.  Dont do that.
4. I'm not using an origin header in the jwt.  I should. https://christian-schneider.net/CrossSiteWebSocketHijacking.html
5. I'm not using a random session token on the socketio handshake.  I should. https://christian-schneider.net/CrossSiteWebSocketHijacking.html
6. This approach requires that the user would need to authenticate every time they visited the website.  If you wanted persistant logins you would need to store authentication info in localstorage.  You would also need longer lived tokens.  This also means that multiple tabs in a browser will all use their own socket authentication.
7. I never implemented logout functionality.
8. I could have just had the login page submit the username, password, and 2fa info for both http and sockets without using jwt.
9. To keep this example simple I'm not adding any other session protection mechanisms like CSRF protection.