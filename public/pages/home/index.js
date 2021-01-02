import { styled } from 'goober';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import { Box } from '../../components/box/box';
import { Text } from '../../components/text/text';
import { theme } from '../../styles/theme';

const Form = styled('form')({
    width: '100%'
});

const Input = styled('input')({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: [theme.sizes[200], theme.sizes[300]].join(' '),
    border: 0,
    zIndex: 3,
    position: 'relative',
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
        maxWidth: theme.widthSmall,
        position: 'relative',
        zIndex: 1
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

const ShareButton = styled('button')({
    padding: theme.sizes[300],
    borderRadius: theme.sizes[200],
    fontSize: theme.fontSizes[200],
    border: 0,
    color: 'white',
    backgroundColor: theme.colors.accent[100],
    boxShadow: [0, theme.sizes[200], theme.sizes[300], theme.colors.gray[50]].join(' ')
});

const Package = ({ name, version, description }) => (
    <Box size={400} flex>
        <Text bold size={300}>
            {name}
            <Text as="span" bold faded>
                @{version}
            </Text>
        </Text>
        <Box size={200} />
        <Text faded>{description}</Text>
    </Box>
);

const Card = ({ name, version, description, times, preact }) => {
    return (
        <>
            <Box size={400} />
            <Content useAnim useBorder centered reactive>
                <Package name={name} version={version} description={description} />
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
                    <Package
                        name={'preact'}
                        version={preact.version}
                        description={preact.description}
                    />
                </Box>
            </Content>
            <Box size={300} />
            <Box size={400}>
                <ShareButton
                    onClick={() => {
                        let el = document.createElement('input');
                        el.style = 'opacity: 0; position: absolute;';
                        el.value = document.location.href;
                        document.body.appendChild(el);
                        el.focus();
                        el.select();
                        el.setSelectionRange(0, el.value.length);
                        document.execCommand('copy');
                        document.body.removeChild(el);

                        alert('Copied!');
                    }}
                >
                    Get the link
                </ShareButton>
            </Box>
            <Box size={300} />
            <Text
                as="a"
                accent
                href="https://preactjs.com/guide/v10/switching-to-preact"
                target="_blank"
                noopener
            >
                Ready to switch? Getting started with Preact
            </Text>
            <Box size={300} />
        </>
    );
};

function debounce(fn, ms) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(null, args), ms);
    };
}

const SuggestionWrapper = styled('div')({
    position: 'relative'
});

const SuggestionList = styled('ul')({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    listStyle: 'none',
    padding: 0,
    margin: ['-2px', 0, 0, 0].join(' '),
    border: 0,
    background: '#333',
    maxHeight: '35vh',
    overflow: 'auto',
    borderRadius: [0, 0, theme.sizes[200], theme.sizes[200]].join(' '),
    boxShadow: [0, theme.sizes[200], theme.sizes[300], theme.colors.gray[50]].join(' '),
    zIndex: 2
});

const SuggestionListItem = styled('li')({
    padding: '.5rem 1rem',
    cursor: 'pointer',
    '&:hover, &[aria-selected="true"]': {
        background: 'var(--accent-color)'
    },
    '& + &': {
        borderTop: '.0625rem solid var(--border-color)'
    }
});

function SuggestionItem({ item, active, onClick }) {
    const ref = useRef(null);

    useEffect(() => {
        if (active && ref.current) {
            // TODO: We want to get the ref of the element,
            // not of the goober component.
            ref.current.base.scrollIntoView({ block: 'nearest' });
        }
    }, [active]);

    return (
        <SuggestionListItem
            ref={ref}
            role="option"
            tabIndex={-1}
            aria-selected={active}
            onClick={onClick}
        >
            <PackageName
                dangerouslySetInnerHTML={{
                    __html: item.highlight
                }}
            />
            <PackageDescription>{item.package.description}</PackageDescription>
        </SuggestionListItem>
    );
}

const PackageName = styled('span')({
    display: 'block',
    marginBottom: '.25rem',
    em: {
        fontWeight: 'bold',
        fontStyle: 'normal'
    }
});

