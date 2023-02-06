import React from 'react';
import { useState, useEffect } from 'react';
import {Button, Container, Overlay, Text, Title} from '@mantine/core';
import './App.css';
import { channels } from './constants';
import { useStyles } from "./mantine";
import { LanguagePicker } from "./languagePicker";
import { useTranslation } from "react-i18next";
import {} from "./locale"

const greet = "You can start now, Electron";
window.ipcRenderer.send(channels.GET_GREET, { greet });

function versionOS(){
    const ver = window.osType.current();
    if (ver === 'win32') return "Windows"
    else if (ver === 'linux') return "Linux"
    else if (ver === 'darwin') return "MacOS"
    else if (ver === 'freebsd') return "FreeBSD"
    else if (ver === 'openbsd') return "OpenBSD"
    else if (ver === 'sunos') return "SunOS"
    else if (ver === 'aix') return "AIX"
    else return "¯\\_(ツ)_/¯"
}

function App() {
    const { t } = useTranslation();
    const [localIP, setLocalIP] = useState("");
    useEffect(() => {
        window.ipcRenderer.on(channels.GET_IP, (arg: any) => {
            setLocalIP(arg)
        });
    });
    const [allIP, setAllIP] = useState("");
    useEffect(() => {
        window.ipcRenderer.on(channels.GET_ALL, (arg: any) => {
            setAllIP(arg)
        });
    });

    const { classes } = useStyles();
    return (
        <div className={classes.wrapper}>
            <Overlay color="#000" opacity={0.65} zIndex={1} />
            <Button
                className={classes.closeButt}
                color="red"
                radius="xs"
                size="xl"
                compact
                onClick={() => {
                    window.ipcRenderer.send(channels.GOOD_BYE, { greet });
                }
                }
            >
                X
            </Button>
            <div className={classes.inner}>
                <Title className={classes.title}>
                    {t('stringLocalIP')} {' '}
                    <Text component="span" inherit className={classes.highlight}>
                        {localIP}
                    </Text>
                </Title>
                <Container size={640}>
                    <Text size="lg" className={classes.description}>
                        {t('stringAllIP')}<br></br>
                        <Text component="span" inherit className={classes.highlight}>
                            {allIP}
                        </Text>
                    </Text>
                </Container>
                <Container size={640}>
                    <Text size="lg" className={classes.description}>
                        {t('stringVersionOS')}
                        <Text component="span" inherit className={classes.highlight}>
                            {versionOS()}
                        </Text>
                    </Text>
                </Container>
                <div className={classes.controls}>
                    <LanguagePicker></LanguagePicker>
                </div>
            </div>
        </div>
  );
}

export default App;
