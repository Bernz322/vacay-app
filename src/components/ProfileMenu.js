import React, { useState, useEffect } from 'react';
import { createStyles, Group, Menu, UnstyledButton, Avatar, Text, Divider, Indicator, Modal, Textarea, NumberInput, Button, Loader } from '@mantine/core';
import { useNetwork } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { BuildingWarehouse, CalendarEvent, ChevronDown, Logout, Trash, User, Edit, LayoutDashboard, Check, InfoCircle } from 'tabler-icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs'

import { logout, authReset } from '../features/auth/authSlice';
import { getMe, updateUser, deleteUser, userReset } from '../features/user/userSlice';

const useStyles = createStyles((theme, opened) => ({
    userMenu: {
        [theme.fn.smallerThan('xs')]: {
            marginRight: 15,
        },
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },
    },
    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
    icon: {
        transition: 'transform 150ms ease',
        transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
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

export default function ProfileMenu() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const networkStatus = useNetwork();
    const { user } = useSelector(state => state.auth)
    const { currentUser, isUserLoading, isUserSuccess } = useSelector(state => state.user)
    const [editProfileOpened, setEditProfileOpened] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { classes, theme, cx } = useStyles(userMenuOpened);

    const [newPhone, setNewPhone] = useState();
    const [newDescription, setNewDescription] = useState("");

    const handleUpdate = () => {
        const data = {
            id: user.id,
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

        dispatch(updateUser(data))
        setEditProfileOpened(false)
        setNewPhone()
        if (isUserSuccess) {
            showNotification({
                title: 'Profile updated successfully!',
                autoClose: 5000,
                color: 'green',
                icon: <Check />
            })
        }
    }

    const handleDelete = () => {
        dispatch(deleteUser(currentUser.id));

        if (isUserSuccess) {
            showNotification({
                title: 'Account deleted successfully',
                autoclose: 4000,
                color: "green",
                icon: <Check />
            })
            dispatch(logout())
            dispatch(authReset())
            dispatch(userReset())
            navigate('/')
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        dispatch(authReset())
        navigate('/')
    }

    useEffect(() => {
        dispatch(getMe())
        if (!networkStatus.online) {
            showNotification({
                title: 'You are offline!',
                message: 'We are trying to reconnect you. Please wait.',
                disallowClose: true,
                loading: true,
                color: 'red',
            })
        }
    }, [dispatch, networkStatus.online]);

    return (
        <>
            <Menu
                size={260}
                placement="end"
                transition="pop-top-right"
                className={classes.userMenu}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                control={
                    <UnstyledButton
                        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                    >
                        <Group spacing={7}>
                            <Indicator color={networkStatus.online ? "lime" : "red"} size={8} offset={1} position="bottom-end" withBorder>
                                <Avatar src={user.profile_image} alt={user.name} radius="xl" size={20} />
                            </Indicator>
                            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                {user.name}
                            </Text>
                            <ChevronDown size={12} className={classes.icon} />
                        </Group>
                    </UnstyledButton>
                }
            >
                <Link to="/my-listings"><Menu.Item icon={<BuildingWarehouse size={14} color={theme.colors.violet[6]} />}>
                    Your Rooms
                </Menu.Item></Link>
                <Link to="/my-reservations"><Menu.Item icon={<CalendarEvent size={14} color={theme.colors.cyan[6]} />}>
                    Your Reservations
                </Menu.Item></Link>

                {user?.is_admin &&
                    <Link to="/dashboard"><Menu.Item icon={<LayoutDashboard size={14} color={theme.colors.blue[6]} />}>
                        Admin dashboard
                    </Menu.Item></Link>
                }

                <Menu.Label>Settings</Menu.Label>
                <Link to={`/profile/${currentUser.id}`}> <Menu.Item icon={<User size={14} />}>Profile</Menu.Item></Link>
                <Menu.Item onClick={() => setEditProfileOpened(true)} icon={<Edit size={14} />}>Update Profile</Menu.Item>
                <Menu.Item icon={<Logout size={14} />} onClick={handleLogout}>Logout</Menu.Item>

                <Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item color="red" icon={<Trash size={14} />} onClick={() => setDeleteModal(true)}>
                    Delete account
                </Menu.Item>
            </Menu>

            <Modal opened={editProfileOpened} onClose={() => setEditProfileOpened(false)} title="Update your profile" >
                <Group direction="row" mb='lg'>
                    <img src={currentUser?.profile_image} className={classes.profileImage} alt={currentUser?.name} />
                    <Group direction="column" spacing="xs">
                        <Text className={classes.userInfo}>Name: {currentUser?.name}</Text>
                        <Text className={classes.userInfo}>Email: {currentUser?.email}</Text>
                        <Text className={classes.userInfo}>Joined on: {dayjs(currentUser?.createdAt).format('DD/MMM/YYYY')}</Text>
                        <Text className={classes.userInfo}>Status: <span style={{ color: networkStatus.online ? "green" : "red" }}>{networkStatus.online ? "Online" : "Offline"}</span></Text>
                    </Group>
                </Group>
                <Text align='center' mb='sm' className={classes.userInfo}>We only allow number and description updates</Text>
                <NumberInput maxLength={11} size="xs" label="Phone Number" placeholder={currentUser?.phone_number} hideControls value={newPhone} required onChange={(val) => setNewPhone(val)} />
                <Textarea maxLength={120} size="xs" label="Description" placeholder={currentUser?.description} autosize minRows={2} maxRows={4} onChange={(e) => setNewDescription(e.target.value)} />
                <Button size="xs" type="submit" mt='lg' onClick={handleUpdate}>{isUserLoading ? <Loader color="white" size="sm" /> : "Update"}</Button>
            </Modal>

            <Modal
                opened={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Are you sure to delete your account?"
                centered
            >
                <Text align='center' color='yellow' size='sm'>All your created listings and reservations will also be deleted.</Text>
                <Group position="apart" mt='md'>
                    <Button radius="md" style={{ width: "100%", flex: 6 }} color="red" onClick={handleDelete}>Yes</Button>
                    <Button radius="md" style={{ width: "100%", flex: 6 }} color="blue" onClick={() => setDeleteModal(false)}>No</Button>
                </Group>
            </Modal>
        </>
    )
}
