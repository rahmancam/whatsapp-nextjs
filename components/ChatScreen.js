import styled from "styled-components";
import { auth, db } from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore"
import { InsertEmoticon } from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import { useState } from "react";
import firebase from "firebase";
import Message from './Message';
import getRecepientEmail from "../helpers/getRecepientEmail";

function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState('');

    const [messageSnapshot] = useCollection(
        db.collection('chats').
            doc(router.query.id).
            collection('messages').
            orderBy('timestamp', 'asc'));

    const showMessages = () => {
        if (messageSnapshot) {
            return messageSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return messages ? JSON.parse(messages).map(message => (
                <Message key={message.id}
                    user={message.user}
                    message={message} />
            )) : null;
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('users').doc(user.uid).
            set({
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });

        setInput('');
    };

    const recepEmail = getRecepientEmail(chat.users, user);
    return (
        <Container>
            <Header>
                <Avatar />

                <HeaderInfo>
                    <h3>{recepEmail}</h3>
                    <p>Last seen..</p>
                </HeaderInfo>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden type="submit" disabled={!input} onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 1px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    position: sticky;
    bottom: 0;
    padding: 10px;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    bottom: 0;
    margin: 0px 15px;
    background-color: whitesmoke;
`;