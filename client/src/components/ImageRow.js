import Row from 'react-bootstrap/Row'
import {ImageCard} from './ImageCard'

export const ImageRow = props => {
    return (
        <Row>
            {props.retrievedImages && props.retrievedImages.map(image => (
                <ImageCard 
                    key={image.id} 
                    image={image}
                    handleShowModal={props.handleShowModal}>
                </ImageCard>
            ))}
        </Row>
    )
}