import styles from './index.module.css'
import { addStylePlace } from '@/styles/inputStyles'

type inputErrorProps = {
    text: string,
    style?: boolean
}

export default function InputError({text, style}: inputErrorProps){

    return(
        <div className={styles.containerInputError} style={addStylePlace(style)}>
        <div className={styles.containerPointer}>
            <div className={styles.pointer}></div>
        </div>
        <label>{text}</label>
    </div>
    )
}