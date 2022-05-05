import React from 'react';
import { createStyles, Container, Paper, LoadingOverlay } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
        minHeight: "calc(100vh - 151px)"
    },
}));

export default function PageLoader() {
    const { classes } = useStyles();

    return (
        <Paper radius={0} className={classes.paper}>
            <Container className={classes.root}>
                <LoadingOverlay visible={true} overlayOpacity={0.3} overlayColor="#c5c5c5" />
            </Container>
        </Paper>
    );
}