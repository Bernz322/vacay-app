import React, { useState, useEffect } from 'react'
import { createStyles, Paper, Container, Group, Button, Tooltip, Space, Badge, LoadingOverlay, Modal } from '@mantine/core'
import { ArrowNarrowDown, Check, Circle, CircleOff, Eye, Trash, X } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import DataTable from 'react-data-table-component'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Helmet from 'react-helmet'

import { fetchSingleListing, editSingleListing, deleteListing, listingReset } from "../features/listing/listingSlice"
import { fetchAllRoomReservation, editReservation, reservationReset } from "../features/reservation/reservationSlice"
import { reviewCount, roomRating } from '../utilities';
import { Page404, PageLoader } from '.';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "calc(100vh - 151px)",
        paddingBottom: 20,
        paddingTop: 70,
    },
    paper2: {
        borderRadius: 15,
        backgroundColor: theme.colorScheme === 'dark' ? '#424242' : theme.colors.gray[0],
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%'
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

}))

const customStyles = {
    header: {
        style: {
            color: '#339AF0',
        },
    },
}

export default function SingleMyRoomPage({ colorScheme }) {
    const { classes } = useStyles();
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { listing, isListingError, isListingSuccess, isListingLoading, messagesListing } = useSelector(state => state.listing)
    const { roomReservations, isReserveError, isReserveLoading, messageReserve } = useSelector(state => state.reservation)
    const { user } = useSelector(state => state.auth)

    const [deleteModal, setDeleteModal] = useState(false);


    const handleReservationStatus = (reservation_id, action) => {
        dispatch(editReservation({ reservation_id, action }))
    }

    const handleGuestStatus = (reservation_id, status) => {
        dispatch(editReservation({ reservation_id, status }))
    }

    const handleListingStatus = (room_id, status) => {
        dispatch(editSingleListing({ room_id, status }))
    }

    const handleDelete = () => {

        dispatch(deleteListing(id));

        if (isListingSuccess) {
            showNotification({
                title: 'Post deleted',
                message: 'Post deleted successfully',
                autoclose: 4000,
                color: "green"
            })
            navigate('/my-listings')
        }
    }

    const reservationsColumns = [
        { name: 'Room Name', selector: row => row?.Room?.room_name, sortable: true, center: true },
        { name: 'Reservation ID', selector: row => row?.id, sortable: true, center: true, compact: true },
        { name: 'Reserved by:', selector: row => row?.User?.name, sortable: true, center: true, },
        { name: 'Start Date', selector: row => row?.start_date, sortable: true, center: true, },
        { name: 'End Date', selector: row => row?.end_date, sortable: true, center: true, },
        { name: 'Total', selector: row => row?.total, sortable: true, center: true, }
        ,
        {
            name: 'Accept/ Decline Reservation', minWidth: '200px',
            cell: (row) => (
                <Group position="center" mt='sm' mb='sm' >
                    <>
                        <Tooltip label="Accept Reservation" withArrow radius="md">
                            <Button radius="md" size="xxs" color='green' onClick={() => handleReservationStatus(row?.id, true)}>
                                <Check size={14} strokeWidth={2} />
                            </Button>
                        </Tooltip>
                        <Tooltip label="Decline Reservation" withArrow radius="md" onClick={() => handleReservationStatus(row?.id, false)}>
                            <Button radius="md" size="xxs" color='red'>
                                <X size={14} strokeWidth={2} />
                            </Button>
                        </Tooltip>
                    </>
                    {row?.reservation_status !== "" ?
                        row?.reservation_status === true ?
                            <Badge color="green" radius="md">Accepted</Badge>
                            :
                            <Badge color="red" radius="md">Declined</Badge>
                        :
                        <Badge color="gray" radius="md" size='sm' variant="filled">No action</Badge>
                    }
                </Group >
            ),
            button: true,
        },
        {
            name: 'Guest Status',
            minWidth: '200px',
            cell: (row) => (
                <Group position="center" mt='sm' mb='sm' >
                    <>
                        <Tooltip label="Guest Arrived" withArrow radius="md">
                            <Button radius="md" size="xxs" color='green' onClick={() => handleGuestStatus(row?.id, true)}>
                                <Check size={14} strokeWidth={2} />
                            </Button>
                        </Tooltip>
                        <Tooltip label="Guest didn't arrive" withArrow radius="md" onClick={() => handleGuestStatus(row?.id, false)}>
                            <Button radius="md" size="xxs" color='red'>
                                <X size={14} strokeWidth={2} />
                            </Button>
                        </Tooltip>
                    </>
                    {row?.guest_status !== "" ?
                        row?.guest_status === true ?
                            <Badge color="green" radius="md">Arrived</Badge>
                            :
                            <Badge color="red" radius="md">No show</Badge>
                        :
                        <Badge color="gray" radius="md" size='sm' variant="filled">No action</Badge>
                    }
                </Group >
            ),
            button: true,
        }
    ];

    const listingColumns = [
        {
            name: 'Room ID',
            selector: row => row.room_id,
            sortable: true,
            center: true
        },
        {
            name: 'Room Name',
            selector: row => row.room_name,
            sortable: true,
            center: true
        },
        {
            name: 'Listing Status',
            minWidth: '200px',
            cell: (row) => (
                <Group position="center" mt='sm' mb='sm'>
                    <>
                        <Tooltip label="Make it online" withArrow radius="md">
                            <Button radius="md" size="xxs" color='green' onClick={() => handleListingStatus(row.room_id, true)}>
                                <Circle size={14} strokeWidth={2} />
                            </Button>
                        </Tooltip>
                        <Tooltip label="Make it offline" withArrow radius="md" onClick={() => handleListingStatus(row.room_id, false)}>
                            <Button radius="md" size="xxs" color='red'>
                                <CircleOff size={14} strokeWidth={2} />
                            </Button>
                        </Tooltip>
                    </>
                    {row.status !== "" ?
                        row.status === true ?
                            <Badge color="green" radius="md">Online</Badge>
                            :
                            <Badge color="red" radius="md">Offline</Badge>
                        :
                        <Badge color="gray" radius="md" size='sm' variant="filled">No action</Badge>
                    }
                </Group>
            ),
            button: true,
        },
        {
            name: 'Total Reservations',
            selector: row => row.total_reservations,
            center: true,
            compact: true,
            sortable: true,
        },
        {
            name: 'Total Reviews',
            selector: row => row.total_reviews,
            center: true,
            compact: true,
            sortable: true,
        },
        {
            name: 'Rating',
            selector: row => row.rating,
            center: true,
            compact: true,
            sortable: true,
        },
        {
            name: 'View Listing',
            minWidth: '200px',
            cell: (row) => (
                <>
                    <Tooltip label="View listing" withArrow radius="md">
                        <Link to={`/listings/${row.room_id}`}>
                            <Button radius="md" size="xs" color='green'>
                                <Eye size={14} strokeWidth={2} />
                            </Button>
                        </Link>
                    </Tooltip>
                    <Tooltip label="Delete listing" withArrow radius="md">
                        <Button radius="md" ml="sm" size="xs" color='red' onClick={() => setDeleteModal(true)}>
                            <Trash size={14} strokeWidth={2} />
                        </Button>
                    </Tooltip>
                </>
            ),
            button: true,
        },
    ];
    const listingData = [
        {
            room_id: listing?.id,
            room_name: listing?.room_name,
            status: listing?.listing_status,
            total_reservations: roomReservations?.length,
            total_reviews: reviewCount(roomReservations),
            rating: `${parseFloat(roomRating(roomReservations)).toFixed(2) || 0} ⭐`,
            listingId: "View",
        }
    ]

    useEffect(() => {
        dispatch(fetchAllRoomReservation(id))
        dispatch(fetchSingleListing(id))

        return () => {
            dispatch(reservationReset())
        }
    }, [dispatch, id]);

    return (
        <>
            {!isListingLoading && listing ?
                (((listing?.User?.id === user?.id) === true) || user?.is_admin) ?
                    <Paper radius={0} className={classes.paper}>
                        <Helmet>
                            <title>{listing?.room_name}</title>
                        </Helmet>
                        <LoadingOverlay visible={isListingLoading || isReserveLoading} overlayOpacity={0.3} overlayColor="#c5c5c5" />
                        <Modal
                            opened={deleteModal}
                            onClose={() => setDeleteModal(false)}
                            title="Are you sure to delete this listing?"
                            centered
                        >
                            <Group position="apart">
                                <Button radius="md" style={{ width: "100%", flex: 6 }} color="red" onClick={handleDelete}>Yes</Button>
                                <Button radius="md" style={{ width: "100%", flex: 6 }} color="blue" onClick={() => setDeleteModal(false)}>No</Button>
                            </Group>
                        </Modal>
                        <Container size="xl">
                            <div style={{ textAlign: "center" }}>
                                <h1 className={classes.h1}>Manage listing</h1>
                                <p>Easily manage your listing. Accept or decline reservations, make listing offline & do many more!</p>
                            </div>
                            <Container size="xl" className={classes.filter}>
                                <Paper className={classes.paper2}>
                                    <DataTable
                                        title="All Reservations of this listing"
                                        columns={reservationsColumns}
                                        data={roomReservations}
                                        pagination
                                        dense
                                        pointerOnHover
                                        sortIcon={<ArrowNarrowDown />}
                                        theme={colorScheme === 'dark' ? 'dark' : 'light'}
                                        customStyles={customStyles}
                                    />
                                </Paper >
                                <Space h="lg" />
                                <Paper className={classes.paper2}>
                                    <DataTable
                                        title="Listing Details"
                                        columns={listingColumns}
                                        data={listingData}
                                        dense
                                        pointerOnHover
                                        sortIcon={<ArrowNarrowDown />}
                                        theme={colorScheme === 'dark' ? 'dark' : 'light'}
                                        customStyles={customStyles}
                                    />
                                </Paper>
                            </Container>
                        </Container>
                    </Paper>
                    :
                    <Page404 />
                :
                <PageLoader />
            }
        </>
    )
}
