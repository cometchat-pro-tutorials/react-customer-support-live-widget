# Build a Customer Support Live Chat Widget with React


Read the full tutorial here:

[**>> Build a Customer Support Live Chat Widget with React**](https://www.cometchat.com/tutorials/build-a-customer-support-live-chat-widget-with-react/?utm_source=github&utm_medium=example-code-readme)

This demo app shows how to build an Android group chat app with React:

![Client](screenshot/screenshot_1.png)
![Agent](screenshot/screenshot_2.png)


## Running the demo

To run the demo first setup CometChat:

1. Head to [CometChat Pro](https://cometchat.com/pro?utm_source=github&utm_medium=example-code-readme) and create an account
2. From the [dashboard](https://app.cometchat.com/#/apps?utm_source=github&utm_medium=example-code-readme), create a new app called "React chat widget"
3. One created, click **Explore**
4. Go to the **API Keys** tab and click **Create API Key**
5. Create an API key called "React chat widget key" with **Full Access**
6. Go to the **Users** tab and click **Create User**
7. Create a user with the name "Agent" and the UID "Agent"
6. Download the repository [here](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/archive/master.zip) or by running `git clone https://github.com/cometchat-pro-samples/react-customer-support-live-widget.git`

Setup the server:

1. In the root directory run `npm install`
2. Open [sever.js](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/blog/master/sever.js) and update [`appID`](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/blob/master/server.js#L5), [`apiKey`](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/blob/master/server.js#L6) to use your own credentials
3. Set [`agentUID`](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/blob/master/server.js#L7) to "Agent"
3. Run the server by running `node server.js`

Setup the client:

1. Go to the `client` directory
2. Run `npm install` there too
3. Update [config.js](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/blob/master/client/src/config.js) with your credentials too
4. In another terminal run `npm start` to start the client

Questions about running the demo? [Open an issue](https://github.com/cometchat-pro-samples/react-customer-support-live-widget/issues). We're here to help ✌🏻


## Useful links

- 🏠 [CometChat Homepage](https://cometchat.com/pro?utm_source=github&utm_medium=example-code-readme)
- 🚀 [Create your free account](https://app.cometchat.com?utm_source=github&utm_medium=example-code-readme)
- 📚 [Documentation](https://prodocs.cometchat.com/docs?utm_source=github&utm_medium=example-code-readme)
- 👾 [GitHub](https://github.com/CometChat-Pro)
