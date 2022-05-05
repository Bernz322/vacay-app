import React from 'react'
import { createStyles, Paper, Container, Grid, Col, Image, Title, Accordion, Text, SimpleGrid, TextInput, Textarea, Group, Button } from '@mantine/core'
import Helmet from 'react-helmet'

import logo from "../images/Logo.png"

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        minHeight: "100vh",
        paddingBottom: 40,
        paddingTop: 80,
    },
    h1: {
        marginBottom: 0,
        color: theme.colorScheme === 'dark' ? theme.colors.cyan[4] : theme.colors.blue[6],
    },
    wrapper: {
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
    },

    title: {
        marginBottom: theme.spacing.md,
        paddingLeft: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    item: {
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    },
    wrapper2: {
        display: 'flex',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        borderRadius: theme.radius.lg,
        padding: 4,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]
            }`,

        [theme.fn.smallerThan('md')]: {
            flexDirection: 'column',
        },
    },

    form: {
        boxSizing: 'border-box',
        flex: 1,
        padding: theme.spacing.xl,
        paddingLeft: theme.spacing.xl * 2,
        borderLeft: 0,

        [theme.fn.smallerThan('md')]: {
            padding: theme.spacing.md,
            paddingLeft: theme.spacing.md,
        },
    },

    fields: {
        marginTop: -12,
    },

    fieldInput: {
        flex: 1,

        '& + &': {
            marginLeft: theme.spacing.md,
            [theme.fn.smallerThan('md')]: {
                marginLeft: 0,
                marginTop: theme.spacing.md,
            },
        },
    },

    fieldsGroup: {
        display: 'flex',
        [theme.fn.smallerThan('md')]: {
            flexDirection: 'column',
        },
    },
    title2: {
        marginBottom: theme.spacing.xl * 1.5,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        [theme.fn.smallerThan('md')]: {
            marginBottom: theme.spacing.xl,
        },
    },

    control: {
        [theme.fn.smallerThan('md')]: {
            flex: 1,
        },
    },
    aboutUs: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
    }
}))

export default function AboutPage() {
    const { classes } = useStyles();

    return (
        <Paper radius={0} className={classes.paper}>
            <Helmet>
                <title>About</title>
            </Helmet>
            <Container size="xl">
                <Grid id="faq-grid" gutter={50} mt='xl' mb='xl'>
                    <Col span={12} md={6} className={classes.aboutUs}>
                        <Title order={1} mb='md'>About us</Title>
                        <Text>Vacay is a platform where you can host and reserve a listing within CARAGA Region. It is developed by a single developer which initially serves as an additional portfolio project. Despite this, it will receive full support and updates in the future. Follow the project on <a className={classes.h1} href="https://github.com/Bernz322/vacay">Github</a> which is open source and is open for collaboration.</Text>
                    </Col>
                    <Col span={12} md={6} className={classes.aboutUs}>
                        <Image width={200} height={200} src={logo} alt="Frequently Asked Questions" />
                    </Col>
                </Grid>

                <div className={classes.wrapper}>
                    <Container size="lg">
                        <Grid id="faq-grid" gutter={50} mt='xl' mb='xl'>
                            <Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ width: '100%' }} src='https://ui.mantine.dev/_next/static/media/image.b0c2306b.svg' alt="Frequently Asked Questions" />
                            </Col>
                            <Col span={12} md={6}>
                                <Title order={2} align="left" className={classes.title}>
                                    Frequently Asked Questions
                                </Title>

                                <Accordion iconPosition="right" initialItem={0}>
                                    <Accordion.Item label="Is this platform available nationwide?" className={classes.item}>
                                        Unfortunately, this is only exclusive for Region XIII (CARAGA). We have no plans on making this available nationwide for now.
                                    </Accordion.Item>
                                    <Accordion.Item label="Will this support Map Pinning?" className={classes.item}>
                                        Yes! It is currently underdevelopment and will be released next. Follow my development on <a className={classes.h1} href="https://github.com/Bernz322/vacay">Github</a>
                                    </Accordion.Item>
                                    <Accordion.Item label="How is payment done?" className={classes.item}>
                                        This platform doesn't have any payment features. All payments are and should be done in person. Kindly contact the owner of a listing after reservation to keep in touch with them.
                                    </Accordion.Item>
                                    <Accordion.Item label="How can I reset my password?" className={classes.item} >
                                        We do not support password resetting.
                                    </Accordion.Item>
                                    <Accordion.Item label="Can I list a room that only accepts monthly stay and rate instead of nightly?" className={classes.item}>
                                        Yes! Although we did not include a feature for such listings, you are free to do so by informing anyone on your listing's description.
                                    </Accordion.Item>
                                    <Accordion.Item label="I can't edit my listing. Help!" className={classes.item}>
                                        This is in our roadmap and will be added soon.
                                    </Accordion.Item>
                                    <Accordion.Item label="Where can I report bugs?" className={classes.item}>
                                        We have a contact page below this. Report it there with the subject "Vacay Bug". Thank you 😄.
                                    </Accordion.Item>
                                </Accordion>
                            </Col>
                        </Grid>
                    </Container>
                </div>

                <div className={classes.wrapper2}>
                    <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
                        <Text size="lg" weight={700} className={classes.title2}>
                            Get in touch with us
                        </Text>

                        <div className={classes.fields}>
                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <TextInput label="Your name" placeholder="Your name" />
                                <TextInput label="Your email" placeholder="youremail@vacay.dev" required />
                            </SimpleGrid>
                            <TextInput mt="md" label="Subject" placeholder="Subject" required />
                            <Textarea
                                mt="md"
                                label="Your message"
                                placeholder="Please include all relevant information"
                                minRows={3}
                            />

                            <Group position="right" mt="md">
                                <Button type="submit" className={classes.control}>
                                    Send message
                                </Button>
                            </Group>
                        </div>
                    </form>
                </div>
            </Container>
        </Paper >
    )
}