const PackageDescription = styled('span')({
    fontSize: '.9rem',
    fontWeight: 'lighter',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
});

const Anchor = styled('a')({
    textDecoration: 'none'
});

export default function Home() {
    const [res, setRes] = useState();
    const preactResult = useRef();
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [value, setValue] = useState('');

    // Load initial value from `?q=my-package` url component if set
    useEffect(() => {
        const initial = new URLSearchParams(location.search).get('p');
        if (initial) {
            fetchPackage(initial);
            setValue(initial);
        }
    }, []);

    const fetchSuggestions = useCallback(
        debounce(async (name) => {
            if (!name) {
                setSuggestions([]);
                return;
            }
            try {
                const result = await (
                    await fetch(`https://api.npms.io/v2/search/suggestions?q=${name}`)
                ).json();
                setSuggestions(result);
            } catch (e) {
                setRes({
                    error: true
                });
            }
        }, 300),
        []
    );

    const onInput = useCallback((e) => {
        const value = e.target.value;
        setValue(value);
        setShowSuggestions(true);
        fetchSuggestions(value);
    }, []);

    const fetchPackage = useCallback(async (name) => {
        try {
            const result = await (
                await fetch(`https://bundlephobia.com/api/size?package=${encodeURIComponent(name)}`)
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

            window.history.pushState(null, null, `/?p=${result.name}`);
        } catch (e) {
            if (e.message.indexOf('Failed') !== -1) {
                setRes({
                    error: true
                });
            }
        }
    }, []);

    // Hide suggestion box if user clicks outside
    useEffect(() => {
        const listener = (e) => {
            if (e.target.closest('ul[role="listbox"]') === null) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('click', listener);
        return () => {
            document.removeEventListener('click', listener);
        };
    }, []);

    return (
        <>
            <PurpleThing>
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
                    <path d="M0 0h1200v300L0 600V0z" fill={theme.colors.accent[100]} />
                </svg>
            </PurpleThing>
            <Content useShadow size={500} centered>
                <Anchor href="https://preactphobia.com">
                    <Text as="h1" size={400}>
                        <Text bold as="span">
                            Preact
                        </Text>
                        Phobia
                    </Text>
                </Anchor>
                <Box size={300}>
                    <Text faded>Find out how many copies of Preact can fit into a package</Text>
                </Box>
                <Box size={400} />
                <Box size={300} full>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const name =
                                selected > -1
                                    ? suggestions[selected].package.name
                                    : e.target.elements[0].value;
                            fetchPackage(name);
                            setValue(name);
                            setSelected(-1);
                            setShowSuggestions(false);
                        }}
                    >
                        <Input
                            type="text"
                            autocorrect="off"
                            autocapitalize="none"
                            placeholder="type a package name"
                            value={value}
                            onFocus={() => {
                                setShowSuggestions(true);
                                if (!suggestions.length) {
                                    fetchSuggestions(value);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setSelected(Math.min(selected + 1, suggestions.length - 1));
                                    if (!showSuggestions) {
                                        fetchSuggestions(value);
                                        setShowSuggestions(true);
                                    }
                                } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setSelected(Math.max(selected - 1, 0));
                                }
                            }}
                            onInput={onInput}
                        />
                        <SuggestionWrapper>
                            {suggestions.length > 0 && showSuggestions && (
                                <SuggestionList role="listbox" tabIndex={0}>
                                    {suggestions.map((item, i) => {
                                        return (
                                            <SuggestionItem
                                                key={item.package.name}
                                                active={selected === i}
                                                item={item}
                                                onClick={() => {
                                                    const name = item.package.name;
                                                    fetchPackage(name);
                                                    setValue(name);
                                                    setSelected(-1);
                                                    setSuggestions([]);
                                                }}
                                            />
                                        );
                                    })}
                                </SuggestionList>
                            )}
                        </SuggestionWrapper>
                    </Form>
                </Box>
                <Box size={300} />
                <Box size={400}>
                    <Text size={100} faded as="a" href="https://bundlephobia.com">
                        Under the hood, we use the bundlephobia.com API
                    </Text>
                </Box>
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
