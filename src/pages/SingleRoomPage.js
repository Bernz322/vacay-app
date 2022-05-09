import React, { useState, useEffect } from 'react';
import { createStyles, Text, Button, Container, Group, Paper, Grid, Image, SimpleGrid, Center, Avatar, Card, NumberInput, Loader, LoadingOverlay, Title } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useParams, useNavigate, Link } from "react-router-dom";
import dayjs from 'dayjs';
import { At, CurrencyDollar, DeviceTv, LivePhoto, Location, PhoneCall, Snowflake, ToolsKitchen, Wifi, X } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import Helmet from 'react-helmet'

import { fetchSingleListing, deleteListing } from '../features/listing/listingSlice'
import { checkAvailability, createReservation, fetchAllRoomReservation } from '../features/reservation/reservationSlice'
import { EmptyNotice, MapBox, ReviewCard } from '../components';
import { money, reviewCount, roomRating } from '../utilities';
import { userReset } from '../features/user/userSlice';
import { reservationReset } from '../features/reservation/reservationSlice';
import { Page404, PageLoader } from '.'

const useStyles = createStyles((theme) => ({
    main: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        [theme.fn.smallerThan('md')]: {
            flexDirection: "column",
        },
    },

    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "calc(100vh - 151px)"
    },

    divider: {
        margin: 0,
        flex: 6,
        marginTop: 15,
        height: '100%',
        alignItems: 'flex-start',
        [theme.fn.smallerThan('md')]: {
            width: '100%',
            padding: 0,
            marginTop: 30,
        },
    },

    left: {
        margin: 0,
        flex: 8,
        height: '100%',
        [theme.fn.smallerThan('md')]: {
            width: '100%',
            padding: 0,
            marginTop: 30,
        },
    },

    h2: {
        marginBottom: 15,
        textAlign: 'center',
        [theme.fn.smallerThan('md')]: {
            fontSize: theme.fontSizes.xl
        },
        [theme.fn.smallerThan('sm')]: {
            fontSize: theme.fontSizes.md

        },
    },

    title: {
        [theme.fn.smallerThan('sm')]: {
            textAlign: 'center',
            justifyContent: 'center'
        },
    },

    paymentTitle: {
        [theme.fn.smallerThan('sm')]: {
            textAlign: 'center',
            justifyContent: 'space-between'
        },
    },
    roomDeets: {
        display: "flex",
        [theme.fn.smallerThan('sm')]: {
            textAlign: 'center',
            justifyContent: 'center'
        },
    },

    right: {
        alignItems: 'flex-start',
        margin: 0,
        flex: 4,
        height: 500,
        [theme.fn.smallerThan('md')]: {
            width: '100%',
            padding: 0,
            marginTop: 30,
        },
    },
    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[3]}`,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[3]}`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },

    section1: {
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[3]}`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },

    section2: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[3]}`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    },

    name: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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
}));

