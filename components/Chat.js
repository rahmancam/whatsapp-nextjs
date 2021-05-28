import { Avatar } from "@material-ui/core";
import styled from "styled-components";
import getRecepientEmail from '../helpers/getRecepientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore'

function Chat({ id, users }) {

    const [user] = useAuthState(auth);
    const recepientEmail = getRecepientEmail(users, user);
    const [recepientSnapshot] = useCollection(db.collection('users').where('email', '==', recepientEmail));

    const recepient = recepientSnapshot?.docs?.[0]?.data();
    return (
        <Container>
            {recepient ? (
                <UserAvatar src={recepient?.photoURL} />) :
                (<UserAvatar />)
            }
            <p>{recepientEmail}</p>
        </Container>
    )
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-wrap: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;
