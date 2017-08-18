using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fleck;

namespace server
{
    public class ClientInfo
    {
        const int CANVAS_WIDTH = 976;
        const int CANVAS_HEIGHT = 860;
        const float MAX_SPEED = 3f;
        const float ACCELERATION = 0.05f;

        public IWebSocketConnection Socket { get; }
        public string ClientName { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public float Angle { get; set; }
        public float Speed { get; set; }
        public Dictionary<string, bool> Keys { get; set; }
        private Random rnd;

        public ClientInfo(IWebSocketConnection socket)
        {
            Socket = socket;
            rnd = new Random();
            X = rnd.Next(0, CANVAS_WIDTH);
            Y = rnd.Next(0, CANVAS_HEIGHT);
            Angle = (float)(rnd.NextDouble() * 2  * Math.PI);
            Speed = 0;
            Keys = new Dictionary<string, bool>();
        }

        public bool Update()
        {
            bool update = false;
            // return false;
            /*if (this.keys[" "] === true)
            {
                if (!this.shot)
                {
                    if (this.cooldown <= 0)
                    {
                        this.projectiles.push(
                            new Projectile(this.x, this.y, this.angle)
                        );
                        this.cooldown = shotCooldown;
                        this.shot = true;
                    }
                }
            }
            else
            {
                this.shot = false;
            }

            this.cooldown--;
            this.projectiles.forEach((p, i) => {
                p.update();
                if (p.offScreen())
                {
                    this.projectiles.splice(i, 1);
                    return;
                }
                if (target.hit(p.x, p.y))
                {
                    target.x = Math.floor(Math.random() * canvas.width);
                    target.y = Math.floor(Math.random() * canvas.height);
                    this.projectiles.splice(i, 1);
                    return;
                }
            });
            */
            var oldAngle = Angle;
            var oldX = X;
            var oldY = Y;
            if (IsKeyPressed("ArrowRight"))
            {
                Angle += IsKeyPressed("ArrowDown") ? -0.03f : 0.06f;
                update = true;
            }
            if (IsKeyPressed("ArrowLeft"))
            {
                Angle += IsKeyPressed("ArrowDown") ? 0.03f : -0.06f;
                update = true;
            }
            if (IsKeyPressed("ArrowUp"))
            {
                if (Speed < MAX_SPEED)
                {
                    Speed += ACCELERATION;
                    if (Speed > MAX_SPEED)
                    {
                        Speed = MAX_SPEED;
                    }
                    update = true;
                }
            }
            else
            {
                if (Speed > 0 || IsKeyPressed("ArrowDown"))
                {
                    Speed -= ACCELERATION * 2;
                    if (Speed < -(MAX_SPEED / 2))
                    {
                        Speed = -(MAX_SPEED / 2);
                    }
                    update = true;
                }
                else if (!IsKeyPressed("ArrowDown") && Speed < 0)
                {
                    Speed += ACCELERATION * 5;
                    if (Speed > 0)
                    {
                        Speed = 0;
                    }
                    update = true;
                }
            }
            var newX = X + Speed * (float)Math.Cos(Angle);
            var newY = Y + Speed * (float)Math.Sin(Angle);
            if (newX != X || newY != Y)
            {
                update = true;
            }
            if (newX > 0 && newX < CANVAS_WIDTH)
            {
                X = newX;
            }
            if (newY > 0 && newY <CANVAS_HEIGHT)
            {
                Y = newY;
            }
            /*if (oldX !== this.x || oldY !== this.y || oldAngle !== this.angle)
            {
                this.skidMarks.push({ x: oldX, y: oldY, angle: oldAngle });
                while (this.skidMarks.length > maxSkidMarks)
                {
                    this.skidMarks.shift();
                }
            }*/

            return update;
        }

        public void KeyUp(string key)
        {
                Keys[key] = false;
        }

        public void KeyDown(string key)
        {
            Keys[key] = true;
        }

        public bool IsKeyPressed(string key)
        {
            if (!Keys.ContainsKey(key))
            {
                return false;
            }
            return Keys[key];
        }
    }
}
