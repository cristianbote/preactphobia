import { styled } from 'goober';
import { theme } from '../../styles/theme';

export const Text = styled('p')(({ size, faded, accent, bold }) => [
    {
        margin: 0,
        fontWeight: bold ? 'bold' : 'normal',
        fontSize: theme.fontSizes[size] || theme.fontSizes[200],
        color: 'currentcolor'
    },
    faded && { color: theme.colors.gray[300] },
    accent && { color: theme.colors.accent[300] }
]);
