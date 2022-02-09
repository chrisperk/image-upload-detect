import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'

import { UploadForm } from '../components/UploadForm'
import { ImageRow } from '../components/ImageRow'
import { ImageModal } from '../components/ImageModal'

export const LandingContainer = props => {
    const [imagesLoading, setImagesLoading] = useState()
    const [retrievedImages, setRetrievedImages] = useState()
    const [retrievedImageById, setRetrievedImageById] = useState()
    const [postedImage, setPostedImage] = useState()
    const [labelInput, setLabelInput] = useState()
    const [enableObjectDetection, setEnableObjectDetection] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleCloseModal = () => setShowModal(false)
    const handleShowModal = id => {
        setShowModal(true)
        getImageById(id)
    }

    useEffect(() => {
        setImagesLoading(true)
        getImages()
    }, [])

    useEffect(() => {
        if (postedImage) viewerRef.current.src = postedImage.filepath
    }, [postedImage])

     useEffect(() => {
        if (retrievedImageById && imageModalRef.current) imageModalRef.current.src = retrievedImageById.filepath
    }, [retrievedImageById])

    const imageUploadRef = useRef()
    const viewerRef = useRef()
    const imageModalRef = useRef()

    const getImages = () => {
        setImagesLoading(true)
        fetch("/images")
            .then((res) => res.json())
            .then((data) => {
                setRetrievedImages(data)
                setImagesLoading(false)
            })
    }

    const getImageById = id => {
        fetch(`/images/${id.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setRetrievedImageById(data)
            })
    }

    const handleUploadSubmit = () => {
        const file = imageUploadRef.current.files[0]

        let fileData = new FormData()
        fileData.append('image', file)
        if (labelInput) fileData.append('label', labelInput)
        fileData.append('enableObjectDetection', enableObjectDetection)

        uploadImage(fileData)
    }

    const uploadImage = fileData => {
        fetch('/images', {
            method: 'POST',
            headers: {},
            body: fileData
        })
            .then(response => response.json())
            .then(data => {
                setPostedImage(data)
                getImages()
            })
    }

    const handleLabelInput = ({target}) => setLabelInput(target.value)

    const handleObjectDetectionInput = () => setEnableObjectDetection(!enableObjectDetection)

    return (
        <Container fluid>
            <UploadForm
                imageUploadRef={imageUploadRef}
                viewerRef={viewerRef}
                postedImage={postedImage}
                handleUploadSubmit={handleUploadSubmit}
                handleLabelInput={handleLabelInput}
                handleObjectDetectionInput={handleObjectDetectionInput}
            />
            {imagesLoading ? <p>Loading...</p> : <ImageRow retrievedImages={retrievedImages} handleShowModal={handleShowModal} />}
            <ImageModal imageModalRef={imageModalRef} show={showModal} handleCloseModal={handleCloseModal} retrievedImage={retrievedImageById} />
        </Container>
    )
}