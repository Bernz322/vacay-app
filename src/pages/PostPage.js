import React, { useState, useEffect } from 'react'
import { useMantineTheme, createStyles, Paper, Container, Select, Text, TextInput, NumberInput, Textarea, CheckboxGroup, Checkbox, Group, Button, Image, LoadingOverlay } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Check, Photo, Upload, X } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux'
import Helmet from 'react-helmet'
import { useNavigate } from 'react-router-dom';

import { createListing, listingReset } from "../features/listing/listingSlice"
import { reservationReset } from '../features/reservation/reservationSlice';
import { MapBox } from '../components';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "calc(100vh - 151px)",
        paddingBottom: 20,
        paddingTop: 70,
    },
    filter: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 0,
        marginTop: 30,
        [theme.fn.smallerThan('md')]: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
        },
        [theme.fn.smallerThan('sm')]: {
            marginTop: 30,
        },
    },
    h1: {
        marginBottom: 0,
        color: theme.colorScheme === 'dark' ? theme.colors.cyan[4] : theme.colors.blue[6],
    },
    h2: {
        marginBottom: 20,
        color: theme.colorScheme === 'dark' ? theme.colors.cyan[4] : theme.colors.blue[6],
        fontSize: theme.fontSizes.md
    },
    form: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        [theme.fn.smallerThan('md')]: {
            width: '100%',
            flexDirection: "column",
        },
    },
    divider: {
        margin: 0,
        flex: 6,
        [theme.fn.smallerThan('md')]: {
            width: '100%',
            padding: 0,
        },
    },
    flexInputs: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: '100%',
        [theme.fn.smallerThan('md')]: {
            flexDirection: "column",
            width: '100%',
        },
    },
    disabled: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
        cursor: 'not-allowed',

        '& *': {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
        },
    },
    disabledButton: {
        '& *': {
            color: theme.colorScheme === 'dark' ? theme.colors.blue[3] : theme.colors.blue[5],
        },
    },
}))

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({ status, ...props }) {
    if (status.accepted) {
        console.log("accepted");
        return <Upload {...props} />;
    }

    if (status.rejected) {
        console.log("rejected");
        return <X {...props} />;
    }
    return <Photo {...props} />;
}

export const dropzoneChildren = (status, imgArray, theme, classes) => (
    <Group position="center" spacing="lg" style={{ minHeight: 220, pointerEvents: 'none' }}>
        {imgArray ?
            imgArray.map((img, index) => {
                return (
                    <Image height={80} width={80} src={img} key={index} />
                )
            })
            :
            <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
        }
        <div>
            <Text size="xl" inline>
                Upload images of your listing. Max of 3 images only
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                Drag&apos;n&apos;drop image here to upload. We can accept only <i>.jpeg,.gif.png</i> files that
                are less than 3mb in size
            </Text>
        </div>
    </Group >
);


