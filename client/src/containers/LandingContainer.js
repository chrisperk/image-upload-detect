import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'

import { UploadForm } from '../components/UploadForm'
import { ImageRow } from '../components/ImageRow'
import { ImageModal } from '../components/ImageModal'

export const LandingContainer = props => {
    const [imagesLoading, setImagesLoading] = useState()
    const [retrievedImages, setRetrievedImages] = useState()
    const [retrievedImageById, setRetrievedImageById] = useState()
    const [lastFilters, setLastFilters] = useState()
    const [filteredImages, setFilteredImages] = useState()
    const [retrievedImagesView, setRetrievedImagesView] = useState()
    const [postedImage, setPostedImage] = useState()
    const [labelInput, setLabelInput] = useState()
    const [enableObjectDetection, setEnableObjectDetection] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [filtersInput, setFiltersInput] = useState()

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
        fetch('/images')
            .then((res) => res.json())
            .then((data) => {
                setRetrievedImages(data)
                setImagesLoading(false)
            })
    }

    const getFilteredImages = filters => {
        setLastFilters(filters)
        setImagesLoading(true)

        fetch(`/images?objects=${filters.join(',')}`)
            .then((res) => res.json())
            .then((data) => {
                setFilteredImages(data)
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

    const handleCloseModal = () => setShowModal(false)
    const handleShowModal = id => {
        setShowModal(true)
        getImageById(id)
    }

    const handleLabelInput = ({target}) => setLabelInput(target.value)
    const handleObjectDetectionInput = () => setEnableObjectDetection(!enableObjectDetection)

    const handleSelectAllImages = () => {
        setRetrievedImagesView('allImagesOption')
        getImages()
    }

    const handleFiltersInput = ({target}) => setFiltersInput(target.value)
    const handleFiltersSubmit = () => {
        setRetrievedImagesView('filteredImagesOption')
        getFilteredImages(filtersInput.replace(/\s+/g, '').split(','))
    }

    const resetRetrievedImagesView = () => setRetrievedImagesView(null)

    return (
        <Container fluid>
            <UploadForm
                imageUploadRef={imageUploadRef}
                viewerRef={viewerRef}
                postedImage={postedImage}
                handleUploadSubmit={handleUploadSubmit}
                handleLabelInput={handleLabelInput}
                handleObjectDetectionInput={handleObjectDetectionInput} />
            <ImageRow 
                retrievedImages={retrievedImages} 
                filteredImages={filteredImages} 
                imagesLoading={imagesLoading}
                retrievedImagesView={retrievedImagesView}
                handleSelectAllImages={handleSelectAllImages}
                handleFiltersInput={handleFiltersInput}
                handleFiltersSubmit={handleFiltersSubmit}
                handleShowModal={handleShowModal}
                resetRetrievedImagesView={resetRetrievedImagesView} />
            <ImageModal 
                imageModalRef={imageModalRef} 
                show={showModal} 
                handleCloseModal={handleCloseModal} 
                retrievedImage={retrievedImageById} />
        </Container>
    )
}