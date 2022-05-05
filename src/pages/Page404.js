import React from 'react';
import { createStyles, Title, Text, Button, Container, Group, Paper } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import Helmet from 'react-helmet'

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[5],

        [theme.fn.smallerThan('sm')]: {
            fontSize: 120,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 38,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    description: {
        maxWidth: 500,
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5,
    },

    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
        minHeight: "calc(100vh - 151px)"
    },
}));

export default function Page404() {
    const { classes } = useStyles();
    let navigate = useNavigate();

    return (
        <Paper radius={0} className={classes.paper}>
            <Helmet>
                <title>404</title>
            </Helmet>
            <Container className={classes.root}>
                <div className={classes.label}>404</div>
                <Title className={classes.title}>You have found a secret place.</Title>
                <Text color="dimmed" size="lg" align="center" className={classes.description}>
                    Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
                    been moved to another URL.
                </Text>
                <Group position="center">
                    <Button color="gray" size="lg" onClick={() => navigate("/")}>
                        Take me back to home page
                    </Button>
                </Group>
            </Container>
        </Paper>
    );
}