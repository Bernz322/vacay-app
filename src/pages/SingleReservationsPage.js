import React, { useState, useEffect } from 'react';
import { createStyles, Text, Button, Container, Group, Paper, Skeleton, Grid, Image, SimpleGrid, Center, Avatar, Card, NumberInput, Textarea, Title, Loader } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';
import ReactStars from "react-rating-stars-component";
import { At, CurrencyDollar, DeviceTv, LivePhoto, Location, PhoneCall, Snowflake, ToolsKitchen, Wifi, X } from 'tabler-icons-react';
import { useSelector, useDispatch } from 'react-redux';
import Helmet from 'react-helmet'

import { fetchSingleReservation } from '../features/reservation/reservationSlice'
import { createReview } from '../features/review/reviewSlice'
import { EmptyNotice, ReviewCard } from '../components';
import { money } from '../utilities';
import { listingReset } from '../features/listing/listingSlice';
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

export default function SingleReservationsPage() {
    const { classes } = useStyles();
    const { id } = useParams()
    const dispatch = useDispatch();
    const { reservation, isReserveLoading } = useSelector(state => state.reservation)
    const { isReviewLoading, isReviewError, messageReview } = useSelector(state => state.review)
    const { user } = useSelector(state => state.auth)

    const date = [new Date(reservation?.reservation?.start_date), new Date(reservation?.reservation?.end_date)] || "";
    const start_date = dayjs(date[0]).format('YYYY/MM/DD')
    const end_date = dayjs(date[1]).format('YYYY/MM/DD')
    const numberofNights = dayjs(start_date).diff(end_date, 'days') || 0
    const [selectedImage, setselectedImage] = useState();
    const [comment, setComment] = useState();
    const [rating, setRating] = useState();
    const [rerender, setRerender] = useState(false);

    const handleReviewSubmit = () => {
        const reviewData = {
            reservationId: id,
            rating,
            comment
        }
        if (!comment || !rating) {
            showNotification({
                title: 'Missing fields',
                message: 'Please fill in all fields. We also do not accept 0 rating.',
                autoclose: 5000,
                color: "red"
            })
        }

        const payload = dispatch(createReview(reviewData))

        if (payload) {
            setRerender(!rerender)
            // window.location.reload()
        }

        if (isReviewError) {
            showNotification({
                title: 'Uhuh! Something went wrong while submitting your review',
                message: messageReview,
                autoclose: 4000,
                color: "red"
            })
        }
    }

    useEffect(() => {
        dispatch(listingReset())

        dispatch(fetchSingleReservation(id))
    }, [dispatch, id, rerender]);

    return (
        <>
            {(!isReserveLoading && reservation) ?
                (((reservation?.reservation?.User?.id === user?.id) === true) || user?.is_admin)
                    ?
                    <Paper radius={0} className={classes.paper}>
                        <Helmet>
                            <title>My Reservation </title>
                        </Helmet>
                        <Container size="xl" style={{ paddingTop: 50, paddingBottom: 10 }}>
                            <div style={{ textAlign: "left" }}>
                                <h1 mb='md'>{reservation?.reservation?.Room?.room_name}</h1>
                                <div style={{ display: "flex" }}>
                                    <Text size="sm" color="dimmed">Province of {reservation?.reservation?.Room?.province}</Text>
                                </div>
                            </div>
                            <Container className={classes.main} size='xl' style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}>
                                <Container className={classes.divider} style={{ paddingLeft: '0', alignItems: 'flex-start' }}>
                                    <SimpleGrid cols={1} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                        {selectedImage ?
                                            <Image height={400} radius="md" src={selectedImage} alt="Room image" />
                                            :
                                            <Image height={400} radius="md" src={reservation?.room_image?.[0]} alt="Room image" />
                                        }
                                        <Grid>
                                            {reservation?.room_image?.map((image, index) => {
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
                                    <Skeleton height={535} radius="md" animate={true} style={{ zIndex: 1 }} />
                                </Container>
                            </Container>
                            <Container className={classes.main} size='xl' style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <Container className={classes.left} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <Group position="apart" className={classes.title}>
                                        <Center>
                                            <div style={{ textAlign: "left" }}>
                                                <h2 className={classes.h2}>Apartment hosted by {reservation?.reservation?.Room?.User?.name}</h2>
                                                <div className={classes.roomDeets}>
                                                    <Text size="sm" color="dimmed">{reservation?.reservation?.Room?.total_occupancy} guests •</Text>
                                                    <Text size="sm" color="dimmed" style={{ marginLeft: 4, marginRight: 4 }}>{reservation?.reservation?.Room?.total_bedrooms} bedrooms •</Text>
                                                    <Text size="sm" color="dimmed">{reservation?.reservation?.Room?.total_bathrooms} bathroom</Text>
                                                </div>
                                            </div>
                                        </Center>
                                        <Center>
                                            <Avatar src={reservation?.reservation?.Room?.User?.profile_image} size={60} radius="xl" mr="xs" />
                                        </Center>
                                    </Group>
                                    <Card.Section className={classes.section} mt="md" style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                        <Group mt="xs">
                                            <Location size={18} strokeWidth={2} color={'#4089bf'} />
                                            <div>
                                                <Text weight={500}>Address</Text>
                                                <Text size="xs" color="dimmed">
                                                    {reservation?.reservation?.Room?.address}
                                                </Text>
                                            </div>
                                        </Group>
                                        <Group mt="xs">
                                            <svg className="w-6 h-6" width='18' height='18' fill="none" stroke="#4089bf" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                            <div>
                                                <Text weight={500}>City</Text>
                                                <Text size="xs" color="dimmed">
                                                    {reservation?.reservation?.Room?.city}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Card.Section>
                                    <Card.Section className={classes.section2} style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                        <Text size="sm">
                                            {reservation?.reservation?.Room?.summary}
                                        </Text>
                                    </Card.Section>
                                    <Card.Section style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                        <Text weight={500} mb='md' size='xl'>Amenities</Text>
                                        <Grid justify={"space-around"}>
                                            {reservation?.reservation?.Room?.has_tv &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <DeviceTv size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Television</Text>
                                                    </Group>
                                                </Grid.Col>
                                            }
                                            {reservation?.reservation?.Room?.has_kitchen &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <ToolsKitchen size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Kitchen</Text>
                                                    </Group>
                                                </Grid.Col>
                                            }
                                            {reservation?.reservation?.Room?.has_air_con &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <Snowflake size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Air conditioning</Text>
                                                    </Group>
                                                </Grid.Col>
                                            }
                                            {reservation?.reservation?.Room?.has_heating &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <LivePhoto size={18} strokeWidth={3} color={'#bf4d40'} />
                                                        <Text weight={500} size='sm'>Heater</Text>
                                                    </Group>
                                                </Grid.Col>
                                            }
                                            {reservation?.reservation?.Room?.has_internet &&
                                                <Grid.Col xs={6} lg={4}>
                                                    <Group mt="xs" position="center">
                                                        <Wifi size={18} strokeWidth={3} color={'#4089bf'} />
                                                        <Text weight={500} size='sm'>Wifi</Text>
                                                    </Group>
                                                </Grid.Col>
                                            }
                                        </Grid>
                                    </Card.Section>
                                </Container>
                                <Container className={classes.right} style={{ alignItems: 'flex-start', }}>
                                    <Paper p='lg' ml='xl' mr='xl' mt='md' shadow="xl" radius="lg" withBorder>
                                        <Group position="apart" className={classes.paymentTitle} mb='md'>
                                            <div style={{ textAlign: "left", display: "flex", alignItems: 'center' }}>
                                                <Text weight={500} size='xl'>&#8369;{money(reservation?.reservation?.Room?.price)}</Text>
                                                <Text weight={500} size='md' color='dimmed' ml='xxs'>/night</Text>
                                            </div>
                                            <Text weight={500} size='xs'>{reservation?.reservation?.guest_status ? "Visit us again!" : "See you soon!"}</Text>
                                        </Group>
                                        <DateRangePicker label="Your Reservation Date" placeholder="Check-in - Check-out" value={date} disabled className={classes.disabledButton}
                                            minDate={dayjs(new Date()).startOf('day').toDate()}
                                            maxDate={dayjs(new Date()).endOf('year').toDate()}
                                        />
                                        <NumberInput mb='sm' mt='sm' hideControls disabled label="Total Guests" placeholder={reservation?.reservation?.totalGuest} style={{ width: '100%', }} className={classes.disabledButton} />
                                        <Button radius="md" style={{ flex: 1, width: '100%' }} color='red' disabled className={classes.disabledButton}>
                                            No cancellation policy
                                        </Button>
                                        <Card.Section className={classes.section1} mt='sm' pb={0} pr={0} pl={0}>
                                            <Group position="apart" className={classes.paymentTitle} mt='sm'>
                                                <Text weight={500} size='sm'>Total Payment</Text>
                                                <Text weight={500} size='sm'>&#8369;{money(reservation?.reservation?.total)}</Text>
                                            </Group>
                                            <Group position="apart" className={classes.paymentTitle} >
                                                <Text weight={500} size='sm'>Total Nights</Text>
                                                <Text weight={500} size='sm'>{-numberofNights + 1}</Text>
                                            </Group>
                                        </Card.Section>
                                        <Card.Section className={classes.section1} mt='sm' pb={0} pr={0} pl={0}>
                                            <Title align="center" mt='sm' order={6}>Reservation Status</Title>
                                            <Text weight={500} size='xxs' align="center"
                                                color={reservation?.reservation?.reservation_status ? "green" : "red"}
                                            >{reservation?.reservation?.reservation_status ? "The host accepted your reservation. See you there!" : "The host has not yet responded to your reservation or has  been declined."}</Text>
                                            <Title align="center" mt='sm' order={6}>Guest Status</Title>
                                            <Text weight={500} size='xxs' align="center"
                                                color={reservation?.reservation?.guest_status ? "green" : "red"}
                                            >{reservation?.reservation?.guest_status ? "You arrived to the place!" : "You did not/ haven't arrived yet."}</Text>
                                        </Card.Section>
                                    </Paper>
                                </Container>
                            </Container>
                            <Card.Section className={classes.section} style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 15, paddingBottom: 15 }}>
                                <Text weight={300} mb='md' size='xl'>Give us feedback to serve you better next time 😃</Text>
                                <Grid justify={"center"} gutter="xl">
                                    {reservation?.reservation?.Review ?
                                        <ReviewCard reservation={reservation.reservation} />
                                        :
                                        <EmptyNotice review="review2" />
                                    }
                                </Grid>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <Textarea style={{ maxWidth: '800px', width: '100%' }} mr='sm' mb='md' description="Share your experience with us!"
                                        placeholder={reservation?.reservation?.Review || reservation?.reservation?.reservation_status ? "You have already reviewed this reservation." : "Your review goes here"}
                                        disabled={reservation?.reservation?.Review || !reservation?.reservation?.reservation_status}
                                        label="Your review" mt='md' radius="md" autosize minRows={2}
                                        onChange={(e) => setComment(e.target.value)}
                                    />

                                    {(!reservation?.reservation?.Review || !reservation?.reservation?.reservation_status) &&
                                        <ReactStars count={5} onChange={(e) => setRating(e)} size={24} activeColor="#ffd700"
                                            emptyIcon={<i className="far fa-star"></i>}
                                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                                            fullIcon={<i className="fa fa-star"></i>}
                                        />
                                    }
                                    <Button style={{ maxWidth: '800px', width: '100%' }} mt='md' disabled={!reservation?.reservation?.reservation_status || reservation?.reservation?.Review}
                                        className={(!reservation?.reservation?.reservation_status || reservation?.reservation?.Review) && classes.disabledButton}
                                        onClick={handleReviewSubmit}
                                    >{isReviewLoading ? <Loader color="white" size="sm" /> : "Submit Review"}</Button>
                                </div>
                            </Card.Section>
                            <Card.Section pr={0} pl={0} pb={20} pt={40}>
                                <Group noWrap>
                                    <Avatar src={reservation?.reservation?.Room?.User?.profile_image} size={94} radius="md" />
                                    <div>
                                        <Text size="xs" sx={{ textTransform: 'uppercase' }} weight={700} color="dimmed">
                                            Hosted by
                                        </Text>

                                        <Text size="lg" weight={500} className={classes.name}>
                                            {reservation?.reservation?.Room?.User?.name}
                                        </Text>

                                        <Group noWrap spacing={10} mt={3}>
                                            <At size={16} className={classes.icon} />
                                            <Text size="xs" color="dimmed">
                                                {reservation?.reservation?.Room?.User?.email}
                                            </Text>
                                        </Group>

                                        <Group noWrap spacing={10} mt={5}>
                                            <PhoneCall size={16} className={classes.icon} />
                                            <Text size="xs" color="dimmed">
                                                {reservation?.reservation?.Room?.User?.phone_number}
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
                            <Group mt="xs" position="left" pb={25}>
                                <X size={18} strokeWidth={3} color={'#bf4d40'} />
                                <Text weight={500} size='sm' color='dimmed'>
                                    No cancellation policy
                                </Text>
                            </Group>
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