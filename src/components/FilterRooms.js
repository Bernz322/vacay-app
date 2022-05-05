import React, { useState } from 'react';
import { createStyles, UnstyledButton, Menu, Group } from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';

const data = [
    { label: 'No filter', },
    { label: 'Price low to high' },
    { label: 'Price high to low', },
];

const useStyles = createStyles((theme, opened) => ({
    control: {
        width: 200,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
            }`,
        transition: 'background-color 150ms ease',
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[opened ? 5 : 6]
                : opened
                    ? theme.colors.gray[0]
                    : theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    label: {
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,
    },

    icon: {
        transition: 'transform 150ms ease',
        transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
    },
}));

export default function FilterRooms({ setPriceFilter }) {
    const [opened, setOpened] = useState(false);
    const { classes } = useStyles(opened);
    const [selected, setSelected] = useState(data[0]);

    const handleClick = (item) => {
        setPriceFilter(item.label)
        setSelected(item)
    }

    const items = data.map((item) => (
        <Menu.Item
            onClick={() => handleClick(item)}
            key={item.label}
        >
            {item.label}
        </Menu.Item >
    ));

    return (
        <Menu
            transition="pop"
            transitionDuration={150}
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            control={
                <UnstyledButton className={classes.control}>
                    <Group spacing="xs">
                        <span className={classes.label}>{selected.label}</span>
                    </Group>
                    <ChevronDown size={16} className={classes.icon} />
                </UnstyledButton>
            }
        >
            {items}
        </Menu>
    );
}