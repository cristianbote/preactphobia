const list = [
    'size',
    'centered',
    'horizontal',
    'reactive',
    'flex',
    'full',
    'onTop',
    'faded',
    'accent',
    'bold',
    'as',
    'useShadow',
    'useAnim',
    'useBorder'
];

export const shouldForwardProps = (props) => {
    for (let prop in props) {
        if (list.indexOf(prop) !== -1) {
            // props.__ = props.__ || {};
            // props.__[prop] = props[prop];
            delete props[prop];
        }
    }
};
