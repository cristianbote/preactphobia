import { styled } from 'goober';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import { Box } from '../../components/box/box';
import { Text } from '../../components/text/text';
import { theme } from '../../styles/theme';

const Input = styled('input')({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: [theme.sizes[200], theme.sizes[300]].join(' '),
    border: 0,
    margin: 0,
    fontSize: theme.fontSizes[400],
    backgroundColor: theme.colors.gray[500],
    color: theme.colors.accent[100],
    borderRadius: theme.sizes[100],
    boxShadow: [0, theme.sizes[200], theme.sizes[300], theme.colors.gray[50]].join(' '),
    border: [theme.sizes[100], 'solid', theme.colors.gray[500]].join(' '),
    width: '100%',
    textAlign: 'center',
    '&::placeholder': {
        color: theme.colors.accent[100]
    },
    '&:active,&:focus': {
        borderColor: theme.colors.accent[100],
        outline: 0
    }
});

const Content = styled(Box)({
    boxShadow: [0, theme.sizes[200], theme.sizes[300], theme.colors.gray[50]].join(' '),
    borderRadius: theme.sizes[200],
    backgroundColor: theme.colors.gray[200],
    animation: 'appear 400ms ease-out 1'
});

const Card = ({ name, version, description, times }) => {
    return (
        <>
            <Content horizontal centered>
                <Box size={300} flex>
                    <Text bold size={300}>
                        {name}
                        <Text as="span" bold faded>
                            @{version}
                        </Text>
                    </Text>
                    <Box size={200} />
                    <Text faded>{description}</Text>
                </Box>
                <Box size={200} />
                <Text size={400} bold>
                    =
                </Text>
                <Box size={200} />
                <Box size={300} flex horizontal>
                    <Text bold size={300}>
                        {times} &times;{' '}
                        <Text as="span" bold size={200}>
                            Preact
                        </Text>
                    </Text>
                </Box>
            </Content>
            <Box size={400} />
            <Text
                as="a"
                accent
                href="https://preactjs.com/guide/v10/switching-to-preact"
                target="_blank"
                noopener
            >
                Ready to switch? Getting started with Preact
            </Text>
        </>
    );
};

export default function Home() {
    const [res, setRes] = useState();
    const ref = useRef();
    const preactResult = useRef();

    const fetchPackage = useCallback(async (name) => {
        const result = await (
            await fetch(`https://bundlephobia.com/api/size?package=${name}`)
        ).json();
        const preact =
            preactResult.current ||
            (preactResult.current = await (
                await fetch(`https://bundlephobia.com/api/size?package=preact`)
            ).json());

        setRes({
            name: result.name,
            description: result.description,
            version: result.version,
            times: Math.round(result.gzip / preact.gzip)
        });
    }, []);

    return (
        <Box centered>
            <Text as="h1" size={400}>
                <Text bold as="span">
                    Preact
                </Text>
                Phobia
            </Text>
            <Box size={300}>
                <Text faded>Find out how many copies of Preact can fit into a package</Text>
            </Box>
            <Box size={300} />
            <Box size={200} full>
                <Input
                    ref={ref}
                    placeholder="type a package name"
                    onChange={(e) => {
                        fetchPackage(e.target.value);
                    }}
                />
            </Box>
            <Box size={200} />
            <Box size={300}>
                <Text size={100} faded>
                    Under the hood uses the bundlephobia.com API
                </Text>
            </Box>
            <Box size={400} />
            {res ? <Card {...res} /> : null}
        </Box>
    );
}
