using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace server
{
    public class ClientResponse
    {
        public Guid id;
        public string cmd;
        public string clientName;
        public float x;
        public float y;
        public float angle;
        public float speed;
        public string key;

        public static ClientResponse From(ClientInfo client, string cmd)
        {
            return new ClientResponse
            {
                id = client.Socket.ConnectionInfo.Id,
                cmd = cmd,
                clientName = client.ClientName,
                x = client.X,
                y = client.Y,
                angle = client.Angle,
                speed = client.Speed
            };
        }
    }
}
