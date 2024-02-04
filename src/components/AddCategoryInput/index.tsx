import { useState } from 'react'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { addNewCategory } from '@/functions/addNewCategory'
import styles from './index.module.css'

export default function AddCategoryInput({ setModalIsOpen } : { setModalIsOpen: (value: boolean) => void }) {
    const [category, setCategory] = useState('')

    return (
            <div className={styles.modalContainer}>
                <input
                    type="text"
                    placeholder="Nome da categoria"
                    onChange={(e) => setCategory(e.target.value)}
                />
                <div className={styles.options}>
                    <button
                        type="submit"
                        onClick={() => {
                            addNewCategory(category)
                            setCategory('')
                        }}
                    >
                        <IoMdAdd/>
                    </button>
                    <button onClick={() => setModalIsOpen(false)}>
                        <IoMdClose/>
                    </button>
                </div>
            </div>
    )
}