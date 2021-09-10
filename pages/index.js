// Main entry point of your app
import React, { useEffect, useState } from "react"
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StreamerGrid from '../components/StreamerGrid'

const Home = () => {
    // State
    const [favoriteChannels, setFavoriteChannels] = useState([])

    // Actions
    const addStreamChannel = async event => {
        // Prevent the page from redirecting
        event.preventDefault();

        const { value } = event.target.elements.name

        if (value) {
            console.log("value: ", value)

            // Call Twitch Search API
            const path = `https://${window.location.hostname}`

            const response = await fetch(`${path}/api/twitch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: value})
            })

            const json = await response.json()

            console.log("From the server: ", json.data)

            setFavoriteChannels(prevState => [...prevState, json.data])

            await setChannel(value)

            event.target.elements.name.value = ""
        }
    }

    const setChannel = async channelName => {
        try {
            const currentStreamers = favoriteChannels.map(channel => channel.display_name.toLowerCase())

            const streamerList = [...currentStreamers, channelName].join(",")

            const path = `https://${window.location.hostname}`

            const response = await fetch(`${path}/api/database`, {
                method: 'POST',
                body: JSON.stringify({
                    key: 'CHANNELS',
                    value: streamerList
                })
            })

            if (response.status === 200) {
                console.log(`Set ${channelName} in DB.`)
            }
        } catch (error) {
            console.warn(error.message)
        }
    }

    const fetchChannels = async () => {
        try {
            const path = `https://${window.location.hostname}`

            // Get key from DB
            const response = await fetch(`${path}/api/database`, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'GET_CHANNELS',
                    key: 'CHANNELS'
                })
            })

            if (response.status === 404) {
                console.log("Channels key could not be found")
            }

            const json = await response.json()

            if (json.data) {

                const channelNames = json.data.split(',')

                console.log('Channel Names: ', channelNames)

                // Get Twitch data and set in channels State
                const channelData = []

                for await (const channelName of channelNames) {
                    console.log("Gettubg Twitch Data For: ", channelName)

                    const channelResp = await fetch(`${path}/api/twitch`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ data: channelName })
                    })

                    const json = await channelResp.json()

                    if (json.data) {
                        channelData.push(json.data)
                        console.log(channelData)
                    }
                }

                setFavoriteChannels(channelData)
            }
        } catch (error) {
            console.warn(error.message)
        }
    }

    // useEffect
    useEffect(() => {
        console.log("Fetching Channels.")
        fetchChannels()
    }, [])

    // Render Methods
    const renderForm = () => (
        <div className = {styles.formContainer}>
            <form onSubmit = {addStreamChannel}>
                <input id = "name" placeholder = "Twitch Channel Name" type = "text" required />
                <button type = "submit">Add Streamer</button>
            </form>
        </div>
    )

    return (
        <div className={styles.container}>
            <Head>
                <title>Personal Twitch Dashboard</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className={styles.inputContainer}>
                <h1>Welcome to the Personalized Twitch Dashboard!</h1>
                {renderForm()}
                <StreamerGrid channels = {favoriteChannels} setChannels = {setFavoriteChannels} />
            </div>
        </div>
    )
}

export default Home