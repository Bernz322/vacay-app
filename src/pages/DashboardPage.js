import React, { useState, useEffect } from 'react';
import { AppShell, Navbar, createStyles, Group, Code, Paper, MediaQuery, Aside, Container, List, ThemeIcon, Title, Tooltip, Button, Badge, Modal, Text, NumberInput, Textarea, Loader, LoadingOverlay } from '@mantine/core';
import { ArrowNarrowDown, BuildingWarehouse, Check, CircleCheck, CircleDashed, Edit, Eye, InfoCircle, LayoutDashboard, Trash, User, X } from 'tabler-icons-react';
import DataTable from 'react-data-table-component'
import Helmet from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs'
import { showNotification } from '@mantine/notifications';

import TopBar from '../components/Navbar'
import { VacayLogo } from '../components';
import { money } from '../utilities'
import { getAllUsers, updateUser, deleteUser } from '../features/user/userSlice'
import { fetchListings } from '../features/listing/listingSlice'

const useStyles = createStyles((theme) => ({
    main: {
        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3],
        padding: 0,
    },
    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    linkIcon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
            color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7],
        },
    },
    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: theme.spacing.md * 1.5,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
    },
    paper2: {
        borderRadius: 15,
        backgroundColor: theme.colorScheme === 'dark' ? '#424242' : theme.colors.gray[0],
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%'
    },
    todoText: {
        color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : '#424242',
    },
    profileImage: {
        height: 120,
        width: 120,
        objectFit: 'cover',
        borderRadius: 10,
        [theme.fn.smallerThan('xs')]: {
            width: 80,
            height: 80,
        },
    },
    userInfo: {
        [theme.fn.smallerThan('xs')]: {
            fontSize: 13,
        },
    }
}));

const customStyles = {
    header: {
        style: {
            color: '#339AF0',
        },
    },
}

