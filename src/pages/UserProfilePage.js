import React, { useEffect } from 'react'
import { Grid, createStyles, Paper, Container, Image, Title, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import { PhoneCall, At, BuildingWarehouse } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Helmet from 'react-helmet'

import { RoomCard, RoomCardSkeleton } from '../components'
import { getUser } from "../features/user/userSlice"
import { listingReset } from '../features/listing/listingSlice';
import { reservationReset } from '../features/reservation/reservationSlice';
import { Page404, PageLoader } from '.';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "100vh",
        paddingBottom: 40,
        paddingTop: 80,
    },
    h1: {
        marginBottom: 0,
        color: theme.colorScheme === 'dark' ? theme.colors.cyan[4] : theme.colors.blue[6],
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
        marginBottom: 50,
        marginTop: 25,
    },
    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    },
    dim: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    },
    listings: {
        marginBottom: 50,
        [theme.fn.smallerThan('md')]: {
            textAlign: 'center',
        },
    },
}))

export default function UserProfilePage() {
    const dispatch = useDispatch();
    const { currentProfile, isUserLoading, isUserError, messageUser } = useSelector(state => state.user);

    const { classes } = useStyles();
    const { id } = useParams()

    const REDIRECT_URL = '/listings'

    useEffect(() => {
        dispatch(listingReset())
        dispatch(reservationReset())
        if (isUserError) {
            showNotification({
                title: 'Something went wrong while fetching user details',
                message: messageUser,
                autoclose: 4000,
                color: "red"
            })
        }
        dispatch(getUser(id))
    }, [dispatch, id, isUserError, messageUser]);

    // Algo for sorting prices
    const sortedListings = currentProfile?.Rooms?.slice()?.sort((a, b) => (a.Reservations.length < b.Reservations.length ? 1 : -1))

    // Filter only online listings
    const onlineListing = sortedListings?.filter((listing) => {
        return listing.listing_status
    })

    return (
        <>
            {!isUserLoading && currentProfile ?
                Object.keys(currentProfile).length !== 0 ?
                    <Paper radius={0} className={classes.paper}>
                        <Helmet>
                            <title>{currentProfile?.name}</title>
                        </Helmet>
                        <Container size="xl">
                            <div className={classes.header}>
                                <Image radius="100%" width={250} height={250} fit='cover' src={currentProfile?.profile_image} />
                                <Title order={1} mt='md'>{currentProfile?.name}</Title>
                                <Group noWrap spacing={10} mt={3}>
                                    <At size={16} className={classes.icon} />
                                    <Text size="xs" className={classes.dim}>
                                        {currentProfile?.email}
                                    </Text>
                                </Group>
                                <Group noWrap spacing={10} mt={5}>
                                    <PhoneCall size={16} className={classes.icon} />
                                    <Text size="xs" className={classes.dim}>
                                        0{currentProfile?.phone_number}
                                    </Text>
                                </Group>
                                <Group noWrap spacing={10} mt={5}>
                                    <BuildingWarehouse size={16} className={classes.icon} />
                                    <Text size="xs" className={classes.dim}>
                                        Total Listings: {currentProfile?.Rooms?.length}
                                    </Text>
                                </Group>
                                <Title order={5} mt='md'>Description</Title>
                                <Text size="xs" className={classes.dim}>
                                    {currentProfile?.description}
                                </Text>
                            </div>
                            {onlineListing?.length > 0 &&
                                <div className={classes.listings}>
                                    <h1 className={classes.h1}>Popular listings</h1>
                                </div>
                            }

                            <Grid justify={"space-around"}>
                                {isUserLoading ?
                                    <>
                                        <RoomCardSkeleton />
                                        <RoomCardSkeleton />
                                        <RoomCardSkeleton />
                                    </>
                                    :

                                    onlineListing?.length <= 0 ?
                                        <h1 className={classes.h1} style={{ textAlign: 'center' }}>This user has no listings</h1>
                                        :
                                        onlineListing?.map(listing => {
                                            return (
                                                <RoomCard redirect={REDIRECT_URL} profile="true" listing={listing} key={listing.id} />
                                            )
                                        })
                                }
                            </Grid>
                        </Container>
                    </Paper >
                    :
                    <Page404 />
                :
                <PageLoader />
            }

        </>
    )
}
