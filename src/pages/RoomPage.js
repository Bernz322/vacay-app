import React, { useState, useEffect } from 'react'
import { Grid, createStyles, Paper, Container, Select, Space, Pagination } from '@mantine/core'
import { useSelector, useDispatch } from 'react-redux'
import Helmet from 'react-helmet'

import { FilterRooms, RoomCard, RoomCardSkeleton } from '../components'
import { fetchListings } from '../features/listing/listingSlice';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "100vh",
        paddingBottom: 40,
        paddingTop: 80,
    },
    filter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 30,
        marginTop: 0,
        [theme.fn.smallerThan('md')]: {
            flexDirection: "column",
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
    pagination: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
    }
}))

export default function RoomPage() {
    const { classes } = useStyles();
    const { listings, isListingLoading } = useSelector(state => state.listing);
    const dispatch = useDispatch();
    const REDIRECT_URL = '/listings'

    // For Filtering
    const [provinceFilter, setProvinceFilter] = useState();
    const [priceFilter, setPriceFilter] = useState();

    // For Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 10;

    // Algo for sorting prices
    const sortedListings = (priceFilter === "Price high to low")
        ? listings?.slice()?.sort((a, b) => (a.price < b.price ? 1 : -1))
        : (priceFilter === "Price low to high")
            ?
            listings?.slice()?.sort((a, b) => (a.price > b.price ? 1 : -1))
            : listings

    // Filter only online listings
    const onlineListing = sortedListings?.filter((listing) => {
        return listing.listing_status
    })

    // Pagination Algo
    const indexOfLastListing = currentPage * listingsPerPage;   // Returns the index of the last listing (1*15 = 15)
    const indexOfFirstListing = indexOfLastListing - listingsPerPage; // (15 - 15 = 0)
    const currentListings = onlineListing.slice(indexOfFirstListing, indexOfLastListing) // (Slice the listins from 0, 10)

    useEffect(() => {
        dispatch(fetchListings())
    }, [dispatch]);

    return (
        <Paper radius={0} className={classes.paper}>
            <Helmet>
                <title>Listings</title>
            </Helmet>
            <Container size="xl">
                <div style={{ textAlign: "center" }}>
                    <h1 className={classes.h1}>Find your next home</h1>
                    <p>May it be for a short period of time or life time</p>
                </div>
                <Container size="xl" className={classes.filter}>
                    <Select
                        data={['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur', 'Butuan']}
                        placeholder="Filter by Province"
                        searchable
                        nothingFound="No Province with that Name"
                        clearable
                        allowDeselect
                        onChange={(data) => setProvinceFilter(data)}
                    />
                    <Space w="sm" h="sm" />
                    <FilterRooms setPriceFilter={setPriceFilter} />
                </Container>
                <Grid justify={"space-around"}>
                    {listings?.length <= 0 || isListingLoading ?
                        <>
                            <RoomCardSkeleton />
                            <RoomCardSkeleton />
                            <RoomCardSkeleton />
                        </>
                        :
                        currentListings
                            ?.filter(listing => {
                                // Filter based on province
                                return ((provinceFilter === null || provinceFilter === undefined || provinceFilter === "") ? true : listing.province === provinceFilter)
                            })
                            ?.map(listing => {
                                return (
                                    <RoomCard redirect={REDIRECT_URL} listing={listing} key={listing.id} />
                                )
                            })
                    }
                </Grid>
                {currentListings?.length > 0 &&
                    <Pagination page={currentPage} onChange={setCurrentPage} total={Math.ceil(onlineListing?.length / listingsPerPage)} className={classes.pagination} />
                }
            </Container>
        </Paper >
    )
}
