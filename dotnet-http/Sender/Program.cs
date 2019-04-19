using System;
using System.Configuration;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.Relay;

namespace Client
{
    class Program
    {
        private static string RelayNamespace;
        private const string ConnectionName = "hc1";
        private const string KeyName = "SenderSharedAccessKey";
        private static string Key;

        static void Main(string[] args)
        {
            RelayNamespace = String.Format("{0}.servicebus.windows.net", ConfigurationManager.AppSettings["RelayNamespace"]);
            Key = ConfigurationManager.AppSettings["Key"];

            RunAsync().GetAwaiter().GetResult();
        }

        private static async Task RunAsync()
        {
            var tokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(
                    KeyName, Key);
            var uri = new Uri(string.Format("https://{0}/{1}", RelayNamespace, ConnectionName));
            var token = (await tokenProvider.GetTokenAsync(uri.AbsoluteUri, TimeSpan.FromHours(1))).TokenString;
            var client = new HttpClient();
            var request = new HttpRequestMessage()
            {
                RequestUri = uri,
                Method = HttpMethod.Get,
            };
            request.Headers.Add("ServiceBusAuthorization", token);
            var response = await client.SendAsync(request);
            Console.WriteLine(await response.Content.ReadAsStringAsync()); Console.ReadLine();
        }
    }
}