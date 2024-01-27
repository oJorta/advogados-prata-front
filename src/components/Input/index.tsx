'use client'
import React, { ElementType, useState } from 'react'
import styles from './index.module.css'
import InputError from '../input (Error)'
import { inputErrorProps } from '@/types/inputErrorProps'

import { addStyle } from '@/styles/inputStyles'

type InputProps = {
    type: string
    title: string
    icon: ElementType
    invalid: inputErrorProps
    setFocus: () => void
    value: (arg: string) => void
}

export default function Input({ type, title, invalid, setFocus, icon: Icon, value }: InputProps) {
    const [inputValue, setInputValue] = useState<string>('')

    function handleInputChange(el: React.FormEvent<HTMLInputElement>) {
        setInputValue(el.currentTarget.value)
    }

    value(inputValue)

    return (
        <label
            htmlFor={`${type}Input`}
            className={styles.inputLabel}
            onClick={setFocus}
            style={addStyle(invalid.error)}
        >
            <Icon className={styles.inputIcon} />
            <input
                value={inputValue}
                onChange={handleInputChange}
                id={`${type}Input`}
                type={type}
                className={styles.inputText}
                placeholder={title}
            />
            {invalid.error && <InputError text={invalid.textError} />}
        </label>
    )
}
