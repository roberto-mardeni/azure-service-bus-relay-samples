﻿using System;
using System.Threading.Tasks;
using Microsoft.Azure.Relay;
using System.Configuration;
using System.IO;
using System.Net;
using System.Threading;

namespace Listener
{
    class Program
    {
        private static string RelayNamespace;
        private const string ConnectionName = "hc1";
        private const string KeyName = "ListenerSharedAccessKey";
        private static string Key;

        static void Main(string[] args)
        {
            RelayNamespace = String.Format("{0}.servicebus.windows.net", ConfigurationManager.AppSettings["RelayNamespace"]);
            Key = ConfigurationManager.AppSettings["Key"];

            RunAsync().GetAwaiter().GetResult();
        }

        private static async Task RunAsync()
        {
            var cts = new CancellationTokenSource();

            var tokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(KeyName, Key);
            var listener = new HybridConnectionListener(new Uri(string.Format("sb://{0}/{1}", RelayNamespace, ConnectionName)), tokenProvider);

            // Subscribe to the status events.
            listener.Connecting += (o, e) => { Console.WriteLine("Connecting"); };
            listener.Offline += (o, e) => { Console.WriteLine("Offline"); };
            listener.Online += (o, e) => { Console.WriteLine("Online"); };

            // Provide an HTTP request handler
            listener.RequestHandler = (context) =>
            {
                // Do something with context.Request.Url, HttpMethod, Headers, InputStream...
                context.Response.StatusCode = HttpStatusCode.OK;
                context.Response.StatusDescription = "OK, This is pretty neat";
                using (var sw = new StreamWriter(context.Response.OutputStream))
                {
                    sw.WriteLine("hello!");
                }

                // The context MUST be closed here
                context.Response.Close();
            };

            // Opening the listener establishes the control channel to
            // the Azure Relay service. The control channel is continuously 
            // maintained, and is reestablished when connectivity is disrupted.
            await listener.OpenAsync();
            Console.WriteLine("Server listening");

            // Start a new thread that will continuously read the console.
            await Console.In.ReadLineAsync();

            // Close the listener after you exit the processing loop.
            await listener.CloseAsync();
        }
    }
}
