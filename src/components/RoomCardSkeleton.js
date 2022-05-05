import { Container, createStyles, Skeleton } from '@mantine/core'
import React from 'react'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
        maxHeight: "580px",
        minWidth: "350px",
        maxWidth: "350px",
        borderRadius: "10px 10px 10px 10px",
        zIndex: 0
    },
    image: {
        borderRadius: "10px 10px 0 0",
        '&:before': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.indigo[2] : theme.colors.blue[5],
        },
    },
    center: {
        margin: "0 auto",
        '&:before': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.indigo[2] : theme.colors.blue[5],
        },
    }
}))

export default function RoomCardSkeleton() {
    const { classes } = useStyles()
    return (
        <Container className={classes.card} pl='0' pr='0' pb='md' mb='lg'>
            <Skeleton visible height={180} width="100%" className={classes.image} style={{ backgroundColor: 'red' }} />
            <Skeleton height={20} radius="xl" mt="lg" mb={40} width={150} className={classes.center} />
            <Skeleton height={12} mt={6} width="85%" radius="xl" className={classes.center} />
            <Skeleton height={12} mt={6} width="85%" radius="xl" className={classes.center} />
            <Skeleton height={12} mt={6} width="85%" radius="xl" className={classes.center} />
            <Skeleton height={12} mt={6} width="85%" radius="xl" className={classes.center} />
            <Skeleton height={12} mt={6} width="85%" radius="xl" className={classes.center} />
            <Skeleton height={12} mt={6} width="85%" radius="xl" className={classes.center} />
            <Skeleton height={40} mt={135} width="85%" radius="md" className={classes.center} />
        </Container>
    )
}
