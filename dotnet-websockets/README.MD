# Get started with Relay Hybrid Connections WebSockets in .NET

This sample demonstrate what is described in the tutorial at https://docs.microsoft.com/en-us/azure/service-bus-relay/relay-hybrid-connections-dotnet-get-started

## How to run

1. Deploy the environment project to a resource group
2. Set the Relay Namespace name in the App.config file of Listener and Sender Console Apps
3. Copy the value of the ListenerSharedAccessKey from the resource group deployment outputs to the Key app setting in the App.config of the Listener Console App
4. Copy the value of the SenderSharedAccessKey from the resource group deployment outputs to the Key app setting in the App.config of the Sender Console App
5. Build solution
6. Run both Listener and Sender Console Apps