import { playSound } from "@/functions/playSound";
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, IMicrophoneAudioTrack, UID } from "agora-rtc-sdk-ng";
import joinRoomSound from '../public/sounds/joinRoom.mp3'

const appId = '207228e1457d4d71ae3de9d6506baf10'
const tokenRtc = null 
const tokenRtm = undefined

let audioTracks: {
    localAudioTracks: IMicrophoneAudioTrack | undefined;
    remoteAudioTracks: Record<string, any>
} = {
    localAudioTracks: undefined,
    remoteAudioTracks: {},
};

let rtcClient: IAgoraRTCClient



let micMuted:boolean
let currentRoomId: string | null = null; // Variable to store the current room ID




export const initRtc = async (
    roomId: string, 
    userId: string,
    serverId:string,
    micMuted:boolean | undefined,
    fullyMuted:boolean | undefined,
    user:{_id:string,avatar:string,nickname:string}
) => {

    if (currentRoomId !== roomId) {
        await leaveRoomRtc()
    }else{
        return
    }

        // Set the current room ID
        currentRoomId = roomId;

        rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


        // rtcClient.on('user-joined', handleUserJoined)
        rtcClient.on("user-published", handleUserPublished)
        rtcClient.on("user-left", handleUserLeft)
        
        
        await rtcClient.join(appId, roomId, tokenRtc, userId)
        audioTracks.localAudioTracks = await AgoraRTC.createMicrophoneAudioTrack()
        audioTracks.localAudioTracks?.setMuted(micMuted!);
        await rtcClient.publish(audioTracks.localAudioTracks)

        playSound(joinRoomSound,0.3)
      
       
};

 


let handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType:string) => {
    await rtcClient.subscribe(user, mediaType as "audio" | "video");
    
    if (mediaType == "audio"){
        audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
        user?.audioTrack?.play()
    }
}

let handleUserLeft = async (user:IAgoraRTCRemoteUser) => {
    delete audioTracks.remoteAudioTracks[user.uid]
}

export const initVolumeIndicator = async(setVolumeLevel: React.Dispatch<React.SetStateAction<{level: number;uid:UID} | undefined>>) =>{
    
    // AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
    rtcClient.enableAudioVolumeIndicator()
    

    rtcClient.on('volume-indicator', volumes =>{
        volumes.forEach((volume:{level: number;uid:UID})=>{
            setVolumeLevel(volume)
        })
    })
}

export let micRtcToggler = async (micMuted: boolean,fullyMuted?:boolean) => {
  
    if(micMuted){
        audioTracks.localAudioTracks?.setMuted(true)
    }
    if(!micMuted && fullyMuted){
        audioTracks.localAudioTracks?.setMuted(false)
        rtcClient.remoteUsers.forEach((user) => {
            user.audioTrack?.setVolume(0);
        });
    }
}

export let audioRtcToggler = async (micMuted: boolean, fullyMuted: boolean) => {
    console.log("MIC MUTED:",micMuted,"FULLY MUTED:",fullyMuted)
    if (fullyMuted) {
        audioTracks.localAudioTracks?.setMuted(true)
        rtcClient.remoteUsers.forEach((user) => {
            user.audioTrack?.setVolume(0);
        });
    } else if(!fullyMuted) {
        audioTracks.localAudioTracks?.setMuted(true)
        rtcClient.remoteUsers.forEach((user) => {
            user.audioTrack?.setVolume(100);
        });
    }
};

export async function leaveRoomRtc() {
     
    if (rtcClient && currentRoomId) {
      
        // Check if the client has joined before attempting to leave
        if (rtcClient.connectionState === 'CONNECTED') {
            // Check if the local audio track is available
            if (audioTracks.localAudioTracks) {
                // Stop and close the local audio track
                audioTracks.localAudioTracks.stop()
                audioTracks.localAudioTracks.close()

                // Unpublish local tracks
                await rtcClient.unpublish(audioTracks.localAudioTracks);
            }

             // Leave the channel
            await rtcClient.leave()
          

            // Reset the current room ID
            currentRoomId = null

            // Clean up remote audio tracks
            Object.values(audioTracks.remoteAudioTracks).forEach((audioTrack) => {
                audioTrack[0]?.stop()
            });

            audioTracks.remoteAudioTracks = {}
        } else {
            // If not connected, reset the current room ID
            currentRoomId = null
        }
    }
}


