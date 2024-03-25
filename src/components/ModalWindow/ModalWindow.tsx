import React, { useEffect, useState } from 'react';
import styles from './ModalWindow.module.css';
import { IBall, ballsType } from '../../App';



interface IProps {
    balls: IBall[]
    ballIndex: number | null,
    setBallIndex: React.Dispatch<React.SetStateAction<number | null>>,
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>,
    setBalls: React.Dispatch<React.SetStateAction<ballsType>>
}


export const ModalWindow: React.FC<IProps> = ({...props}) => {

    const oneBall = props.balls[props.ballIndex as number].color
    const ball = oneBall.substring(4, oneBall.length - 1).split(',');

    const [red, setRed] = useState<number>(+ball[0]);
    const [green, setGreen] = useState<number>(+ball[1]);
    const [blue, setBlue] = useState<number>(+ball[2]);
    
    const colorValue =`rgb(${red}, ${green}, ${blue})`;

    useEffect(() => {
        props.balls.map(ball => {
           if(ball.color === oneBall) {
                ball.color = colorValue
           }
        })
    }, [props.balls, colorValue])

  return (
    <div className={styles.modal}>
        <div className={styles.modal__header}>
            <h2>Поменять цвет шара</h2>
            <button onClick={() => props.closeHandler(false)}>Закрыть</button>
        </div>
        <div style={{height: 200, width: 200, backgroundColor: colorValue}}>
        </div>
        <form className={styles.form}>
            <label className={styles.label}>
                <span className={styles.colorName}>Красный:</span>
                <input className={styles.input} type="range" step={1} min={1} max={255} value={red} onChange={(e) => setRed(+e.target.value)}/>
            </label>
            <label className={styles.label}>
                <span className={styles.colorName}>Зеленый:</span>
                <input className={styles.input} type="range" step={1} min={1} max={255} value={green} onChange={(e) => setGreen(+e.target.value)}/>
            </label>
            <label className={styles.label}>
                <span className={styles.colorName}>Синий:</span>
                <input className={styles.input} type="range" step={1} min={1} max={255} value={blue} onChange={(e) => setBlue(+e.target.value)}/>
            </label>
            
        </form>
        <div className={styles.modal__footer}>
            <button onClick={() => {props.closeHandler(false);}}>Сохранить</button>
        </div>
    </div>
  )
}