export default function DashboardPage({ colorScheme }) {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('Dashboard');
    const [openedDashboard, setOpenedDashboard] = useState(false);
    const [rerender, setRerender] = useState(false);

    const [editProfileOpened, setEditProfileOpened] = useState(false);
    const [newPhone, setNewPhone] = useState();
    const [newDescription, setNewDescription] = useState("");
    const [userData, setUserData] = useState();
    const [userID, setUserID] = useState();
    const [deleteUserModal, setDeleteUserModal] = useState(false);

    // Redux
    const dispatch = useDispatch()
    const { users, isUserLoading, isUserSuccess, isUserError, messageUser } = useSelector(state => state.user)
    const { listings } = useSelector(state => state.listing)

    const handleUserUpdateButtonClick = (userRowData) => {
        setEditProfileOpened(true)
        setUserData(userRowData)
    }
    const handleUserUpdate = () => {
        const data = {
            id: userData.id,
            phone_number: newPhone,
            description: newDescription
        }

        if (!newPhone && !newDescription) {
            return showNotification({
                title: 'Fields are empty',
                autoClose: 2000,
                color: 'yellow',
                icon: <InfoCircle />
            })
        }

        dispatch(updateUser(data)).then(() => {
            setNewPhone()
            setEditProfileOpened(false)
            setRerender(!rerender)
        })
        if (isUserSuccess) {
            showNotification({
                title: 'Profile updated successfully!',
                autoClose: 2000,
                color: 'green',
                icon: <Check />
            })
        }

        if (isUserError) {
            showNotification({
                title: 'Profile not updated!',
                message: messageUser,
                autoClose: 2000,
                color: 'red',
                icon: <X />
            })
        }


    }
    const handleUserDeleteButtonClick = (id) => {
        setUserID(id)
        setDeleteUserModal(true)
    }
    const handleUserDelete = () => {

        dispatch(deleteUser(userID))
            .then(() => {
                setDeleteUserModal(false)
                setRerender(!rerender)
            })
        if (isUserSuccess) {
            showNotification({
                title: 'User deleted successfully!',
                autoClose: 2000,
                color: 'green',
                icon: <Check />
            })
        }
        if (isUserError) {
            showNotification({
                title: 'User not deleted',
                message: messageUser,
                autoClose: 2000,
                color: 'red',
                icon: <X />
            })
        }
    }

    useEffect(() => {
        dispatch(getAllUsers())
        dispatch(fetchListings())
    }, [dispatch, rerender]);

    const menu = [
        { link: '', label: 'Dashboard', icon: LayoutDashboard },
        { link: '', label: 'User', icon: User },
        { link: '', label: 'Rooms', icon: BuildingWarehouse },
    ]

    const usersColumns = [
        { name: 'User ID', selector: row => row.id, sortable: true, left: true },
        { name: 'Name', selector: row => row.name, sortable: true, left: true, },
        { name: 'Email', selector: row => row.email, left: true, compact: true, sortable: true, },
        { name: 'Phone', selector: row => `0${row.phone_number}`, left: true, compact: true, sortable: true, },
        {
            name: 'Actions',
            minWidth: '200px',
            cell: (row) => (
                <>
                    <Tooltip label="View User Profile" withArrow radius="md">
                        <Link to={`/profile/${row.id}`}>
                            <Button radius="md" size="xxs" color='green'>
                                <Eye size={14} strokeWidth={2} />
                            </Button>
                        </Link>
                    </Tooltip>
                    <Tooltip label="Edit User" withArrow radius="md">
                        <Button radius="md" ml="sm" size="xxs" color='blue' onClick={() => handleUserUpdateButtonClick(row)}>
                            <Edit size={14} strokeWidth={2} />
                        </Button>
                    </Tooltip>
                    <Tooltip label="Delete User" withArrow radius="md">
                        <Button radius="md" ml="sm" size="xxs" color='red' onClick={() => handleUserDeleteButtonClick(row.id)}>
                            <Trash size={14} strokeWidth={2} />
                        </Button>
                    </Tooltip>
                </>
            ),
            button: true,
        },
    ];

    const roomsColumns = [
        { name: 'Room ID', selector: row => row.id, sortable: true, left: true },
        { name: 'Room Name', selector: row => row.room_name, sortable: true, left: true },
        { name: 'Room Type', selector: row => row.room_type, sortable: true, left: true },
        { name: 'Room Owner', selector: row => row.User.name, sortable: true, left: true, },
        { name: 'City', selector: row => row.city, left: true, ompact: true, sortable: true, },
        { name: 'Province', selector: row => row.province, left: true, compact: true, sortable: true, },
        { name: 'Price', selector: row => `₱ ${money(row.price)}/ night`, left: true, compact: true, sortable: true, },
        { name: 'Occupancy', selector: row => `${row.total_occupancy} person/s`, left: true, compact: true, sortable: true, },
        {
            name: 'Status',
            cell: (row) => (
                <Group position="center" mt='sm' mb='sm' >
                    {row?.listing_status !== "" ?
                        row?.listing_status === true ?
                            <Badge color="green" radius="md" size='sm'>Online</Badge>
                            :
                            <Badge color="red" radius="md" size='sm'>Offline</Badge>
                        :
                        <Badge color="gray" radius="md" size='sm' variant="filled">No action</Badge>
                    }
                </Group >
            ),
        },
        {
            name: 'Actions',
            minWidth: '200px',
            cell: (row) => (
                <>
                    <Tooltip label="View Listing" withArrow radius="md">
                        <Link to={`/my-listings/${row.id}`}>
                            <Button radius="md" size="xxs" color='green'>
                                <Eye size={14} strokeWidth={2} />
                            </Button>
                        </Link>
                    </Tooltip>
                </>
            ),
            button: true,
        },

    ];

    return (
        <AppShell className={classes.main} navbarOffsetBreakpoint="sm" asideOffsetBreakpoint="sm" fixed
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!openedDashboard} width={{ sm: 200, lg: 300 }} className={classes.navbar}>
                    <Navbar.Section>
                        <Group className={classes.header} position="apart">
                            <VacayLogo />
                            <Code sx={{ fontWeight: 700 }}>v1.0</Code>
                        </Group>
                    </Navbar.Section>
                    <Navbar.Section grow mt="xl">
                        {menu.map((item) => (
                            <a className={cx(classes.link, { [classes.linkActive]: item.label === active })}
                                href={item.link}
                                key={item.label}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setActive(item.label);
                                    setOpenedDashboard(false)
                                }}
                            >
                                <item.icon className={cx(classes.linkIcon, { [classes.linkActive]: item.label === active })} />
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <TopBar setOpenedDashboard={setOpenedDashboard} openedDashboard={openedDashboard} dashboard={true} />
            }
            aside={
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Aside className={classes.todoText} p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                        <Title order={5} mb='md' align='center'>Post deployment Roadmap</Title>
                        <List spacing="xs" size="sm" center >
                            <List.Item
                                icon={
                                    <ThemeIcon color="yellow" size={24} radius="xl">
                                        <CircleDashed size={16} />
                                    </ThemeIcon>
                                }>Contact Functionality</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="yellow" size={24} radius="xl">
                                        <CircleDashed size={16} />
                                    </ThemeIcon>
                                }>Deploy</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="yellow" size={24} radius="xl">
                                        <CircleDashed size={16} />
                                    </ThemeIcon>
                                }>Backend to Heroku</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="yellow" size={24} radius="xl">
                                        <CircleDashed size={16} />
                                    </ThemeIcon>
                                }>Frontend to Netlify</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="yellow" size={24} radius="xl">
                                        <CircleDashed size={16} />
                                    </ThemeIcon>
                                }>GoDaddy Domain</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="green" size={24} radius="xl">
                                        <CircleCheck size={16} />
                                    </ThemeIcon>
                                }>Listings Map with Mapbox</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="red" size={24} radius="xl">
                                        <CircleDashed size={16} />
                                    </ThemeIcon>
                                }>Edit created listing</List.Item>
                        </List>
                    </Aside>
                </MediaQuery>
            }
        >
            <Helmet>
                <title>Admin Dashboard</title>
            </Helmet>
            <LoadingOverlay visible={isUserLoading} overlayOpacity={0.3} overlayColor="#c5c5c5" />
            <Container size="xl" className={classes.filter}>
                {(active === "User" || active === "Dashboard") &&
                    <Paper className={classes.paper2}>
                        <DataTable
                            title="All Users"
                            columns={usersColumns}
                            data={users}
                            pagination
                            dense
                            highlightOnHover
                            pointerOnHover
                            sortIcon={<ArrowNarrowDown />}
                            theme={colorScheme === 'dark' ? 'dark' : 'light'}
                            customStyles={customStyles}
                        />
                    </Paper >
                }

                {(active === "Rooms" || active === "Dashboard") &&
                    <Paper className={classes.paper2} mt='md' mb='md'>
                        <DataTable
                            title="All Rooms"
                            columns={roomsColumns}
                            data={listings}
                            pagination
                            dense
                            highlightOnHover
                            pointerOnHover
                            sortIcon={<ArrowNarrowDown />}
                            theme={colorScheme === 'dark' ? 'dark' : 'light'}
                            customStyles={customStyles}
                        />
                    </Paper>
                }
            </Container>

            {/* User Modals */}
            <Modal opened={editProfileOpened} onClose={() => setEditProfileOpened(false)} title="Update user profile" >
                <Group direction="row" mb='lg'>
                    <img src={userData?.profile_image} className={classes.profileImage} alt={userData?.name} />
                    <Group direction="column" spacing="xs">
                        <Text className={classes.userInfo}>Name: {userData?.name}</Text>
                        <Text className={classes.userInfo}>Email: {userData?.email}</Text>
                        <Text className={classes.userInfo}>Joined on: {dayjs(userData?.createdAt).format('DD/MMM/YYYY')}</Text>
                    </Group>
                </Group>
                <Text align='center' mb='sm' className={classes.userInfo}>These two should only be edited</Text>
                <NumberInput maxLength={11} size="xs" label="Phone Number" placeholder={userData?.phone_number} hideControls value={newPhone} required onChange={(val) => setNewPhone(val)} />
                <Textarea maxLength={120} size="xs" label="Description" placeholder={userData?.description} autosize minRows={2} maxRows={4} onChange={(e) => setNewDescription(e.target.value)} />
                <Button size="xs" type="submit" mt='lg' onClick={handleUserUpdate}>{isUserLoading ? <Loader color="white" size="sm" /> : "Update"}</Button>
            </Modal>
            <Modal opened={deleteUserModal} onClose={() => setDeleteUserModal(false)} title="Are you sure to delete this account?" centered >
                <Text align='center' color='yellow' size='sm'>All created listings and reservations will also be deleted.</Text>
                <Group position="apart" mt='md'>
                    <Button radius="md" style={{ width: "100%", flex: 6 }} color="red" onClick={handleUserDelete}>Yes</Button>
                    <Button radius="md" style={{ width: "100%", flex: 6 }} color="blue" onClick={() => setDeleteUserModal(false)}>No</Button>
                </Group>
            </Modal>
        </AppShell>
    );
}