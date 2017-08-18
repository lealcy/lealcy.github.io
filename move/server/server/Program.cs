using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Runtime.Serialization;
using Fleck;
using Newtonsoft.Json;
using System.Timers;

namespace server
{
    class Program
    {
        static Dictionary<Guid, ClientInfo> clients = new Dictionary<Guid, ClientInfo>();
        static Timer updateTimer;

        static void Main(string[] args)
        {
            var server = new WebSocketServer("ws://0.0.0.0:8181");
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine($"{socket.ConnectionInfo.Id} New client connected.");
                    clients.Add(socket.ConnectionInfo.Id, new ClientInfo(socket));
                };
                socket.OnClose = () =>
                {
                    Console.WriteLine($"{socket.ConnectionInfo.Id} disconnected.");
                    var client = clients[socket.ConnectionInfo.Id];
                    clients.Remove(socket.ConnectionInfo.Id);
                    BroadcastMessage(ClientResponse.From(client, "clientDisconnected"));
                };
                socket.OnMessage = message => {
                    ProcessMessage(socket, message);
                };

            });

            updateTimer = new Timer(1000 / 30);
            updateTimer.Elapsed += UpdateTimer_Elapsed;
            updateTimer.AutoReset = true;
            updateTimer.Start();

            while (!Console.KeyAvailable) ;

            Console.WriteLine("Server interrupted by the user.");

        }

        private static void UpdateTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            foreach (var client in clients.Values)
            {
                if(client.Update())
                {
                    BroadcastMessage(ClientResponse.From(client, "update"));
                }
            }
        }

        private static void ProcessMessage(IWebSocketConnection socket, string message)
        {
            var connectionId = socket.ConnectionInfo.Id;
            Console.WriteLine($"received: {message}");
            try
            {
                var cr = JsonConvert.DeserializeObject<ClientResponse>(message);
                switch (cr.cmd)
                {
                    case "hello":
                        clients[connectionId].ClientName = cr.clientName;
                        foreach (var client in clients.Values)
                        {
                            socket.Send(JsonConvert.SerializeObject(ClientResponse.From(client, "clientConnected")));
                        }
                        BroadcastMessage(ClientResponse.From(clients[connectionId], "clientConnected"));
                        break;
                    case "keydown":
                        clients[connectionId].KeyDown(cr.key);
                        break;
                    case "keyup":
                        clients[connectionId].KeyUp(cr.key);
                        break;
                    case "msg":
                        break;
                    default:
                        Console.WriteLine($"{connectionId} Command '{cr.cmd}' unknown.");
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
            string message = JsonConvert.SerializeObject(cr);
            foreach (var client in clients.Values) {
                client.Socket.Send(message);
            }
        }
    }
}
