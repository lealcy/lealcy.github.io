using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Runtime.Serialization;
using Fleck;
using Newtonsoft.Json;

namespace server
{
    class Program
    {
        static List<IWebSocketConnection> clients = new List<IWebSocketConnection>();

        static void Main(string[] args)
        {
            var server = new WebSocketServer("ws://0.0.0.0:9998");
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine($"{socket.ConnectionInfo.Id} New client connected.");
                    clients.Add(socket);
                };
                socket.OnClose = () =>
                {
                    Console.WriteLine($"{socket.ConnectionInfo.Id} disconnected.");
                    clients.Remove(socket);
                };
                socket.OnMessage = message => {
                    ProcessMessage(socket, message);
                };

            });

            while (!Console.KeyAvailable) ;

            Console.WriteLine("Server interrupted by the user.");

        }

        private static void ProcessMessage(IWebSocketConnection socket, string message)
        {
            // Decode Message:
            var connectionId = socket.ConnectionInfo.Id;
            try
            {
                var cr = JsonConvert.DeserializeObject<ClientResponse>(message);
                switch (cr.cmd)
                {
                    case "hello":
                        Console.WriteLine($"{connectionId} Client connected: '{cr.clientName}'.");
                        BroadcastMessage(cr);
                        break;
                    case "msg":
                        Console.WriteLine($"{connectionId} <{cr.clientName}> {cr.data}");
                        break;
                    default:
                        Console.WriteLine($"{connectionId} Command '{cr.cmd}' unknown from '{cr.clientName}': {cr.data}");
                        break;
                }
            }
            catch (JsonReaderException e)
            {
                Console.WriteLine($"{connectionId} Invalid client message: '{message}'");
                socket.Close();
                return;
            }

        }

        private static void BroadcastMessage(ClientResponse cr)
        {
            clients.ToList().ForEach(s => s.Send(JsonConvert.SerializeObject(cr)));
        }
    }
}
