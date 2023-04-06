import { FormEvent, useEffect, useState } from "react"
import { remult } from "remult"
import App from "./App"

export default function Auth() {
    const [username, setUsername] = useState("")
    const [signedIn, setSignedIn] = useState(false)
    useEffect(() => {
        fetch("/api/currentUser").then(async r => {
            remult.user = await r.json()
            if (remult.user) setSignedIn(true)
        })
    }, [])

    if (!signedIn) {
        const signIn = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const result = await fetch("/api/signIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            })
            if (result.ok) {
                remult.user = await result.json()
                setSignedIn(true)
                setUsername("")
            } else {
                alert(await result.json())
            }
        }
        return (
            <>
                <h1>Todos</h1>
                <main>
                    <form onSubmit={signIn}>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username, try Steve or Jane"
                        />
                        <button>Sign in</button>
                    </form>
                </main>
            </>
        )
    }
    const signOut = async () => {
        await fetch("/api/signOut", {
            method: "POST"
        })
        setSignedIn(false)
        remult.user = undefined
    }
    return (
        <>
            <header>
                Hello {remult.user!.name}{" "}
                <button onClick={(e) => signOut()}>Sign Out</button>
            </header>
            <App />
        </>
    )
}