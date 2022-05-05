import React from 'react';
import { createStyles, Card, Image, Group, Text, Avatar, Badge, Grid, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import customParseFormat from "dayjs/plugin/customParseFormat"

import { province } from '../utilities';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    footer: {
        padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
        marginTop: theme.spacing.md,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
    },
}));

export default function ReservationCard({ reservation }) {
    const { classes } = useStyles();
    dayjs.extend(relativeTime)
    dayjs.extend(customParseFormat)

    const room_images = JSON.parse(reservation?.Room?.room_image)

    return (
        <Grid.Col style={{ maxWidth: 350 }} xs={12} sm={12} md={6} lg={3}>
            <Card withBorder p="lg" radius="md" className={classes.card}>
                <Card.Section mb="sm">
                    <Image src={room_images?.[0]} alt={reservation?.Room?.room_name} height={180} />
                </Card.Section>
                <Badge size="sm" fullWidth="true" mb="sm" variant="gradient" gradient={{ from: 'teal', to: 'blue' }}>{province(reservation?.Room?.province)}</Badge>
                <Group position='apart' grow>
                    <Badge size="xs" variant="outline" color={reservation?.reservation_status ? "green" : "red"}>{reservation?.reservation_status ? "Accepted" : "Not Accepted"}</Badge>
                    <Badge size="xs" variant="outline" color={reservation?.guest_status ? "green" : "red"}>{reservation?.guest_status ? "Arrived" : "Did not arrive"}</Badge>
                </Group>

                <Text weight={700} className={classes.title} mt="xs">
                    {reservation?.Room?.room_name}
                </Text>

                <Group mt="lg">
                    <Avatar src={reservation?.Room?.User?.profile_image} radius="sm" />
                    <div>
                        <Text weight={500}>{reservation?.Room?.User?.name}</Text>
                        <Text size="xs" color="dimmed">
                            reserved {dayjs(reservation?.createdAt).fromNow()}
                        </Text>
                    </div>
                </Group>

                <Card.Section className={classes.footer}>

                    <Group position="left">
                        <Text size="sm" color="blue">
                            Reservation Date:
                        </Text>
                        <Text size="xs" color="gray">
                            {dayjs(reservation?.start_date).format('MMMM D, YYYY')} - {dayjs(reservation?.end_date).format('MMMM D, YYYY')}
                        </Text>
                    </Group>
                    <Group position="left">
                        <Text size="sm" color="blue">
                            Price per night: &#8369;
                        </Text>
                        <Text size="xs" color="gray">
                            {reservation?.Room?.price}
                        </Text>
                    </Group>
                    <Group position="left" mb="sm">
                        <Text size="sm" color="blue">
                            Total: &#8369;
                        </Text>
                        <Text size="xs" color="gray">
                            {reservation?.total}
                        </Text>
                    </Group>
                    <Link to={`/my-reservations/${reservation.id}`} style={{ width: '100%' }}>
                        <Button radius="md" style={{ flex: 1, width: '100%' }}>
                            Show details
                        </Button>
                    </Link>
                </Card.Section>
            </Card>
        </Grid.Col>
    );
}