export default function PostPage() {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isListingError, isListingLoading, messagesListing } = useSelector(state => state.listing);
    const { user } = useSelector(state => state.auth);
    const [imgArray, setImgArray] = useState(JSON.parse(localStorage.getItem("images")) || [])    // Put in local storage in case listing form is not submitted
    const [imgUploading, setImgUploading] = useState(false)
    const [newPin, setNewPin] = useState(null);
    const [listingData, setListingData] = useState({
        room_name: "",
        room_type: "",
        total_occupancy: 0,
        total_bedrooms: 0,
        total_bathrooms: 0,
        summary: "",
        address: "",
        city: "",
        province: "",
        has_tv: "",
        has_kitchen: false,
        has_air_con: false,
        has_heating: false,
        has_internet: false,
        price: 0,
    })

    const isEmpty = listingData.room_type === "" || listingData.room_name === "" || listingData.total_occupancy === 0 || listingData.total_bedrooms === 0 || listingData.summary === "" || listingData.address === "" || listingData.city === "" || listingData.province === "" || listingData.price === undefined || listingData.price === 0 || imgArray.length === 0

    const handleSubmit = () => {
        if (isEmpty) return showNotification({
            title: 'Please fill in required fields',
            message: 'All fields are required including image.',
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })

        const data = {
            ...listingData,
            room_image: JSON.stringify(imgArray.map((imgUrl) => imgUrl)),
            latitude: newPin?.latitude,
            longitude: newPin?.longitude
        }

        dispatch(createListing(data))

        setNewPin()
        // navigate('/listings')
    }

    const uploadImage = (img) => {
        if (imgArray.length > 2) return showNotification({
            title: 'You can only upload 3 images',
            message: 'Sorry but we only allow max upload of 3 images',
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })

        setImgUploading(true)
        const data = new FormData()
        data.append("file", img)
        data.append("upload_preset", "tsismis-chat-app")

        data.append("cloud_name", "jeffbdev")
        fetch("https://api.cloudinary.com/v1_1/jeffbdev/image/upload", {
            method: "POST",
            body: data
        }).then((res) => res.json())
            .then((data) => {
                const url = data.url.toString()
                setImgArray([...imgArray, url])
                localStorage.setItem("images", JSON.stringify([...imgArray, url]))
                setImgUploading(false)
            })
            .catch((err => {
                console.log(err)
                setImgUploading(false)
            }))
    }

    useEffect(() => {
        dispatch(listingReset())
        dispatch(reservationReset())

        setListingData({ ...listingData, room_image: imgArray })
    }, [imgArray]);

    return (
        <Paper radius={0} className={classes.paper}>
            <Helmet>
                <title>Create Listing</title>
            </Helmet>
            <Container size="xl">
                <div style={{ textAlign: "center" }}>
                    <h1 className={classes.h1}>Become a host for free</h1>
                    <p>No matter how big or small your home or room you have to share, you'll still decide its nightly prices. List that now!</p>
                </div>
                <Container size="xl" className={classes.filter}>
                    <h2 className={classes.h2}>Provide the details of your listing</h2>
                    <div className={classes.form} style={{ alignItems: 'flex-start' }}>
                        <Container className={classes.divider} style={{ paddingLeft: '0' }}>
                            <LoadingOverlay visible={isListingLoading} overlayOpacity={0.3} overlayColor="#c5c5c5" />
                            <div className={classes.flexInputs}>
                                <TextInput
                                    placeholder="Vacay Hotel"
                                    label="Name"
                                    required
                                    onChange={(e) => setListingData({ ...listingData, room_name: e.target.value })}
                                    style={{ width: '100%', margin: '0 5px' }}
                                />
                                <Select
                                    label="Choose type"
                                    data={[
                                        { value: 'House', label: 'House' },
                                        { value: 'Apartment', label: 'Apartment' },
                                        { value: 'Room', label: 'Room' },
                                    ]}
                                    placeholder="Pick listing type"
                                    clearable
                                    onChange={(data) => setListingData({ ...listingData, room_type: data })}
                                    required
                                    style={{ width: '100%', margin: '0 5px' }}
                                />
                            </div>
                            <div className={classes.flexInputs}>
                                <NumberInput onChange={(val) => setListingData({ ...listingData, total_occupancy: val })} hideControls required label="Total Occupancy" placeholder="Suitable for No. of people" style={{ width: '100%', }} />
                                <NumberInput onChange={(val) => setListingData({ ...listingData, total_bedrooms: val })} hideControls required label="Total Bedrooms" placeholder="No. of beds" style={{ width: '100%', margin: '0 5px' }} />
                                <NumberInput onChange={(val) => setListingData({ ...listingData, total_bathrooms: val })} hideControls required label="Total Bathrooms" placeholder="Enter '0' if none" style={{ width: '100%', }} />
                            </div>
                            <Textarea
                                placeholder="Talk anything or specific details about your listing to encourage customers."
                                label="Give some details regarding the listing"
                                required
                                minRows={2}
                                maxRows={4}
                                onChange={(e) => setListingData({ ...listingData, summary: e.target.value })}
                            />
                            <Textarea
                                placeholder="E.g. House Number, Street Name, Barangay, Postal code"
                                label="Give the complete address of your listing"
                                required
                                minRows={2}
                                maxRows={4}
                                onChange={(e) => setListingData({ ...listingData, address: e.target.value })}
                            />
                            <div className={classes.flexInputs}>
                                <TextInput
                                    placeholder="City Name"
                                    label="City"
                                    required
                                    onChange={(e) => setListingData({ ...listingData, city: e.target.value })}
                                    style={{ width: '100%', margin: '0 5px' }}
                                />
                                <Select
                                    label="Choose Province"
                                    data={[
                                        { value: 'Agusan del Norte', label: 'Agusan del Norte' },
                                        { value: 'Agusan del Sur', label: 'Agusan del Sur' },
                                        { value: 'Dinagat Islands', label: 'Dinagat Islands' },
                                        { value: 'Surigao del Norte', label: 'Surigao del Norte' },
                                        { value: 'Surigao del Sur', label: 'Surigao del Sur' },
                                        { value: 'Butuan', label: 'Butuan' },
                                    ]}
                                    placeholder="Provine of your listing"
                                    clearable
                                    onChange={(data) => setListingData({ ...listingData, province: data })}
                                    required
                                    style={{ width: '100%', margin: '0 5px' }}
                                />
                                <NumberInput onChange={(val) => setListingData({ ...listingData, price: val })} hideControls required label="Price per night" placeholder="Per night rates only (&#8369;)" style={{ width: '100%', }} />
                            </div>
                            <CheckboxGroup
                                defaultValue={['react']}
                                label="Check amenities if they are available to your listing"
                                description="Just leave them if your listing doesn't have any."
                            >
                                <Checkbox value='tv' label="TV" onClick={(e) => setListingData({ ...listingData, has_tv: e.target.checked })} />
                                <Checkbox value='kitchen' label="Kitchen" onClick={(e) => setListingData({ ...listingData, has_kitchen: e.target.checked })} />
                                <Checkbox value='aircon' label="Aircon" onClick={(e) => setListingData({ ...listingData, has_air_con: e.target.checked })} />
                                <Checkbox value='heater' label="Heater" onClick={(e) => setListingData({ ...listingData, has_heating: e.target.checked })} />
                                <Checkbox value='internet' label="Internet" onClick={(e) => setListingData({ ...listingData, has_internet: e.target.checked })} />
                            </CheckboxGroup>
                            <h2 className={classes.h2}>Select images of your listing (Max of 3)</h2>
                            <Dropzone
                                onDrop={(files) => uploadImage(files[0])}
                                onReject={(files) => showNotification({
                                    title: 'Uploading image failed',
                                    message: 'Something went wrong while uploading your image. It might be because the image size is more than 3 mb, not supported, or you are not connected to the internet.',
                                    autoClose: 8000,
                                    color: 'red',
                                    icon: <X />
                                })}
                                maxSize={3 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                loading={imgUploading}
                                className={!user?.token && classes.disabled}
                                disabled={!user?.token}
                            >
                                {(status) => dropzoneChildren(status, imgArray, theme, classes)}
                            </Dropzone>
                        </Container>
                        <Container className={classes.divider} style={{ paddingRight: '0' }}>
                            <Container mt='lg' pl={0} pr={0}>
                                <MapBox height={666.53} newPin={newPin} setNewPin={setNewPin} />
                            </Container>
                            <Button variant="filled" mt='lg' style={{ width: '100%', }} onClick={handleSubmit} disabled={!user?.token} className={!user?.token && classes.disabledButton}>
                                {!user?.token ? "Login to start hosting" : "Submit listing"}
                            </Button>
                        </Container>
                    </div>
                </Container>
            </Container>
        </Paper>
    )
}
