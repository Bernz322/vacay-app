import React from 'react';
import { createStyles, Title, Text, Container } from '@mantine/core';

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

    title2: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 28,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 22,
        },
    },

    description: {
        maxWidth: 500,
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5,
    },
}));

const EmptyNotice = ({ listing, review, reservation }) => {
    const { classes } = useStyles();

    return (
        <Container className={classes.root}>
            {listing === "home" &&
                <>
                    <Title className={classes.title}>No listings yet. Be the first one to do so.</Title>
                    <Text color="dimmed" size="lg" align="center" className={classes.description}>
                        Become a host for free. You have the freedom to choose your listing nightly rate!
                    </Text>
                </>
            }
            {listing === "listing" &&
                <>
                    <Title className={classes.title}>You have 0 listing</Title>
                    <Text color="dimmed" size="lg" align="center" className={classes.description}>
                        Become a host for free. You have the freedom to choose your listing nightly rate!
                    </Text>
                </>
            }
            {reservation === "reservation" &&
                <>
                    <Title className={classes.title}>You have 0 reservations</Title>
                    <Text color="dimmed" size="lg" align="center" className={classes.description}>
                        Find a place and reserve it!
                    </Text>
                </>
            }
            {review === "review" &&
                <>
                    <Title className={classes.title2}>This listing has no reviews</Title>
                    <Text color="dimmed" size="lg" align="center" className={classes.description}>
                        Become the first one to do it!
                    </Text>
                </>
            }
            {review === "review2" &&
                <>
                    <Title className={classes.title2}>You have not reviewed this reservation yet.</Title>
                    <Text color="dimmed" size="lg" align="center" className={classes.description}>
                        We will not show you other individual's reviews as we value your honesty on reviewing this listing. Please be honest when submitting a review.
                    </Text>
                </>
            }
        </Container>
    );
}

export default EmptyNotice;
