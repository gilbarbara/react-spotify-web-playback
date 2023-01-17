import { ReactNode } from 'react';
interface Props {
    children: ReactNode;
    onClick: () => any;
}
export default function ClickOutside({ children, onClick, ...rest }: Props): JSX.Element;
export {};
