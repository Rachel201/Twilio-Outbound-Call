
import React, { useState, useEffect } from "react";
import { Device } from "twilio-client";
import axios from "axios";
import ''

const backendUrl = process.env.BACKEND_URL

enum CallState {
    CONNECTING = "Connecting",
    READY = "Ready",
    ON_CALL = "On call",
    OFFLINE = "Offline",
    ERROR = "Error",
}

interface DialerProp {
    phoneNumber: string;
}

const Dialer = ({ phoneNumber }: DialerProp) => {
    const [currentCallState, setCurrentCallState] = useState<CallState>(
        CallState.CONNECTING
    );
    const [device, setDevice] = useState<any>(null);

    console.log("initiate");

    useEffect(() => {
        const device = new Device();

        axios
            .get(`${backendUrl}/token`)
            .then((data: any) => {
                console.log(data.data.token);
                device.setup(data.data.token, { debug: true });
            })
            .catch((err: any) => {
                setCurrentCallState(CallState.ERROR);
            });

        device
            .on("ready", () => {
                setDevice(device);
                setCurrentCallState(CallState.READY);
            })
            .on("connect", () => {
                setDevice(device);
                setCurrentCallState(CallState.ON_CALL);
            })
            .on("disconnect", () => {
                setCurrentCallState(CallState.READY);
            })
            .on("cancel", () => {
                setCurrentCallState(CallState.READY);
            })
            .on("error", () => {
                setCurrentCallState(CallState.ERROR);
            });
    }, [setCurrentCallState, setDevice]);

    const handleCall = () => {
        device.connect({ number: phoneNumber });
    };

    const handleHangup = () => {
        device.disconnectAll();
    };

    return (
        <div>
          <div>{currentCallState}</div>
          {currentCallState === CallState.READY ? (
            <button onClick={handleCall}>Call</button>
          ) : currentCallState === CallState.ON_CALL ? (
            <button onClick={handleHangup}>Hangup</button>
          ) : (
            "Connecting"
          )}
        </div>
      );
    };
    
export default Dialer;



