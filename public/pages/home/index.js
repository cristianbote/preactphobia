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
        color: theme.colors.accent[100],
        backgroundColor: theme.colors.gray[500]
    },
    '&:active,&:focus': {
        borderColor: theme.colors.accent[100],
        outline: 0
    }
});

const Content = styled(Box)(({ useShadow, useAnim, useBorder }) => [
    {
        borderRadius: theme.sizes[200],
        backgroundColor: theme.colors.gray[200],
        maxWidth: theme.widthSmall
    },
    useBorder ? { border: [theme.sizes[100], 'solid', theme.colors.accent[100]].join(' ') } : null,
    useAnim ? { animation: 'appear 400ms ease-out 1' } : null,
    useShadow
        ? { boxShadow: [0, theme.sizes[200], theme.sizes[300], theme.colors.gray[50]].join(' ') }
        : null
]);

const ErrorCard = styled(Box)({
    boxShadow: [0, theme.sizes[200], theme.sizes[300], theme.colors.gray[50]].join(' '),
    borderRadius: theme.sizes[200],
    backgroundColor: theme.colors.error,
    animation: 'appear 400ms ease-out 1',
    maxWidth: theme.widthSmall
});

const PurpleThing = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0
});

const Card = ({ name, version, description, times, preact }) => {
    return (
        <>
            <Content useAnim useBorder centered reactive>
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
                <Box size={300} flex horizontal centered>
                    <Text bold size={300}>
                        {times}
                        {'  '}
                        <Text as="span" bold faded>
                            &times;
                        </Text>
                    </Text>

                    <Box size={200} />
                    <Box flex>
                        <Text bold size={300}>
                            preact
                            <Text as="span" bold faded>
                                @{preact.version}
                            </Text>
                        </Text>
                        <Box size={200} />
                        <Text faded>{preact.description}</Text>
                    </Box>
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
    const preactResult = useRef();

    const fetchPackage = useCallback(async (name) => {
        try {
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
                times: Math.round(result.gzip / preact.gzip),
                preact
            });
        } catch (e) {
            if (e.message.indexOf('Failed') !== -1) {
                setRes({
                    error: true
                });
            }
        }
    }, []);

    return (
        <>
            <PurpleThing>
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
                    <path d="M0 0h1200v300L0 600V0z" fill={theme.colors.accent[100]} />
                </svg>
            </PurpleThing>
            <Content useShadow size={300} centered>
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
                        type="text"
                        autocorrect="off"
                        autocapitalize="none"
                        placeholder="type a package name"
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                fetchPackage(e.target.value);
                                e.target.blur();
                            }
                        }}
                    />
                </Box>
                <Box size={200} />
                <Box size={300}>
                    <Text size={100} faded as="a" href="https://bundlephobia.com">
                        Under the hood uses the bundlephobia.com API
                    </Text>
                </Box>
                <Box size={400} />
                {res ? (
                    res.error ? (
                        <ErrorCard size={300}>
                            <Text bold>
                                It seems that there's an error fetching the package info
                            </Text>
                            <Box size={100} />
                            <Text>Make sure the package name is correct</Text>
                        </ErrorCard>
                    ) : (
                        <Card {...res} />
                    )
                ) : null}
            </Content>
        </>
    );
}
