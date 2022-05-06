import React, { useState, useEffect } from 'react'
import { Grid, createStyles, Paper, Container, Pagination } from '@mantine/core'
import { useSelector, useDispatch } from 'react-redux'
import Helmet from 'react-helmet'

import { fetchAllReservationByUser, reservationReset } from "../features/reservation/reservationSlice"
import { EmptyNotice, ReservationCard, RoomCardSkeleton } from '../components'
import { listingReset } from '../features/listing/listingSlice';
import { userReset } from '../features/user/userSlice';

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
    pagination: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
    }
}))

export default function MyReservationsPage() {
    const { classes } = useStyles();
    const dispatch = useDispatch();
    const { reservations, isReserveError, isReserveLoading, messageReserve } = useSelector(state => state.reservation)

    // For Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsPerPage = 15;

    // Pagination Algo
    const indexOfLastListing = currentPage * reservationsPerPage;   // Returns the index of the last listing (1*15 = 15)
    const indexOfFirstListing = indexOfLastListing - reservationsPerPage; // (15 - 15 = 0)
    const currentReservations = reservations.slice(indexOfFirstListing, indexOfLastListing) // (Slice the listins from 0, 10)

    useEffect(() => {
        dispatch(listingReset())
        dispatch(reservationReset())
        dispatch(userReset())

        dispatch(fetchAllReservationByUser())
    }, [dispatch, isReserveError, messageReserve])

    return (
        <Paper radius={0} className={classes.paper}>
            <Helmet>
                <title>My Reservations</title>
            </Helmet>
            <Container size="xl">
                {reservations?.length > 0 &&
                    <div style={{ textAlign: "center", marginBottom: 50 }}>
                        <h1 className={classes.h1}>All your reservations</h1>
                        <p>All your created reservations</p>
                    </div>
                }
                {reservations?.length <= 0 &&
                    <EmptyNotice reservation="reservation" />
                }
                {reservations[0] !== undefined &&
                    <Grid justify={"left"} gutter="lg" >
                        {isReserveLoading ?
                            <>
                                <RoomCardSkeleton />
                                <RoomCardSkeleton />
                                <RoomCardSkeleton />
                            </>
                            :
                            currentReservations.map(reservation => {
                                return (
                                    <ReservationCard reservation={reservation} key={reservation.id} />
                                )
                            })
                        }
                    </Grid>}
                {reservations?.length > 0 &&
                    <Pagination page={currentPage} onChange={setCurrentPage} total={Math.ceil(reservations?.length / reservationsPerPage)} className={classes.pagination} />
                }
            </Container>
        </Paper >
    )
}
