import React from 'react';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import { createStyles, Text, Avatar, Group, Grid, Container } from '@mantine/core';
import { Link } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    body: {
        paddingLeft: 54,
        paddingTop: theme.spacing.sm,
    },
    review: {
        marginTop: 15,
        marginBottom: 15
    },
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        borderRadius: "10px 10px 10px 10px",
        padding: "25px 10px 25px 10px",
        zIndex: 0
    },
}));

export default function ReviewCard({ reservation }) {
    const { classes } = useStyles();
    dayjs.extend(relativeTime)
    return (
        <Grid.Col xs={6} lg={4} className={classes.review} >
            <Container className={classes.card}>
                <Group position='apart'>
                    <Link to={`/profile/${reservation?.User?.id}`}>
                        <Group position='left'>
                            <Avatar src={reservation?.User?.profile_image} alt={reservation?.User?.name} radius="xl" />
                            <div>
                                <Text size="sm">{reservation?.User?.name}</Text>
                                <Text size="xs" color="dimmed">
                                    {dayjs(reservation?.createdAt).fromNow()}
                                </Text>
                            </div>
                        </Group>
                    </Link>
                    <Text size="sm"> Rated: {reservation?.Review?.rating} ⭐</Text>
                </Group>
                <Text className={classes.body} size="sm">
                    {reservation?.Review?.comment}
                </Text>
            </Container>
        </Grid.Col>
    );
}