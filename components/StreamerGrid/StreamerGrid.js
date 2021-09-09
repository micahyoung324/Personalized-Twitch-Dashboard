import React from 'react'
import Image from 'next/image'
import styles from '../../styles/StreamerGrid.module.css'

const StreamerGrid = ({ channels, setChannels }) => {
    // Actions
    const removeChannelAction = channelID => () => {
        console.log("Removing channel.")
        setChannels(channels.filter(channel => channel.id !== channelID))
    }

    // Render Methods
    const renderGridItem = channel => (
        <div key={channel.id} className = {styles.gridItem}>
        <button onClick={removeChannelAction(channel.id)}>X</button>
            <Image layout = "fill" src={channel.thumbnail_url} />
            <div className = {styles.gridItemContent}>
                <p>{channel.display_name}</p>
                {channel.is_live && <p>Live Now!</p>}
                {!channel.is_live && <p>Offline</p>}
            </div>
        </div>
    )

    const renderNoItems = () => (
        <div className={styles.gridNoItems}>
            <p>Add a streamer to get started!</p>
        </div>
    )

    // UseEffects

    return (
        <div>
            {channels.length > 0 && channels.map(renderGridItem)}
            {channels.length === 0 && renderNoItems()}
        </div>
    )
}

export default StreamerGrid
