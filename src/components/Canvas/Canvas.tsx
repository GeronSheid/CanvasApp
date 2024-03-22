import { timeStamp } from "console";
import { useEffect, useRef } from "react";

interface IBall {
    x: number,
    y: number,
    r: number,
    dx: number,
    dy: number,
    color: string
  }

type Props = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> 
        & 
    { draw?: (context: CanvasRenderingContext2D) => void};





const Canvas: React.FC<Props> = ({ ...props }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const balls = [{x: 100, y: 100, r: 30, dx: 5, dy: 0, color: 'red'}, {x: 150, y: 100, r: 30, dx: -5, dy: 0, color: 'green'}];






    useEffect(() => {

        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const canvasContext = canvas.getContext('2d');
        if(!canvasContext) {
            return;
        }

        const draw = (context: CanvasRenderingContext2D) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => {
                context.beginPath();
                context.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
                context.fillStyle = ball.color;
                context.fill();
                context.closePath();
            })
          }
        
        const animate = () => {
            update()
            draw(canvasContext)
            requestAnimationFrame(animate)
        }

        const update = () => {

            balls.forEach(ball => {
                ball.x += ball.dx;
                ball.y += ball.dy;
                if(ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) {
                    ball.dx = -ball.dx
                }
                if(ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) {
                    ball.dy = -ball.dy
                }

                balls.forEach(otherBall => {
                    if(ball !== otherBall) {
                        const dBalls_x = ball.x - otherBall.x
                        const dBalls_y = ball.y - otherBall.y
                        const distance = Math.sqrt(dBalls_x * dBalls_x + dBalls_y * dBalls_y);
                        if(distance < ball.r + otherBall.r) {
                            
                        }

                    }
                })


            })

            
            
        }

        const animationFrameId = requestAnimationFrame(animate);
    }, [])

    return (
        <canvas width={props.width} height={props.height} ref={canvasRef} style={{border: '1px solid #333'}}/>
    )
}

export default Canvas;
