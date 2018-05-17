using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace CanvasApp
{
    /// <summary>
    /// Interação lógica para MainWindow.xam
    /// </summary>
    public partial class MainWindow : Window
    {
        private const int Interval = 10000;
        private const int ScoreIncrement = 10;
        private int score = 0;
        private Random rnd = new Random();
        private Snake snake;
        private Point fruit = new Point();
        private Brush fruitColor = Brushes.Red;
        private int fruitSize = 16;
        private Color BGColor = Colors.Black;
        private DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            MainCanvas.Background = new SolidColorBrush(BGColor);
            snake = new Snake(MainCanvas.Height / 2, MainCanvas.Width / 2);
            MoveFruit();
            timer.Tick += new EventHandler(Tick);
            timer.Interval = new TimeSpan(Interval);
            timer.Start();
            
        }

        private void Tick(object sender, EventArgs e)
        {
            MainCanvas.Children.Clear();
            DrawFruit();
            snake.Draw(MainCanvas);
            snake.Update();
            CheckCollisions();
        }

        private void CheckCollisions()
        {
            var head = snake.Body[0];
            
            // Snake wrap
            if (head.X < 0) head.X = MainCanvas.Height - 1;
            if (head.X > MainCanvas.Height - 1) head.X = 0;
            if (head.Y < 0) head.Y = MainCanvas.Width - 1;
            if (head.Y > MainCanvas.Width - 1) head.Y = 0;
            snake.Body[0] = head;

            // Collision with fruit
            if (Math.Abs(head.X - fruit.X) < snake.SegmentSize / 2 + fruitSize / 2 
                && Math.Abs(head.Y - fruit.Y) < snake.SegmentSize / 2 + fruitSize / 2)
            {
                snake.Eat();
                MoveFruit();
                score += ScoreIncrement;
                UpdateTitle();
            }
        }

        private void Reset()
        {
            MoveFruit();
            snake.Reset();
        }

        private void MoveFruit()
        {
            fruit.X = rnd.Next(fruitSize, (int)MainCanvas.Height - fruitSize);
            fruit.Y = rnd.Next(fruitSize, (int)MainCanvas.Width - fruitSize);
        }

        private void DrawFruit()
        {
            var e = new Ellipse();
            e.Fill = fruitColor;
            e.Height = e.Width = fruitSize;
            Canvas.SetTop(e, fruit.X);
            Canvas.SetLeft(e, fruit.Y);
            MainCanvas.Children.Add(e);
        }

        private void UpdateTitle()
        {
            Title = "Snake Game (Score: " + score + ") Press 'R' to reset.";
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.R:
                    Reset();
                    break;
                case Key.Up:
                    snake.Direction = Directions.Up;
                    break;
                case Key.Right:
                    snake.Direction = Directions.Right;
                    break;
                case Key.Down:
                    snake.Direction = Directions.Down;
                    break;
                case Key.Left:
                    snake.Direction = Directions.Left;
                    break;
            }
        }
    }
}
