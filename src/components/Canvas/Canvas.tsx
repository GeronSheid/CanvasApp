import { timeStamp } from "console";
import { useEffect, useRef, useState } from "react";
import { IBall } from "../../App";



export interface IProps {
    setBallIndex: React.Dispatch<React.SetStateAction<number | null>>,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    ballIndex: number | null,
    modalVisible: boolean,
    balls: IBall[]
}



type Props = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>
    &
    IProps;




const Canvas: React.FC<Props> = ({ balls, ...props }) => {
    const SLOWDOWN_PARAM = -0.7;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const mouseDown = useRef<boolean>(false);
    const mousePrevPos = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
    const mousePos = useRef<{ x: number, y: number }>({ x: 0, y: 0 })

    const isInside = (mx: number, my: number, ball: IBall): boolean => {
        const distX = mx - ball.x;
        const distY = my - ball.y;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);
        return distance <= ball.r;
    }

    const handleMouseDown = (e: MouseEvent) => {
        const rectangle = canvasRef.current?.getBoundingClientRect() as DOMRect;
        const mouse_x = e.clientX - rectangle.left;
        const mouse_y = e.clientY - rectangle.top;

        if (e.buttons === 1) {
            mouseDown.current = true;
        }
        balls.forEach(ball => {

            if (isInside(mouse_x, mouse_y, ball) && e.buttons === 1) {
                props.setBallIndex(balls.indexOf(ball));
                props.setModalVisible(true);
                mouseDown.current = false;
            }
        })
    }

    const handleMouseUp = (e: MouseEvent) => {

        mouseDown.current = false;

    }


    const handleMouseMove = (e: MouseEvent) => {
        const rectangle = canvasRef.current?.getBoundingClientRect() as DOMRect;
        const mouse_x = e.clientX - rectangle.left;
        const mouse_y = e.clientY - rectangle.top;
        mousePrevPos.current = { x: mousePos.current.x, y: mousePos.current.y };
        mousePos.current = { x: mouse_x, y: mouse_y };

        const dmx = mousePos.current.x - mousePrevPos.current.x;
        const dmy = mousePos.current.y - mousePrevPos.current.y;

        balls.forEach(ball => {
            if (isInside(mouse_x, mouse_y, ball) && mouseDown.current) {
                ball.dx = dmx;
                ball.dy = dmy;
            }
        })

    }

    useEffect(() => {

        canvasRef.current?.addEventListener('mousemove', handleMouseMove)
        canvasRef.current?.addEventListener('mousedown', handleMouseDown)
        canvasRef.current?.addEventListener('mouseup', handleMouseUp)

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) {
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

                if (ball.x - ball.r < 0) {
                    ball.x = ball.r;
                    ball.dx *= SLOWDOWN_PARAM;
                } else if (ball.x + ball.r > canvas.width) {
                    ball.x = canvas.width - ball.r;
                    ball.dx *= SLOWDOWN_PARAM;
                }

                if (ball.y - ball.r < 0) {
                    ball.y = ball.r;
                    ball.dy *= SLOWDOWN_PARAM;
                } else if (ball.y + ball.r > canvas.height) {
                    ball.y = canvas.height - ball.r;
                    ball.dy *= SLOWDOWN_PARAM;
                }





                balls.forEach(otherBall => {
                    if (ball !== otherBall) {
                        const dBalls_x = ball.x - otherBall.x
                        const dBalls_y = ball.y - otherBall.y
                        const distance = Math.sqrt(dBalls_x * dBalls_x + dBalls_y * dBalls_y);
                        const overlap = (ball.r + otherBall.r) - distance;
                        const angle = Math.atan2(dBalls_y, dBalls_x);
                        const overlap_x = Math.cos(angle) * overlap;
                        const overlap_y = Math.sin(angle) * overlap;
                        if (distance < ball.r + otherBall.r) {
                            otherBall.dx = (otherBall.dx + ball.dx) * SLOWDOWN_PARAM;
                            otherBall.dy = (otherBall.dy + ball.dy) * SLOWDOWN_PARAM;
                            otherBall.x -= overlap_x / 2;
                            otherBall.y -= overlap_y / 2;
                        }

                    }
                })


            })

        }

        const animationFrameId = requestAnimationFrame(animate);

        return () => {
            canvasRef.current?.removeEventListener('mouseover', handleMouseMove)
            canvasRef.current?.removeEventListener('mousedown', handleMouseDown)
            canvasRef.current?.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    return (
        <canvas width={props.width} height={props.height} ref={canvasRef} style={{ border: '1px solid #333' }} />
    )
}

export default Canvas;
