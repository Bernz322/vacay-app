import React from 'react'
import { Container, Text, createStyles, Group, ActionIcon } from '@mantine/core';
import { BrandGithub, BrandInstagram, BrandTwitter } from 'tabler-icons-react';
import { VacayLogo } from '../components'

const useStyles = createStyles((theme) => ({
    footer: {
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        // position: 'relative',
    },
    links: {
        display: "flex",
        flexDirection: "column",
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
    innerFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        zIndex: 5,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },
    powered: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.dark[8],
    }

}))

export default function Footer() {
    const { classes } = useStyles();
    return (
        <div className={classes.footer} style={{ zIndex: 9999 }}>
            <Container className={classes.innerFooter}>
                <VacayLogo />
                <Text color="dimmed" size="sm">
                    © 2022 Vacay. All rights reserved.
                </Text>
                <Group spacing={0} className={classes.links} position="right" noWrap>
                    <div style={{ display: "flex" }}>
                        <a href="https://twitter.com/brnz6000" target="_blank" rel="noreferrer">
                            <ActionIcon size="lg">
                                <BrandTwitter size={18} />
                            </ActionIcon>
                        </a>
                        <a href="https://github.com/Bernz322" target="_blank" rel="noreferrer">
                            <ActionIcon size="lg">
                                <BrandGithub size={18} />
                            </ActionIcon>
                        </a>
                        <a href="https://www.instagram.com/brnzzzzzzz/" target="_blank" rel="noreferrer">
                            <ActionIcon size="lg">
                                <BrandInstagram size={18} />
                            </ActionIcon>
                        </a>
                    </div>
                    <Text size="xxs" className={classes.powered}>
                        Powered by: Jeffrey Bernadas
                    </Text>
                </Group>
            </Container>
        </div>
    )
}