export default function SingleRoomPage() {
    const dispatch = useDispatch()
    const { listing, isListingError, isListingSuccess, isListingLoading, messagesListing } = useSelector(state => state.listing)
    const { user } = useSelector(state => state.auth)
    const { availability, roomReservations, isReserveLoading, isReserveSuccess } = useSelector(state => state.reservation)

    const { classes } = useStyles();
    const { id } = useParams()
    const navigate = useNavigate()

    const [date, setDate] = useState([]);
    const [totalGuest, setTotalGuest] = useState(1);
    const start_date = dayjs(date[0]).format('YYYY/MM/DD')
    const end_date = dayjs(date[1]).format('YYYY/MM/DD')
    const numberofNights = dayjs(start_date).diff(end_date, 'days')
    const costPerNight = listing?.price
    const totalCosts = (-numberofNights + 1) * costPerNight
    const isListingOwner = user?.id === listing?.User?.id && true

    const [selectedImage, setselectedImage] = useState();
    const [availabilityCheck, setAvailabilityCheck] = useState(false);
    const [reservationSuccess, setReservationSuccess] = useState(false);

    const handleBook = () => {
        const data = {
            startDate: start_date,
            endDate: end_date,
            totalGuest,
            price: costPerNight,
            total: totalCosts,
            roomId: id
        }

        if (date.length <= 0) {
            showNotification({
                title: 'Please fill in fields',
                message: "Missing dates",
                autoclose: 4000,
                color: "red"
            })
            return
        }

        dispatch(createReservation(data));

        if (isReserveSuccess) {
            showNotification({
                title: 'Reservation created!',
                message: 'You can manage your reservations in your profile menu.',
                autoclose: 4000,
                color: "green"
            })
            setDate([])
            setTotalGuest(1)
            setAvailabilityCheck(false)
            setReservationSuccess(true)
            dispatch(reservationReset())
        }
    }

    const handleCheckAvailability = async () => {
        setReservationSuccess(false)
        const data = {
            room_id: id,
            startDate: start_date,
            endDate: end_date,
        }

        if ((date.length <= 0) || (date[0] === null) || (date[1] === null)) {
            showNotification({
                title: 'Please fill in fields',
                message: "Missing dates",
                autoclose: 4000,
                color: "red"
            })
            return
        }

        const { payload } = await dispatch(checkAvailability(data));

        if (payload === true) {
            setAvailabilityCheck(payload)
            showNotification({
                title: 'Listing is available in your given date.',
                message: "Reserve the place now!",
                autoclose: 4000,
                color: "green"
            })
        } else {
            setAvailabilityCheck(payload)
            showNotification({
                title: 'Listing is not available in your given date.',
                message: "Try another date.",
                autoclose: 4000,
                color: "red"
            })
        }
    }

    const handleDelete = () => {
        // Double insurance incase delete button is shown to other users.
        if (!isListingOwner) {
            showNotification({
                title: 'Deleting failed!',
                message: messagesListing || 'You are not the owner of the post!',
                autoclose: 4000,
                color: "red"
            })
        }

        dispatch(deleteListing(id));

        if (isListingSuccess) {
            showNotification({
                title: 'Post deleted',
                message: 'Post deleted successfully',
                autoclose: 4000,
                color: "green"
            })
            navigate('/listings')
        }
    }

    const handleDatePicker = (e) => {
        setDate(e)
        setAvailabilityCheck(false)
    }

    useEffect(() => {
        dispatch(userReset())

        dispatch(fetchSingleListing(id))
        dispatch(fetchAllRoomReservation(id))
    }, [dispatch, isListingError, messagesListing, id, availability]);

    return (
        <>
            {!isListingLoading && listing ?
                Object.keys(listing).length !== 0 ?
                    <Paper radius={0} className={classes.paper}>
                        <Helmet>
                            <title>{listing?.room_name}</title>
                        </Helmet>
                        <LoadingOverlay visible={isListingLoading} overlayOpacity={0.3} overlayColor="#c5c5c5" />
                        <Container size="xl" style={{ paddingTop: 50, paddingBottom: 10 }}>
                            <div style={{ textAlign: "left" }}>
                                <h1 mb='md'>{listing?.room_name}</h1>
                                <div style={{ display: "flex" }}>
                                    <Text size="sm" color="dimmed">⭐ {roomRating(roomReservations).toFixed(2)} •</Text>
                                    <Text size="sm" color="dimmed" style={{ marginLeft: 4, marginRight: 4 }}>{reviewCount(roomReservations)} reviews •</Text>
                                    <Text size="sm" color="dimmed">{listing?.province}</Text>
                                </div>
                            </div>
                            <Container className={classes.main} size='xl' style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}>
                                <Container className={classes.divider} style={{ paddingLeft: '0', alignItems: 'flex-start' }}>
                                    <SimpleGrid cols={1} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                        {selectedImage ?
                                            <Image height={400} radius="md" src={selectedImage} alt="Room image" />
                                            :
                                            <Image height={400} radius="md" src={listing?.room_image?.[0]} alt="Room image" />
                                        }
                                        <Grid>
                                            {listing?.room_image?.map((image, index) => {
                                                return (
                                                    <Grid.Col span={4} key={index}>
                                                        {/* <Skeleton height={150} radius="md" animate={false} /> */}
                                                        <Image height={120} radius="md" src={image} alt="Room image" onClick={() => setselectedImage(image)} style={{ cursor: 'pointer' }} />
                                                    </Grid.Col>
                                                )
                                            })}
                                        </Grid>
                                    </SimpleGrid>
                                </Container>
                                <Container className={classes.divider} style={{ paddingRight: 0 }}>
                                    {!listing.latitude || !listing.longitude ?
                                        <Paper withBorder sx={{ height: 535, padding: 25 }}>
                                            <Title sx={{ textAlign: 'center', color: '#74c0fc' }}>This listing has no map</Title>
                                            <Text sx={{ textAlign: 'left' }} size="sm" mt='md'>The owner has not specified a map on this listing.</Text>
                                            <Text sx={{ textAlign: 'left' }} size="sm" mt='md'>You can still check where this listing is located in the address below</Text>
                                        </Paper>
                                        :
                                        <Container pl={0} pr={0}>
                                            <MapBox display={true} lat={listing.latitude} long={listing.longitude} zoom={14} />
                                        </Container>
                                    }
                                </Container>
                            </Container>
                            <Container className={classes.main} size='xl' style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <Container className={classes.left} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <Group position="apart" className={classes.title}>
                                        <Center>
                                            <div style={{ textAlign: "left" }}>
                                                <h2 className={classes.h2}>{listing?.room_type} hosted by {listing?.User?.name}</h2>
                                                <div className={classes.roomDeets}>
                                                    <Text size="sm" color="dimmed">{listing?.total_occupancy} guest/s •</Text>
                                                    <Text size="sm" color="dimmed" style={{ marginLeft: 4, marginRight: 4 }}>{listing?.total_bedrooms} bedroom/s •</Text>
                                                    <Text size="sm" color="dimmed">{listing?.total_bathrooms} bathroom/s</Text>
                                                </div>
                                            </div>
                                        </Center>
                                        <Center>
                                            <Link to={`/profile/${listing?.User?.id}`}>
                                                <Avatar src={listing?.User?.profile_image} size={60} radius="xl" mr="xs" />
                                            </Link>
                                        </Center>
                                    </Group>
                                    <Card.Section className={classes.section} mt="md" style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                        <Group mt="xs">
                                            <Location size={18} strokeWidth={2} color={'#4089bf'} />
                                            <div>
                                                <Text weight={500}>Address</Text>
                                                <Text size="xs" color="dimmed">
                                                    {listing?.address}
                                                </Text>
                                            </div>
                                        </Group>
                                        <Group mt="xs">
                                            <svg className="w-6 h-6" width='18' height='18' fill="none" stroke="#4089bf" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                            <div>
                                                <Text weight={500}>City</Text>
                                                <Text size="xs" color="dimmed">
                                                    {listing?.city} City
                                                </Text>
                                            </div>
                                        </Group>
                                    </Card.Section>
                                    <Card.Section className={classes.section2} style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                        <Text size="sm">
                                            {listing?.summary}
                                        </Text>
                                    </Card.Section>
                                    <Card.Section style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                        <Text weight={500} mb='md' size='xl'>Amenities</Text>
                                        <Grid justify={"space-around"}>
                                            {listing?.has_tv &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <DeviceTv size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Television</Text>
                                                    </Group>
                                                </Grid.Col>}
                                            {listing?.has_kitchen &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <ToolsKitchen size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Kitchen</Text>
                                                    </Group>
                                                </Grid.Col>}
                                            {listing?.has_air_con &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <Snowflake size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Air conditioning</Text>
                                                    </Group>
                                                </Grid.Col>}
                                            {listing?.has_heating &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <LivePhoto size={18} strokeWidth={3} color={'#bf4d40'} />
                                                        <Text weight={500} size='sm'>Heater</Text>
                                                    </Group>
                                                </Grid.Col>}
                                            {listing?.has_internet &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <Wifi size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Wifi</Text>
                                                    </Group>
                                                </Grid.Col>}
                                        </Grid>
                                    </Card.Section>
                                </Container>
                                <Container className={classes.right} style={{ alignItems: 'flex-start', }}>
                                    <Paper p='lg' ml='xl' mr='xl' mt='md' shadow="xl" radius="lg" withBorder>
                                        <Group position="apart" className={classes.paymentTitle} mb='md'>
                                            <div style={{ textAlign: "left", display: "flex", alignItems: 'center' }}>
                                                <Text weight={500} size='xl'>&#8369;{money(listing?.price)}</Text>
                                                <Text weight={500} size='md' color='dimmed' ml='xxs'>/night</Text>
                                            </div>
                                            <div style={{ display: "flex" }}>
                                                <Text weight={500} size='xs'>⭐ {roomRating(roomReservations).toFixed(2)} •</Text>
                                                <Text weight={500} ml='xxs' size='xs'>{reviewCount(roomReservations)} reviews</Text>
                                            </div>
                                        </Group>
                                        <DateRangePicker label="Reserve Apartment" placeholder="Check-in - Check-out" value={date} onChange={(e) => handleDatePicker(e)} required
                                            minDate={dayjs(new Date()).startOf('day').toDate()}
                                            maxDate={dayjs(new Date()).endOf('year').toDate()}
                                        />
                                        <NumberInput mb='sm' mt='sm' onChange={(val) => setTotalGuest(val)} value={totalGuest} hideControls required label="Total Guests" placeholder="1" style={{ width: '100%', }} />
                                        {availabilityCheck ?
                                            <Button radius="md" style={{ flex: 1, width: '100%' }} onClick={handleBook} disabled={!user?.token}
                                                className={!user?.token && classes.disabledButton}>
                                                {isReserveLoading ? <Loader color="white" size="sm" /> : !user?.token ? "Login to reserve this place" : "Reserve this place"}
                                            </Button>
                                            :
                                            <Button radius="md" color="cyan" style={{ flex: 1, width: '100%' }} onClick={handleCheckAvailability}>
                                                {isReserveLoading ? <Loader color="white" size="sm" /> : "Check for availability"}
                                            </Button>
                                        }
                                        {reservationSuccess &&
                                            <>
                                                <Text weight={500} size='sm' mt="lg" align="center" color="green">You have successfully reserved this place.</Text>
                                                <Text weight={500} size='sm' align="left">Reservations can be managed in your profile menu</Text>
                                            </>
                                        }
                                        {(date.length > 0 && date[1])
                                            &&
                                            <Card.Section className={classes.section1} mt='sm' pb={0} pr={0} pl={0}>
                                                <Group position="apart" className={classes.paymentTitle} mt='sm'>
                                                    <Text weight={500} size='sm'>Total</Text>
                                                    <Text weight={500} size='sm'>&#8369;{money(totalCosts)}</Text>
                                                </Group>
                                            </Card.Section>
                                        }
                                    </Paper>
                                </Container>
                            </Container>
                            <Card.Section className={classes.section} style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                <div style={{ display: "flex" }}>
                                    <Text weight={500} mb='md' size='xl'>⭐ {roomRating(roomReservations).toFixed(2)} •</Text>
                                    <Text weight={500} ml='xxs' size='xl'>{reviewCount(roomReservations)} reviews</Text>
                                </div>
                                <Grid justify={"left"} gutter="xl">
                                    {roomReservations?.length <= 0 || roomReservations?.filter(reservation => reservation?.Review).length <= 0 ?
                                        <EmptyNotice review="review" />
                                        : roomReservations
                                            ?.filter(reservation => reservation.Review)
                                            ?.map(reservation => {
                                                return <ReviewCard key={reservation.id} reservation={reservation} />
                                            })
                                    }
                                </Grid>
                            </Card.Section>
                            <Card.Section pr={0} pl={0} pb={20} pt={40}>
                                <Group noWrap>
                                    <Link to={`/profile/${listing?.User?.id}`}><Avatar src={listing?.User?.profile_image} size={94} radius="md" /></Link>
                                    <div>
                                        <Text size="xs" sx={{ textTransform: 'uppercase' }} weight={700} color="dimmed">
                                            Hosted by
                                        </Text>

                                        <Link to={`/profile/${listing?.User?.id}`}><Text size="lg" weight={500} className={classes.name}>
                                            {listing?.User?.name}
                                        </Text></Link>

                                        <Group noWrap spacing={10} mt={3}>
                                            <At size={16} className={classes.icon} />
                                            <Text size="xs" color="dimmed">
                                                {listing?.User?.email}
                                            </Text>
                                        </Group>

                                        <Group noWrap spacing={10} mt={5}>
                                            <PhoneCall size={16} className={classes.icon} />
                                            <Text size="xs" color="dimmed">
                                                {listing?.User?.phone_number}
                                            </Text>
                                        </Group>
                                    </div>
                                </Group>
                            </Card.Section>
                            <Group mt="xs" position="left" pb={0}>
                                <CurrencyDollar size={18} strokeWidth={3} color={'#bf4d40'} />
                                <Text weight={500} size='sm' color='dimmed'>
                                    Payments are done in person. Do not send payments online.
                                </Text>
                            </Group>
                            <Group mt="xs" position="left" mb={15}>
                                <X size={18} strokeWidth={3} color={'#bf4d40'} />
                                <Text weight={500} size='sm' color='dimmed'>
                                    No cancellation policy
                                </Text>
                            </Group>

                            {user?.id === listing?.User?.id &&
                                <Button mb={25} color='red' onClick={handleDelete}>Delete this listing</Button>
                            }
                        </Container>
                    </Paper >
                    :
                    <Page404 />
                :
                <PageLoader />
            }

        </>
    );
}