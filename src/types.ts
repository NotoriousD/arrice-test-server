export interface Message {
    id: string
    username: string
    message: string
    room: string
}

export interface Room {
    id: string
    name: string
}

export interface User {
    id: string
    username: string
    room: string
}