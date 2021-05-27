import { Circle } from 'better-react-spinkit';

function Loading() {
    return (
        <center style={{ 'display': 'grid', 'place-items': 'center', 'height': '100vh' }}>
            <div>
                <img style={{ 'height': '200px', 'margin-bottom': '10px' }} src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" alt="" />
                <Circle color="#3CBC28" size={70} />
            </div>
        </center>
    )
}

export default Loading