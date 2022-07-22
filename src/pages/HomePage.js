import React, { useEffect } from 'react'
import { Container, Text, Grid, Paper, createStyles, Title, List, ThemeIcon, Group, Button, Image } from '@mantine/core';
import { Check } from 'tabler-icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchListings } from '../features/listing/listingSlice';
import { EmptyNotice, RoomCard, RoomCardSkeleton } from '../components'
import img from "../images/hero-section.svg";

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "100vh",
        paddingBottom: 40,
    },
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 2,
    },

    content: {
        maxWidth: 480,
        marginRight: theme.spacing.xl * 3,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 44,
        lineHeight: 1.2,
        fontWeight: 900,

        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    highlight: {
        position: 'relative',
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
                : theme.colors[theme.primaryColor][3],
        borderRadius: theme.radius.sm,
        padding: '4px 12px',
    },

    footer: {
        marginTop: 120,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
    innerFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },
}))

export default function HomePage() {
    const { classes } = useStyles();
    const dispatch = useDispatch()
    const { listings, isListingLoading } = useSelector(state => state.listing)
    const REDIRECT_URL = '/listings'

    useEffect(() => {
        dispatch(fetchListings())
    }, [dispatch]);

    return (
        <Paper radius={0} className={classes.paper}>
            <Container size="xl">
                <div className={classes.inner}>
                    <div className={classes.content}>
                        <Title className={classes.title}>
                            Find the <span className={classes.highlight}>perfect</span> place to crash on<br />
                        </Title>
                        <Text color="dimmed" mt="md">
                            Thinking to rent out your place or finding your next home? You can do both here with Vacay!
                        </Text>

                        <List
                            mt={30}
                            spacing="sm"
                            size="sm"
                            icon={
                                <ThemeIcon size={20} radius="xl">
                                    <Check size={12} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>
                                <b>Easy to use</b> – find a room for rent and book a reservation.
                            </List.Item>
                            <List.Item>
                                <b>Currently in vacation or planning to?</b> – find your perfect place here.
                            </List.Item>
                            <List.Item>
                                <b>You pick your next home</b> – your preferences matters, find the place you are comfortable with.
                            </List.Item>
                            <List.Item>
                                <b>Free room posting</b> – YES you read that right and that's a great price!
                            </List.Item>
                        </List>

                        <Group mt={30}>
                            <Link to="/post-room">
                                <Button radius="xl" size="md" className={classes.control}>
                                    Post your place
                                </Button>
                            </Link>
                            <Link to="/listings">
                                <Button variant="default" radius="xl" size="md" className={classes.control}>
                                    Rent a place
                                </Button>
                            </Link>
                        </Group>
                    </div>
                    <Image src={img} className={classes.image} />
                </div>

                <div style={{ marginBottom: "25px" }}>
                    <h1 style={{ marginBottom: "0" }}>Explore the neighborhood</h1>
                    <p style={{ marginTop: "0" }}>Browse the newest listings of condos, apartments, houses and rooms for rent:</p>
                </div>

                <Grid justify={"space-around"}>
                    {isListingLoading ?
                        <>
                            <RoomCardSkeleton />
                            <RoomCardSkeleton />
                            <RoomCardSkeleton />
                        </>
                        :
                        listings?.length <= 0 ?
                            <EmptyNotice listing="home" />
                            :
                            listings?.map(listing => {
                                return (listing.listing_status && <RoomCard redirect={REDIRECT_URL} listing={listing} key={listing.id} />)
                            })
                    }
                </Grid>
            </Container>
        </Paper>
    )
}
