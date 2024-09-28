"use client"
import { Center, Loader } from '@mantine/core'
import React from 'react'

type Props = {}

export default function Loading({ }: Props) {
    return (
        <Center style={{ width: '100vw', height: '100vh' }}>
            <Loader size="md" type="dots" color='blue' />
        </Center>
    )
}