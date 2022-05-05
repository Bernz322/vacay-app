import React from 'react';
import {
    Card,
    Image,
    Text,
    Group,
    Badge,
    Button,
    createStyles,
    useMantineTheme,
    Grid,
    Space,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { DeviceTv, LivePhoto, Snowflake, ToolsKitchen, Wifi } from 'tabler-icons-react'
import { province, money } from '../utilities'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    like: {
        color: theme.colors.red[6],
    },
    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
    rating: {
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs + 2,
        pointerEvents: 'none',
    },
}));

export default function RoomCard({ redirect, listing, profile }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <Grid.Col style={{ maxWidth: 350, minWidth: 350 }} sm={6} xs={6} md={4} lg={4} mt="md">
            <Card withBorder radius="md" p="md" className={classes.card}>
                <Card.Section>
                    {profile ?
                        <Image src={JSON.parse(listing.room_image)?.[0]} alt="room-image" height={180} />
                        :
                        <Image src={listing?.room_image?.[0]} alt="room-image" height={180} />
                    }
                </Card.Section>
                <Badge className={classes.rating} variant="gradient" gradient={{ from: 'blue', to: 'pink' }}>
                    {listing?.total_occupancy} 🧍
                </Badge>
                <Card.Section className={classes.section} mt="md">
                    <Text size="lg" weight={500} align="center">
                        {listing?.room_name}
                    </Text>
                    <Space h="sm" />
                    <Group position="apart">
                        <Badge size="sm" variant="light">{listing?.room_type}</Badge>
                        <Badge size="md" color="grape">&#8369;{money(listing?.price)}/n</Badge>
                        <Badge size="sm" color="pink" variant="light">{province(listing?.province)}</Badge>
                    </Group>
                    <Text size="sm" mt="xs" lineClamp={3}>
                        {listing?.summary}
                    </Text>
                </Card.Section>

                <Card.Section className={classes.section} >
                    <Text mt="md" className={classes.label} color="dimmed">
                        Comes with the following:
                    </Text>
                    <Group spacing={7} mt={5} position='center'>
                        {listing?.has_tv &&
                            <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} leftSection={<DeviceTv
                                size={15} strokeWidth={3} color={'#4089bf'} style={{ marginTop: 7 }} />} size="lg" >
                                TV
                            </Badge>
                        }
                        {listing?.has_kitchen &&
                            <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} leftSection={<ToolsKitchen
                                size={15} strokeWidth={3} color={'#4089bf'} style={{ marginTop: 7 }} />} size="lg" >
                                Kitchen
                            </Badge>
                        }
                        {listing?.has_air_con &&
                            <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} leftSection={<Snowflake
                                size={15} strokeWidth={3} color={'#4089bf'} />} size="lg" >
                                Aircon
                            </Badge>
                        }
                        {listing?.has_heating &&
                            <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} leftSection={<LivePhoto
                                size={18} strokeWidth={3} color={'#bf4d40'} style={{ marginTop: 7 }} />} size="lg" >
                                Heater
                            </Badge>
                        }
                        {listing?.has_internet &&
                            <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                                leftSection={<Wifi size={18} strokeWidth={3} color={'#4089bf'} style={{ marginTop: 7 }} />} size="lg" >
                                Internet
                            </Badge>
                        }
                    </Group>
                </Card.Section>
                <Group mt="md" position="center" >
                    <Link to={`${redirect}/${listing?.id}`} style={{ width: '100%' }}>
                        <Button radius="md" style={{ flex: 1, width: '100%' }}>
                            Show details
                        </Button>
                    </Link>
                </Group>
            </Card>
        </Grid.Col>
    );
}