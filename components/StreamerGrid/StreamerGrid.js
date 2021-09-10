import React from 'react'
import Image from 'next/image'
import styles from '../../styles/StreamerGrid.module.css'

const StreamerGrid = ({ channels, setChannels }) => {
    // Actions
    const removeChannelAction = channelID => async () => {
        console.log("Removing channel with ID: ", channelID)

        const filteredChannels = channels.filter(channel => channel.id !== channelID)

        setChannels(filteredChannels)

        const joinedChannels = filteredChannels.map(channel => channel.display_name.toLowerCase()).join(',')

        await setDBChannels(joinedChannels)
    }

    const getTwitchLink = channel => "https://www.twitch.tv/"+channel.broadcaster_login

    const setDBChannels = async channels => {
        try {
            const path = `https://${window.location.hostname}`

            const response = await fetch(`${path}/api/database`, {
                method: 'POST',
                body: JSON.stringify({
                    key: 'CHANNELS',
                    value: channels
                })
            })

            if (response.status === 200) {
                console.log(`Set ${channels} in DB.`)
            }
        } catch (error) {
            console.warn(error.message)
        }
    }

    // Render Methods
    const renderGridItem = channel => (
        <div key={channel.id} className = {styles.gridItem}>
            <button onClick={removeChannelAction(channel.id)}>X</button>
            <Image layout = "fill" src={channel.thumbnail_url} />
            <div className = {styles.gridItemContent}>
                <a href={getTwitchLink(channel)}>{channel.display_name}</a>
                {channel.is_live && <p>🔴 Live Now!</p>}
                {!channel.is_live && <p>⚫ Offline</p>}
            </div>
        </div>
    )

    const renderNoItems = () => (
        <div className={styles.gridNoItems}>
            <p>Add a streamer to get started!</p>
        </div>
    )

    return (
        <div className = {channels.length > 0 && styles.container}>
            {channels.length > 0 && channels.map(renderGridItem)}
            {channels.length === 0 && renderNoItems()}
        </div>
    )
}

export default StreamerGrid
