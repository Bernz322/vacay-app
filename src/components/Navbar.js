import React, { useState } from 'react';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Anchor, MediaQuery, useMantineTheme } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LightDarkButton, VacayLogo, ProfileMenu } from '.';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    root: {
        position: 'fixed',
        zIndex: 5,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',
        textAlign: "center",

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
            color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
        },
    },
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
    title: {
        marginLeft: "15px",
        fontFamily: `Great Vibes, ${theme.fontFamily}`,
        color: theme.colorScheme === 'dark' ? theme.colors.blue[2] : theme.colors.dark[5],
    },
}));

export default function Navbar({ setOpenedDashboard, openedDashboard, dashboard }) {
    const links = [
        {
            "link": "/",
            "label": "Home"
        },
        {
            "link": "/post-room",
            "label": "Post room"
        },
        {
            "link": "/listings",
            "label": "Find room"
        },
        {
            "link": "/about",
            "label": "About"
        },
        {
            "link": "/auth",
            "label": "Login"
        }
    ]
    const [opened, toggleOpened] = useBooleanToggle(false);
    const [active, setActive] = useState(links[0].link);
    const { classes, cx } = useStyles();
    const theme = useMantineTheme();
    let navigate = useNavigate();

    const { user } = useSelector(state => state.auth)

    const items = links.map((link) => (
        <Anchor
            key={link.label}
            style={{ textDecoration: "none" }}
            className={cx(classes.link, { [classes.linkActive]: active === link.link })}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
                toggleOpened(false);
                navigate(link.link)
            }}
        >
            {link.label}
        </Anchor >
    ));
    return (
        <Header height={HEADER_HEIGHT} mb={10} className={classes.root}>
            <Container className={classes.header} size="xl">
                {dashboard &&
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Burger
                            opened={openedDashboard}
                            onClick={() => setOpenedDashboard((o) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                        />
                    </MediaQuery>
                }
                {dashboard ?
                    <h1 className={classes.title}>Welcome Admin</h1>
                    : <VacayLogo />}
                <Group spacing={5} className={classes.links}>
                    {user ?
                        items.filter((item) => item.key !== "Login")
                        :
                        items
                    }
                    <LightDarkButton />
                    {user &&
                        <ProfileMenu />}
                </Group>

                <Burger
                    opened={opened}
                    onClick={() => toggleOpened()}
                    className={classes.burger}
                    size="sm"
                />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>

                            {user ?
                                items.filter((item) => item.key !== "Login")
                                :
                                <>
                                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginRight: "15px", padding: "7px 0" }}>
                                        <LightDarkButton />
                                    </div>
                                    {items}
                                </>
                            }
                            {user &&
                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginRight: "15px", padding: "7px 0" }}>
                                    <ProfileMenu />
                                    <LightDarkButton />
                                </div>}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}