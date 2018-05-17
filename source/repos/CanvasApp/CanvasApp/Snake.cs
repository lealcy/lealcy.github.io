using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace CanvasApp
{
    public enum Directions { Up, Down, Left, Right};


    public class Snake
    {
        public List<Point> Body = new List<Point>();
        public Brush Color = Brushes.Green;
        public Point StartPosition = new Point();
        public Directions Direction = Directions.Up;
        public double SegmentSize = 16;
        public double Speed = 2;
        private bool eat = false;

        public Snake(double x, double y) {
            StartPosition.X = x;
            StartPosition.Y = y;
            Reset();
        }

        public void Reset()
        {
            Direction = Directions.Up;
            Body.Clear();
            Body.Add(new Point(StartPosition.X, StartPosition.Y));
            eat = false;
        }

        public void Draw(Canvas canvas)
        {
            foreach(var segment in Body)
            {
                var e = new Ellipse();
                e.Fill = Color;
                e.Height = e.Width = SegmentSize;
                Canvas.SetTop(e, segment.X);
                Canvas.SetLeft(e, segment.Y);
                canvas.Children.Add(e);
            }
        }

        public void Update()
        {
            var head = Body[0];
            var pos = new Point(head.X, head.Y);

            switch (Direction)
            {
                case Directions.Up:
                    pos.X -= Speed;
                    break;
                case Directions.Right:
                    pos.Y += Speed;
                    break;
                case Directions.Down:
                    pos.X += Speed;
                    break;
                case Directions.Left:
                    pos.Y -= Speed;
                    break;
            }

            if (!eat)
            {
                Body.RemoveAt(Body.Count - 1);
            }
            eat = false;
            Body.Insert(0, pos);
        }

        public void Eat()
        {
            eat = true;
        }
    }


}
