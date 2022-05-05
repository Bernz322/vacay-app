import React, { useEffect, useState } from 'react';
import { useForm, useToggle, upperFirst } from '@mantine/hooks';
import {
    TextInput, PasswordInput, Text, Paper, Group, Button, Divider,
    Anchor, createStyles, Container, Textarea, NumberInput,
    useMantineTheme, Image, Loader
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Photo, Upload, X } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet'

import { register, login, authReset } from '../features/auth/authSlice';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
        minHeight: "calc(100vh - 151px)",
        paddingTop: 105,
        paddingBottom: 105,
        paddingLeft: 15,
        paddingRight: 15,
    },
    container: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        borderRadius: 15,
    },
    title: {
        color: theme.colorScheme === 'dark' ? theme.colors.blue[2] : theme.colors.dark[5],
    },
}));

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({ status, ...props }) {
    if (status.accepted) {
        console.log("accepted");
        return <Upload {...props} />;
    }

    if (status.rejected) {
        console.log("rejected");
        return <X {...props} />;
    }
    return <Photo {...props} />;
}

export const dropzoneChildren = (status, imgArray, theme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
        {imgArray ?
            imgArray.map((img, index) => {
                return <Image height={80} width={80} src={img} key={index} />
            })
            :
            <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
        }
        <div>
            <Text size="xl" inline>
                Upload profile image
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                Drag&apos;n&apos;drop image here to upload. We can accept only <i>.jpeg,.gif.png</i> files that are less than 3mb in size
            </Text>
        </div>
    </Group >
);

export default function Auth() {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [imgArray, setImgArray] = useState([])
    const [imgUploading, setImgUploading] = useState(false)
    const { user, isError, isSuccess, isLoading, message } = useSelector(state => state.auth)

    const [type, toggle] = useToggle('login', ['login', 'register']);
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            phone_number: '',
            description: '',
            profile_image: imgArray[0]
        },
    });

    const uploadImage = (img) => {
        if (imgArray.length > 0) return showNotification({
            title: 'You can only upload 1 image',
            message: 'You only need 1 image for your profile. This is not instagram. Thanks!',
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })

        setImgUploading(true)
        const data = new FormData()
        data.append("file", img)
        data.append("upload_preset", "vacay-app")

        data.append("cloud_name", "jeffbdev")
        fetch("https://api.cloudinary.com/v1_1/jeffbdev/image/upload", {
            method: "POST",
            body: data
        }).then((res) => res.json())
            .then((data) => {
                const url = data.url.toString()
                setImgArray([url])
                setImgUploading(false)
            })
            .catch((err => {
                console.log(err)
                setImgUploading(false)
            }))
    }

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validatePassword = (pass) => {
        if (pass.length >= 6) {
            return true
        }
        return false
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateEmail(form.values.email)) {
            showNotification({
                title: 'Uhuh! Something went wrong',
                message: "Invalid email address.",
                autoclose: 4000,
                color: "red"
            })
            return
        }

        if (type === 'register') {
            if ((form.values.phone_number.toString().length >= 10) === false) {
                showNotification({
                    title: 'Uhuh! Something went wrong',
                    message: "Phone number must have at least 10 numbers",
                    autoclose: 4000,
                    color: "red"
                })
                return
            }

            if (!validatePassword(form.values.password)) {
                showNotification({
                    title: 'Uhuh! Something went wrong',
                    message: "Password must have at least 6 characters.",
                    autoclose: 4000,
                    color: "red"
                })
                return
            }

            const userData = {
                name: form.values.name,
                email: form.values.email,
                password: form.values.password,
                phone_number: form.values.phone_number,
                description: form.values.description,
                profile_image: form.values.profile_image
            }
            dispatch(register(userData))
        } else {
            const userData = {
                email: form.values.email,
                password: form.values.password,
            }
            dispatch(login(userData))
        }
    }

    useEffect(() => {
        form.values.profile_image = imgArray[0]
        if (isError) {
            showNotification({
                title: 'Uhuh! Something went wrong',
                message: message,
                autoclose: 4000,
                color: "red"
            })
        }

        if (isSuccess || user) {
            navigate('/')
        }

        dispatch(authReset())
    }, [imgArray, form.values, isError, dispatch, isSuccess, message, navigate, user]);

    return (
        <Paper radius={0} className={classes.paper}>
            <Helmet>
                <title>Authentication</title>
            </Helmet>
            <Container size={420} my={40} className={classes.container} style={{ padding: "50px 35px" }}>
                <Text size="lg" weight={500}>
                    Welcome to <span className={classes.title}>Vacay</span>, {type} with
                </Text>

                <Group grow mb="md" mt="md">
                    <Button>
                        Continue with Google</Button>
                    <Button
                        sx={(theme) => ({
                            backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 5 : 6],
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 5 : 6],
                            },
                        })}
                    >Login with Github</Button>
                </Group>

                <Divider label="Or continue with email" labelPosition="center" my="lg" />

                <form onSubmit={handleSubmit}>
                    <Group direction="column" grow>
                        {type === 'register' && (
                            <TextInput required label="Name" placeholder="Your name" value={form.values.name} onChange={(event) => form.setFieldValue('name', event.currentTarget.value)} />
                        )}

                        <TextInput required label="Email" placeholder="pogi@vacay.io" value={form.values.email}
                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                            error={form.errors.email && 'Invalid email'}
                        />

                        <PasswordInput required label="Password" placeholder="Your password" value={form.values.password}
                            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                            error={form.errors.password && 'Password should include at least 6 characters'}
                        />

                        {type === 'register' && (
                            <NumberInput label="Phone Number" placeholder="9123456780" hideControls value={form.values.phone_number} required maxLength={11}
                                onChange={(val) => form.setFieldValue('phone_number', val)}
                            />
                        )}

                        {type === 'register' && (
                            <Textarea label="Description" placeholder="Tell us about yourself." autosize minRows={2} maxRows={4} value={form.values.description} maxLength={120}
                                onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
                            />
                        )}

                        {type === 'register' && (
                            <Dropzone
                                onDrop={(files) => uploadImage(files[0])}
                                onReject={(files) => showNotification({
                                    title: 'Uploading image failed',
                                    message: 'Something went wrong while uploading your image. It might be because the image size is more than 3 mb, not supported, or you are not connected to the internet.',
                                    autoClose: 8000,
                                    color: 'red',
                                    icon: <X />
                                })}
                                maxSize={3 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
                                loading={imgUploading}
                            >
                                {(status) => dropzoneChildren(status, imgArray, theme)}
                            </Dropzone>
                        )}

                        {/* {type === 'register' && (
                            <Checkbox
                                label="I accept terms and conditions"
                                checked={form.values.terms}
                                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                            />
                        )} */}
                    </Group>

                    <Group position="apart" mt="xl">
                        <Anchor component="button" type="button" color="gray" onClick={() => toggle()} size="xs">
                            {type === 'register'
                                ? 'Already have an account? Login'
                                : "Don't have an account? Register"}
                        </Anchor>
                        <Button type="submit">{isLoading ? <Loader color="white" size="sm" /> : upperFirst(type)}</Button>
                    </Group>
                </form>
            </Container>
        </Paper>
    );
}