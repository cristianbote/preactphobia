import { styled } from 'goober';
import { theme } from '../../styles/theme';

export const Box = styled('div')(({ size, centered, horizontal, reactive, flex, full }) => [
    {
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        margin: 0,
        padding: theme.sizes[size] || 0,
        alignItems: centered ? 'center' : 'flex-start',
        justifyContent: centered ? 'center' : 'flex-start',
        flex: flex ? 1 : 0
    },
    full ? { width: '100%' } : null,
    reactive
        ? {
              flexDirection: 'row',
              [`@media all and (max-width: ${theme.widthSmall})`]: {
                  flexDirection: 'column'
              }
          }
        : null
]);
